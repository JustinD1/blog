package routes

import (
	"net/http"
	"strconv"

	"backend/db_mysql"

	"github.com/gin-gonic/gin"
)

// Get all posts
func GetPosts (c *gin.Context){
	pageStr := c.DefaultQuery ("page", "1")
	page, err := strconv.Atoi (pageStr)

	if err != nil || page < 1 {
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

	offset := (page - 1) * limit

	posts, err := db_mysql.GetPost (limit, offset)
	if err != nil {
		c.JSON (http.StatusInternalServerError,
			gin.H{"error": "Error fetching posts"})
		return
	}

	c.JSON (http.StatusOK, gin.H{"posts": posts})
	
}

// Get a single post
func GetPost (c *gin.Context) {
	id := c.Param ("id")
	row := db_mysql.DB.QueryRow (
		"SELECT id, title, content FROM posts WHERE id = ?",
		id)

	var post map[string]any
	var title, content string
	var postId int
	err := row.Scan (&postId, &title, &content)
	if err != nil {
		c.JSON (http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	post = gin.H{"id": postId, "title": title, "content": content}
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
