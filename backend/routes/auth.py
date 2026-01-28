from flask import Blueprint, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from db import users_collection
from datetime import datetime
from bson import ObjectId

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return {"error": "All fields required"}, 400

    if users_collection.find_one({"email": email}):
        return {"error": "User already exists"}, 400

    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": password_hash,
        "created_at": datetime.utcnow()
    })

    token = create_access_token(identity=email)

    return {"message": "Signup successful", "token": token}, 201
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Missing fields"}, 400

    user = users_collection.find_one({"email": email})

    if not user:
        return {"error": "User not found"}, 404

    if not bcrypt.check_password_hash(user["password"], password):
        return {"error": "Invalid password"}, 401

    token = create_access_token(identity=str(user["_id"]))

    return {
        "token": token,
        "email": user["email"]
    }, 200
from flask_jwt_extended import jwt_required, get_jwt_identity

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    return {
        "message": "Token is valid",
        "user_id": user_id
    }, 200
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()

    user = users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"password": 0}
    )

    if not user:
        return {"error": "User not found"}, 404

    user["_id"] = str(user["_id"])

    return user, 200