package db_mysql

import (
	"database/sql"
	"fmt"
	"log"
	"os"

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

