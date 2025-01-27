from flask import Flask, request, jsonify
from jobspy import scrape_jobs
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy import func
from db.db_model import db, JobPost, JobQueries
from db.db_utils import get_country_by_code, insert_jobs_into_db

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://jobspy:jobspy@localhost/jobspy"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)


@app.route("/scrape_jobs", methods=["POST"])
def scrape_jobs_endpoint():
    print("Going to scrape jobs")
    print("Data received :")
    data = request.json
    print(data)
    try:
        site_name = data.get("site_name", ["indeed"])
        search_term = data.get("search_term", "")
        location = data.get("location", "Bruxelles, BE")
        filter_by_title = data.get("filter_by_title", [])
        results_wanted = data.get("results_wanted", 25)
        hours_old = data.get("hours_old", 24)
        country = get_country_by_code(data.get("country", "BE"))

        if filter_by_title:
            filter_by_title_list = [
                title.strip() for title in filter_by_title.split(",")
            ]
        else:
            filter_by_title_list = []

        jobs = scrape_jobs(
            site_name=site_name,
            search_term=search_term,
            location=location,
            locations=[location],
            filter_by_title=filter_by_title_list,
            results_wanted=results_wanted,
            hours_old=hours_old,
            country_indeed=country,
            linkedin_fetch_description=True,
        )
        insert_jobs_into_db(jobs)
        return jsonify({"success": True, "jobs_scraped": len(jobs)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/jobs", methods=["GET"])
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

        results = []
        for job in jobs:
            job_dict = {**job.__dict__}
            if "status" in job_dict:
                job_dict["status"] = job_dict["status"].value
            job_dict.pop("_sa_instance_state", None)
            results.append(job_dict)

        count_filters = {"jobquery_id": query_id} if query_id else {}

        new_jobs_count = JobPost.query.filter_by(status="new", **count_filters).count()
        viewed_jobs_count = JobPost.query.filter_by(
            status="viewed", **count_filters
        ).count()
        starred_jobs_count = JobPost.query.filter_by(
            status="starred", **count_filters
        ).count()
        hidden_jobs_count = JobPost.query.filter_by(
            status="hidden", **count_filters
        ).count()

        return jsonify(
            {
                "jobs": results,
                "newJobsCount": new_jobs_count,
                "viewedJobsCount": viewed_jobs_count,
                "starredJobsCount": starred_jobs_count,
                "hiddenJobsCount": hidden_jobs_count,
            }
        )
    except Exception as e:
        print(e)
        return jsonify({"error": "Error fetching jobs."}), 500


# Fetch a single job by ID
@app.route("/jobs/<int:id>", methods=["GET"])
def get_job(id):
    try:
        job = JobPost.query.get(id)
        if not job:
            return jsonify({"error": "Job not found."}), 404
        return jsonify(job.to_dict())
    except Exception as e:
        print(e)
        return jsonify({"error": "Error fetching job details."}), 500


# Update job status
@app.route("/jobs/<int:id>/status", methods=["POST"])
def update_job_status(id):
    auth_header = request.headers.get("Authorization")
    email = request.headers.get("X-User-Email")

    if not auth_header or not email:
        return jsonify({"error": "Authorization token and email are required."}), 400

    # Validate the access token
    try:
        response = request.get(
            f"https://api.capyx.be/v1/users/{email}",
            headers={"Authorization": f"{auth_header}"},
        )
        if response.status_code != 200:
            return jsonify({"error": "Invalid access token."}), 401
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to validate token."}), 401

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
    except Exception as e:
        print(e)
        return jsonify({"error": "Error updating job status."}), 500


@app.route("/queries/", methods=["GET"])
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
        if "status" in jobquery_dict:
            jobquery_dict["status"] = jobquery_dict["status"].value
        jobquery_dict.pop("_sa_instance_state", None)
        results.append(jobquery_dict)

    return jsonify({"queries": results})


if __name__ == "__main__":
    app.run(debug=False)
