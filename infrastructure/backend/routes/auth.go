package routes

import (
	"backend/db_mysql"
	"backend/models"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte (os.Getenv ("JWS_SECRET"))

func LoginUser(c *gin.Context) {
	var body models.LoginRequest
	var user models.User

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	err := db_mysql.DB.QueryRow (
		`SELECT id, forename, surname, password, token, token_expiry
                 FROM users
                 WHERE email = ?`,
		body.Email).Scan (
		&user.UserID,
		&user.Forename,
		&user.Surname,
		&user.Password,
		&user.Token,
		&user.TokenExpiry,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON (http.StatusUnauthorized,
				gin.H {"error": "Invalid email or password"})
			
		} else {
			c.JSON (http.StatusUnauthorized,
				gin.H {"error": "Server Error"})
			fmt.Printf ("Error %v", err)
		}
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password),
		[]byte(body.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	tokenString, err := GetTokenString (user)
	if err != nil {
		c.JSON (http.StatusInternalServerError,
			gin.H {"error": "Failed to update token"})
		return 
	}

	response := models.LoginResponse {
		Message:  "Login Successfull",
		UserID:   user.UserID,
		Forename: user.Forename,
		Surname:  user.Surname,
		Token:    tokenString,
	}
	c.JSON(http.StatusOK, response)
}

func UpdateUserTokenInformation (userId int, tokenExpiry time.Time, token string) (error) {
	_, err := db_mysql.DB.Exec ("UPDATE users SET token = ?, token_expiry = ? WHERE id = ?",
		token,
		tokenExpiry,
		userId)
	return err
}

func GetTokenString (user models.User ) (string, error) {
	tokenStillValid := user.Token.Valid &&
		user.TokenExpiry.Valid &&
		user.TokenExpiry.Time.After (time.Now ())

	if tokenStillValid {
		return user.Token.String, nil
	} else {
		expiration := time.Now ().Add (24 * time.Hour)

		claims := jwt.MapClaims {
			"user_id": user.UserID,
			"exp":     expiration.Unix (),
		}
		token := jwt.NewWithClaims (jwt.SigningMethodHS256, claims)

		tokenString, err := token.SignedString (jwtSecret)
		if err != nil {
			return "", err
		}
		err = UpdateUserTokenInformation (user.UserID, expiration, tokenString)
		if err != nil {
			return "", err
		}

		return tokenString, nil
	}
}
