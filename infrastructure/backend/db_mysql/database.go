package db_mysql

import (
	"fmt"
	"log"
	"os"
	"time"

	"backend/models"
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func ConnectDb () {
	err := godotenv.Load ()
	if err != nil {
		log.Fatal ("error loading .env file")
	}
	dsn := fmt.Sprintf ("%s:%s@tcp(%s)/%s?parseTime=true",
		os.Getenv ("DB_USER"),
		os.Getenv ("DB_PASS"),
		os.Getenv ("DB_HOST"),
		os.Getenv ("DB_NAME"))

	database, err := sql.Open ("mysql", dsn)
	if err != nil {
		log.Fatal ("failed to connect to the database:", err)
	}
	DB = database
	fmt.Println ("Connected to database")
}

func GetPost (limit, offset int) ([]models.PublicPost, error) {
	log.Println ("database.go/GetPost")
	var posts []models.PublicPost
	var now = time.Now ().UTC ().Add (time.Hour)
	log.Println ("now:", now)

	query := "SELECT id, uuid, title, content, author, publish_at FROM posts WHERE publish_at < ? LIMIT ? OFFSET ?"
	rows, err := DB.Query(query, now, limit, offset)
	log.Println ("Rows:", rows)
	if err != nil {
		return nil, fmt.Errorf("error querying posts: %v", err)
	}
	defer rows.Close ()

	for rows.Next () {
		var post models.PublicPost
		if err := rows.Scan (&post.ID,
			&post.Uuid,
			&post.Title,
			&post.Content,
			&post.Author,
			&post.PublishAt); err != nil {
			log.Println("Error scanning post:", err)
			continue
		}

		posts = append (posts, post)
	}

	if err := rows.Err (); err != nil {
		return nil, fmt.Errorf ("error iterating over posts: %v", err)
	}

	return posts, nil
}
