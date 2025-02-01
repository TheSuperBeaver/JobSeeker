from datetime import datetime
from flask import Blueprint, jsonify, request
from pymysql import IntegrityError
from sqlalchemy import func
from db.db_model import JobQueriesStatus, db, JobQueries, JobPost

query_routes = Blueprint("query_routes", __name__)


@query_routes.route("/", methods=["GET"])
def get_jobqueries():
    subquery = (
        db.session.query(JobPost.jobquery_id, func.count(JobPost.id).label("nb_jobs"))
        .group_by(JobPost.jobquery_id)
        .subquery()
    )

    query = db.session.query(JobQueries, subquery.c.nb_jobs).outerjoin(
        subquery, subquery.c.jobquery_id == JobQueries.id
    )

    results = []
    for jobquery, nb_jobs in query.all():
        jobquery_dict = {**jobquery.__dict__, "nb_jobs": nb_jobs or 0}
        jobquery_dict.pop("_sa_instance_state", None)
        results.append(jobquery_dict)

    return jsonify({"queries": results})


@query_routes.route("/", methods=["POST"])
def add_job_query():
    """Add a new job query"""
    data = request.json
    required_fields = ["search_term", "status"]

    # Validate required fields
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        new_query = JobQueries(
            search_term=data["search_term"],
            town=data.get("town"),
            country=data.get("country", "BE"),
            query_google=data.get("query_google", False),
            query_indeed=data.get("query_indeed", False),
            query_linkedin=data.get("query_linkedin", False),
            offset_google=data.get("offset_google", 0),
            offset_indeed=data.get("offset_indeed", 0),
            offset_linkedin=data.get("offset_linkedin", 0),
            results=data.get("results", 25),
            hour_automatic_query=data.get("hour_automatic_query", 0),
            status=JobQueriesStatus[data["status"]],  # Ensure valid enum
            filters=data.get("filters", ""),
        )
        db.session.add(new_query)
        db.session.commit()
        return jsonify(new_query.to_dict()), 201
    except KeyError:
        return jsonify({"error": "Invalid status value"}), 400
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@query_routes.route("/<int:id>", methods=["PUT"])
def modify_job_query(id):
    """Modify an existing job query"""
    query = JobQueries.query.get(id)
    if not query:
        return jsonify({"error": "Job query not found"}), 404

    data = request.json

    for key in [
        "search_term",
        "town",
        "country",
        "query_google",
        "query_indeed",
        "query_linkedin",
        "offset_google",
        "offset_indeed",
        "offset_linkedin",
        "results",
        "hour_automatic_query",
        "filters",
    ]:
        if key in data:
            setattr(query, key, data[key])

    if "status" in data:
        try:
            query.status = JobQueriesStatus[data["status"]]
        except KeyError:
            return jsonify({"error": "Invalid status value"}), 400

    query.updated_at = datetime.now()
    db.session.commit()

    return jsonify(query.to_dict()), 200


@query_routes.route("/<int:id>", methods=["DELETE"])
def delete_job_query(id):
    """Delete a job query by ID"""
    query = JobQueries.query.get(id)
    if not query:
        return jsonify({"error": "Job query not found"}), 404

    try:
        db.session.delete(query)
        db.session.commit()
        return jsonify({"message": "Job query deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
