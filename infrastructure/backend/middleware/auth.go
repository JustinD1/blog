package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte (os.Getenv("JWS_SECRET"))

func AuthRequired () gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader ("Authorization")
		if authHeader == "" || !strings.HasPrefix (authHeader, "Bearer ") {
			c.AbortWithStatusJSON (http.StatusUnauthorized, gin.H{"error": "Authorization header missing or invalid"})
			return
		}

		tokenStr := strings.TrimPrefix (authHeader, "Bearer ")

		token, err := jwt.Parse (tokenStr, func (token *jwt.Token) (any, error) {
			if _, ok := token.Method. (*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrInvalidKeyType
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON (http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		if claims, ok := token.Claims. (jwt.MapClaims); ok {
			if userID, ok := claims["user_id"].(float64); ok {
				c.Set ("user_id", int(userID))
			}
		}

		c.Next()
	}
}
