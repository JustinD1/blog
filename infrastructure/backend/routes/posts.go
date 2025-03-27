package routes

import (
	"backend/db_mysql"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Get all posts
func GetPosts (c *gin.Context){
	rows, err := db_mysql.DB.Query ("SELECT id, title, content FROM posts")
	if err != nil {
		c.JSON (http.StatusInternalServerError, gin.H{"error": err.Error ()})
		return
	}
	defer rows.Close ()

	var posts []map[string]any
	for rows.Next () {
		var id int
		var title, content string
		rows.Scan (&id, &title, &content)

		posts = append (posts, gin.H{"id": id,
			"title": title,
			"content": content})
	}

	c.JSON (http.StatusOK, posts)
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
