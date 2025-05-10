package main

import (
	"backend/middleware"
	"backend/db_mysql"
	"backend/routes"
	"backend/enums"

	"os"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	db_mysql.ConnectDb ()

	r := gin.Default ()

	trustedProxy := os.Getenv ("API_URL")
	if trustedProxy == "" {
		log.Fatal ("API_URL env is not set")
	}
	r.SetTrustedProxies ([]string{trustedProxy})

	r.Use (cors.New (cors.Config{
		AllowOrigins:     []string{os.Getenv ("CORS_ALLOWED_ORIGIN")},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	setupPublicRoutes (r)
	setupAuthRoutes (r)
	setupPostRoutes (r)

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


func getPostHandler (ViewType enums.ApiViewUserType) gin.HandlerFunc {
	return func (c *gin.Context) {
		routes.GetPosts (c, ViewType)
	}
}

func setupPublicRoutes(r *gin.Engine) {
	r.GET ("/", func(c *gin.Context) {
		c.JSON (200, gin.H{"message": "Backend is running..."})
	})
}

func setupAuthRoutes(r *gin.Engine) {
	r.POST ("/login", routes.LoginUser)
}

func setupPostRoutes(r *gin.Engine) {
	r.GET ("/posts", getPostHandler (enums.PublicView))
	r.GET ("/post/:uuid", routes.GetPost)

	protected := r.Group ("/")
	protected.Use (middleware.AuthRequired ())
	protected.POST ("/create_post", routes.CreatePost)
	protected.GET ("/admin_view", getPostHandler (enums.AdminView))
}
