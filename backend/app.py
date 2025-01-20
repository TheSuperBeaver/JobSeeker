from flask import Flask, request, jsonify
from jobspy import scrape_jobs
from flask_migrate import Migrate
from flask_cors import CORS
from db.db_model import db, JobPost
from db.db_utils import get_country_by_code, insert_jobs_into_db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://jobseekeruser:jobseeker@localhost/jobseeker'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

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
            filter_by_title_list = [title.strip() for title in filter_by_title.split(",")]
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
            linkedin_fetch_description=True
        )
        insert_jobs_into_db(jobs)
        return jsonify({"success": True, "jobs_scraped": len(jobs)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Fetch jobs based on status (with optional "status" parameter)
@app.route('/jobs/<status>', methods=['GET'])
@app.route('/jobs', methods=['GET'])
def get_jobs(status="all"):
    if status == "all":
        where_condition = {}
    else:
        where_condition = {"status": status}

    order = [JobPost.status.desc()] if status == "starred" else [JobPost.date_posted.desc()]

    try:
        jobs = JobPost.query.filter_by(**where_condition).order_by(*order).all()
        all_jobs_count = JobPost.query.count()
        new_jobs_count = JobPost.query.filter_by(status="new").count()
        viewed_jobs_count = JobPost.query.filter_by(status="viewed").count()
        starred_jobs_count = JobPost.query.filter_by(status="starred").count()
        hidden_jobs_count = JobPost.query.filter_by(status="hidden").count()

        return jsonify({
            "jobs": [job.to_dict() for job in jobs],
            "allJobsCount": all_jobs_count,
            "newJobsCount": new_jobs_count,
            "viewedJobsCount": viewed_jobs_count,
            "starredJobsCount": starred_jobs_count,
            "hiddenJobsCount": hidden_jobs_count
        })
    except Exception as e:
        print(e)
        return jsonify({"error": "Error fetching jobs."}), 500

# Fetch a single job by ID
@app.route('/jobs/<int:id>', methods=['GET'])
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
@app.route('/jobs/<int:id>/status', methods=['POST'])
def update_job_status(id):
    status = request.json.get('status')
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

if __name__ == "__main__":
    app.run(debug=False)
