from flask import Blueprint, jsonify
from sqlalchemy import func
from db.db_model import db, JobQueries, JobPost

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
