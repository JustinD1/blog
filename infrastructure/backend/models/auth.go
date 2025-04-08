package models

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message  string `json:"message"`
	UserID   int    `json:"user_id"`
	Forename string `json:"forename"`
	Surname  string `json:"surname"`
	Token    string `json:"token"`
}
