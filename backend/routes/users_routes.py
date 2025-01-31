from flask import Blueprint, request, jsonify
from sqlalchemy import func
from db.auth_utils import get_capyx_token, validate_token
from db.db_model import JobUserStatus, db, JobQueries, JobPost, Users

users_routes = Blueprint("users_routes", __name__)


@users_routes.route("/", methods=["GET"])
def get_users():
    auth_header = request.headers.get("Authorization")
    email = request.headers.get("X-User-Email")

    if not auth_header or not email:
        return jsonify({"error": "Authorization token and email are required."}), 400

    capyx_user = get_capyx_token(auth_header, email)

    if not validate_token(capyx_user):
        return jsonify({"error": "Invalid access token."}), 401
    try:
        # Fetch users who have at least one JobUserStatus entry
        users = (
            Users.query.join(JobUserStatus, Users.id == JobUserStatus.user_id)
            .distinct()
            .all()
        )

        results = [
            {
                "id": user.id,
                "email": user.email,
                "capyx_id": user.capyx_id,
                "role_id": user.role_id,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "updated_at": user.updated_at.isoformat() if user.updated_at else None,
            }
            for user in users
        ]

        return jsonify({"users": results})
    except Exception as e:
        print(e)  # Log error
        return jsonify({"error": "Error fetching users."}), 500
