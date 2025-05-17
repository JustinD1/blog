package models

import (
	"time"
	"database/sql"
)

type Post struct {
	ID        int          `json:"id"`
	Uuid      string       `json:"uuid"`
	Title     string       `json:"title"`
	Content   string       `json:"content"`
	Author    string       `json:"author"`
	CreatedAt time.Time    `json:"created_at"`
	PublishAt sql.NullTime `json:"publish_at"`
	UpdatedAt sql.NullTime `json:"updated_at"`
	Count     int          `json:"count"`
	IsDraft   bool         `json:"is_draft"`
}

type PublicPost struct {
	ID        int          `json:"id"`
	Uuid      string       `json:"uuid"`
	Title     string       `json:"title"`
	Content   string       `json:"content"`
	Author    string       `json:"author"`
	PublishAt sql.NullTime `json:"publish_at"`
}

type CreatePost struct {
	Title     string       `json:"title"`
	Content   string       `json:"content"`
	Author    string       `json:"author"`
	PublishAt sql.NullTime `json:"publish_at"`
	IsDraft   bool         `json:"is_draft"`
}
