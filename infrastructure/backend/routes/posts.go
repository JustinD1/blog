package routes

import (
	"errors"
	"net/http"
	"strconv"

	"backend/db_mysql"
	"backend/enums"

	"github.com/gin-gonic/gin"
)

// Get all posts
func GetPosts (c *gin.Context, ViewType enums.ApiViewUserType){
	offestStr := c.DefaultQuery ("offset", "1")
	offset, err := strconv.Atoi (offestStr)

	if err != nil || offset < 0 {
		c.JSON (http.StatusBadRequest,
			gin.H{"error": "Invalid page number"})
		return
	}

	limitStr := c.DefaultQuery ("limit", "10")
	limit, err := strconv.Atoi (limitStr)

	if err != nil || limit < 1 {
		c.JSON (http.StatusBadRequest,
			gin.H{"error": "Invalid page limit"})
		return
	}

	posts, err := db_mysql.GetPosts (limit, offset, ViewType)
	if err != nil {
		c.JSON (http.StatusInternalServerError,
			gin.H{"error": "Error fetching posts"})
		return
	}

	c.JSON (http.StatusOK, gin.H{"posts": posts})
	
}

// Get a single post
func GetPost (c *gin.Context) {
	uuid := c.Param ("uuid")

	post, err := db_mysql.GetPost (uuid)

	if err != nil {
		if errors.Is (err, db_mysql.ErrPostNotPublished) {
			c.JSON (http.StatusNotFound, gin.H {"error":"Post not found"})
		} else {
			c.JSON (http.StatusInternalServerError,
				gin.H {"error": err.Error ()})
		}
		return
	}

	c.JSON (http.StatusOK, post)
}

// Create a new post
func CreatePost (c *gin.Context) {
	var body struct {
		Title   string `json:"title"`
		Content string `json:"content"`
		Author  string `json:"author"`
	}

	if err := c.BindJSON (&body); err != nil {
		c.JSON (http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := db_mysql.DB.Exec (
		"INSERT INTO posts (title, content, author) VALUES (?, ?, ?)",
		body.Title,
		body.Content,
		body.Author)
	if err != nil {
		c.JSON (http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON (http.StatusCreated, gin.H{"message": "Post created"})
}
