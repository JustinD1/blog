package db_mysql

import (
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"backend/enums"
	"backend/models"
	"database/sql"

	"crypto/rand"
	"encoding/hex"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var DB *sql.DB

var ErrPostNotPublished = errors.New ("post not yet published")

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
}

func getPublicViewPosts (limit, offset int) ([]models.PublicPost, error) {
	var now = time.Now ().UTC ()

	var posts []models.PublicPost
	query := `
SELECT id, uuid, title, content, author, publish_at
FROM posts
WHERE publish_at < ?
ORDER BY publish_at DESC 
LIMIT ? OFFSET ?`
	rows, err := DB.Query(query, now, limit, offset)
	if err != nil {
		return nil, fmt.Errorf ("error querying posts: %v", err)
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

func getAdminViewPosts (limit, offset int) ([]models.Post, error) {
	var posts []models.Post

	query := `
SELECT id, uuid, title, content, author, publish_at, created, updated_at, count,
       is_draft
FROM posts
ORDER BY is_draft DESC,
         COALESCE(publish_at, created) DESC
LIMIT ? OFFSET ?
`
	rows, err := DB.Query(query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf ("error querying posts: %v", err)
	}
	defer rows.Close ()
	for rows.Next () {
		var post models.Post
		if err := rows.Scan (&post.ID,
			&post.Uuid,
			&post.Title,
			&post.Content,
			&post.Author,
			&post.PublishAt,
			&post.CreatedAt,
			&post.UpdatedAt,
			&post.Count,
			&post.IsDraft); err != nil {
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

func GetPosts (limit, offset int, ViewType enums.ApiViewUserType) (any, error) {
	switch ViewType {
	case enums.PublicView:
		return getPublicViewPosts (limit, offset);
	case enums.AdminView:
		return getAdminViewPosts (limit, offset);
	default:
		return nil, fmt.Errorf ("error unknown ApiViewUserType %s", ViewType);
	
	}
}

func GetPost (uuid string) (*models.PublicPost, error) {
	var post models.PublicPost
	var now = time.Now ().UTC ().Add (time.Hour)

	query := "SELECT id, uuid, title, content, author, publish_at FROM posts WHERE uuid = ?"
	row := DB.QueryRow (query, uuid)

	if err := row.Scan (&post.ID,
		&post.Uuid,
		&post.Title,
		&post.Content,
		&post.Author,
		&post.PublishAt); err != nil {
		return nil, ErrPostNotPublished
	}

	if post.PublishAt.Valid && post.PublishAt.Time.After (now) {
		return nil, ErrPostNotPublished
	}

	return &post, nil
}

func checkUUIDCollision (uuid string) (bool, error) {
	var count int
	query := `SELECT COUNT(*) FROM posts WHERE uuid=?`
	err := DB.QueryRow (query, uuid).Scan (&count)
	if err != nil {
		return false, fmt.Errorf ("error generating post UUID")
	}
	return count > 0, nil
}

func generateShortUUID (n, maxAttempts int) (string, error) {
	var uuid string

	for attempt := 0; attempt < maxAttempts; attempt++ {
		bytes := make ([]byte, n)
		_, err := rand.Read (bytes)
		if err != nil {
			return "", err
		}
		uuid = hex.EncodeToString (bytes)
		exists, err := checkUUIDCollision (uuid)
		if err != nil {
			return "", err
		}
		if !exists {
			return uuid, nil
		}
	}
	return "", fmt.Errorf ("failed to generate unique UUID after %d attempts", maxAttempts)
}

func CreatePost (post models.Post) (error) {
	uuid, err := generateShortUUID (4, 1000)
	if err != nil {
		return err
	}
	post.Uuid = uuid
	
	query := `INSERT INTO posts (
uuid, title, content, author, count, created, publish_at, is_draft
) VALUES (?, ?, ?, ?, 0, NOW(), ?, ?)`
	_, err = DB.Exec (
		query,
		post.Uuid,
		post.Title,
		post.Content,
		post.Author,
		post.PublishAt,
		post.IsDraft,
	)
	if err != nil {
		return fmt.Errorf ("error creating post: %v", err)
	}
	return nil
}
