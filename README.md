# Video App Backend

Flask backend for a video application with authentication using JWT and MongoDB.

## Features
- User Signup
- User Login
- JWT Authentication
- Protected Routes
- MongoDB Database
- Password Hashing with Bcrypt

## Tech Stack
- Python
- Flask
- MongoDB
- Flask-JWT-Extended
- Flask-Bcrypt

## Setup Instructions

1. Clone the repo:
git clone https://github.com/meghana-techie/video-app-backend.git

2. Go to backend folder:
cd video-app-backend/backend

3. Create virtual environment:
python -m venv venv
venv\Scripts\activate

4. Install dependencies:
pip install -r requirements.txt

5. Create .env file:
MONGO_URI=your_mongodb_url
JWT_SECRET_KEY=your_secret

6. Run server:
python app.py

Server runs at:
http://127.0.0.1:5000

## API Endpoints

POST /auth/signup  
POST /auth/login  

GET /auth/profile  
GET /auth/me  

Use Bearer token in Authorization header.

## Author
Meghana
