package models

import (
	"database/sql"
	"time"
)

type User struct {
	UserID      int    `json:"user_id"`
	Forename    string `json:"forname"`
	Surname     string `json:"surname"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	Token       sql.NullString    `json:"token"`
	TokenExpiry sql.NullTime `json:"token_expiry"`
	Created     time.Time `json:"created"`
	
}
