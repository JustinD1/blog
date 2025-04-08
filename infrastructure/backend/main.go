package main

import (
	"backend/db_mysql"
	"backend/routes"
	"os"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	db_mysql.ConnectDb ()

	r := gin.Default ()

	trustedProxy := os.Getenv ("API_URL")
	if trustedProxy == "" {
		log.Fatal ("API_URL env is not set")
	}
	r.SetTrustedProxies ([]string{trustedProxy})

	// Routes
	r.GET ("/", func (c *gin.Context) {
			c.JSON(200, gin.H{"message": "Backend is running..."})
	})

	// auth.go
	r.POST("/login", routes.LoginUser)

	// posts.go
	r.GET ("/posts", routes.GetPosts)
	r.GET ("/post/:id", routes.GetPost)
	r.POST ("/create_post", routes.CreatePost)

	// Start server
	port := os.Getenv ("API_PORT")
	if port == "" {
		log.Fatal ("API_PORT env is not set")
	}
	
	err:= r.Run (":" + port)
	if err != nil {
		log.Fatal ("Failed to start server. ", err)
	}
}
