from flask import Blueprint, request, jsonify
from db.auth_utils import validate_token, get_capyx_token
from db.db_model import JobUserStatus, Users, db, JobPost
import traceback

job_routes = Blueprint("job_routes", __name__)


@job_routes.route("/", methods=["GET"], strict_slashes=False)
def get_jobs():
    auth_header = request.headers.get("Authorization")
    email = request.headers.get("X-User-Email")

    if not auth_header or not email:
        return jsonify({"error": "Authorization token and email are required."}), 400

    capyx_user = get_capyx_token(auth_header, email)

    if not validate_token(capyx_user):
        return jsonify({"error": "Invalid access token."}), 401

    capyx_user_data = capyx_user.json()

    statuses = request.args.get("status")
    query_id = request.args.get("queryId")

    status_list = [status.lower() for status in statuses.split(",")] if statuses else []

    where_condition = []

    if status_list:
        where_condition.append(JobPost.status.in_(status_list))

    if query_id:
        where_condition.append(JobPost.jobquery_id == query_id)

    try:
        userId = request.args.get("userId")
        if not userId:
            user = Users.query.filter_by(email=email).first()
            if not user:
                user = Users(
                    email=email,
                    capyx_id=capyx_user_data.get("id"),
                    role_id=capyx_user_data.get("roleId"),
                )
                db.session.add(user)
                db.session.commit()
            userId = user.id

        subquery = (
            db.session.query(JobUserStatus.job_id, JobUserStatus.status)
            .filter(JobUserStatus.user_id == userId)
            .subquery()
        )
        query = db.session.query(JobPost, subquery.c.status).outerjoin(
            subquery, JobPost.id == subquery.c.job_id
        )

        order = (
            [subquery.c.status.desc()]
            if "starred" in status_list
            else [JobPost.date_posted.desc()]
        )

        if where_condition:
            query = query.filter(*where_condition)

        jobs = query.order_by(*order).all()

        results = [
            {
                **job[0].__dict__,
                "status": job[1].value if job[1] else "new",
            }
            for job in jobs
        ]
        for job in results:
            job.pop("_sa_instance_state", None)

        return jsonify({"jobs": results})
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Error fetching jobs."}), 500


@job_routes.route("/<int:id>", methods=["GET"])
def get_job(id):
    try:
        job = JobPost.query.get(id)
        if not job:
            return jsonify({"error": "Job not found."}), 404
        return jsonify(job.to_dict())
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Error fetching job details."}), 500


@job_routes.route("/<int:id>/status", methods=["POST"])
def update_job_status(id):
    auth_header = request.headers.get("Authorization")
    email = request.headers.get("X-User-Email")

    if not auth_header or not email:
        return jsonify({"error": "Authorization token and email are required."}), 400

    capyx_user = get_capyx_token(auth_header, email)
    capyx_user_data = capyx_user.json()

    if not validate_token(capyx_user):
        return jsonify({"error": "Invalid access token."}), 401

    status = request.json.get("status")
    if not status:
        return jsonify({"error": "Status is required."}), 400

    try:
        job = JobPost.query.get(id)
        if not job:
            return jsonify({"error": "Job not found."}), 404

        user = Users.query.get(email)
        if not user:
            user = Users(
                email=email,
                capyx_id=capyx_user_data.get("id"),
                role_id=capyx_user_data.get("roleId"),
            )
            db.session.add(user)
            db.session.commit()

        status = JobUserStatus(job_id=id, user_id=user.id, status=status)
        db.session.add(status)
        db.session.commit()

        return jsonify({"id": status.id, "status": status.status})
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Error updating job status."}), 500
