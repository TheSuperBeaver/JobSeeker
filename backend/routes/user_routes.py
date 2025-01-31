from flask import Blueprint, jsonify, request
from db.auth_utils import get_capyx_token, validate_token
from db.db_model import Users

user_routes = Blueprint("user_routes", __name__)


@user_routes.route("/", methods=["GET"])
def get_current_user():
    auth_header = request.headers.get("Authorization")
    email = request.headers.get("X-User-Email")

    if not auth_header or not email:
        return jsonify({"error": "Authorization token and email are required."}), 400

    capyx_user = get_capyx_token(auth_header, email)

    if not validate_token(capyx_user):
        return jsonify({"error": "Invalid access token."}), 401
    try:
        user = Users.query.filter_by(email=email).first()

        result = {
            "id": user.id,
            "email": user.email,
            "capyx_id": user.capyx_id,
            "role_id": user.role_id,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "updated_at": user.updated_at.isoformat() if user.updated_at else None,
        }

        return jsonify({"user": result})
    except Exception as e:
        print(e)  # Log error
        return jsonify({"error": "Error fetching user."}), 500
