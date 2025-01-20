from flask import Flask, request, jsonify
from jobspy import scrape_jobs
from db_utils import get_country_by_code, insert_jobs_into_db
from flask_cors import CORS

app = Flask(__name__)
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

        jobs = scrape_jobs(
            site_name=site_name,
            search_term=search_term,
            location=location,
            locations=[location],
            filter_by_title=[],
            results_wanted=results_wanted,
            hours_old=hours_old,
            country_indeed=country,
            linkedin_fetch_description=True
        )
        insert_jobs_into_db(jobs)
        return jsonify({"success": True, "jobs_scraped": len(jobs)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=False)
