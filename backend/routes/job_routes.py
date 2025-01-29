from flask import Blueprint, request, jsonify
from db.auth_utils import validate_token
from db.db_model import db, JobPost
import traceback

job_routes = Blueprint("job_routes", __name__)


@job_routes.route("/", methods=["GET"])
def get_jobs():
    statuses = request.args.get("status")
    query_id = request.args.get("queryId")

    status_list = [status.lower() for status in statuses.split(",")] if statuses else []

    where_condition = []

    if status_list:
        where_condition.append(JobPost.status.in_(status_list))

    if query_id:
        where_condition.append(JobPost.jobquery_id == query_id)

    order = (
        [JobPost.status.desc()]
        if "starred" in status_list
        else [JobPost.date_posted.desc()]
    )

    try:
        query = JobPost.query
        if where_condition:
            query = query.filter(*where_condition)

        jobs = query.order_by(*order).all()

        results = [{**job.__dict__, "status": job.status.value} for job in jobs]
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

    if not validate_token(auth_header, email):
        return jsonify({"error": "Invalid access token."}), 401

    status = request.json.get("status")
    if not status:
        return jsonify({"error": "Status is required."}), 400

    try:
        job = JobPost.query.get(id)
        if not job:
            return jsonify({"error": "Job not found."}), 404

        job.status = status
        db.session.commit()

        return jsonify({"id": id, "status": status})
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Error updating job status."}), 500
