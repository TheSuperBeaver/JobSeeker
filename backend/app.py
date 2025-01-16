from flask import Flask, request, jsonify
from jobspy import scrape_jobs
from db_utils import insert_jobs_into_db

app = Flask(__name__)


@app.route("/scrape_jobs", methods=["POST"])
def scrape_jobs_endpoint():
    data = request.json
    try:
        site_name = data.get("site_name", ["indeed"])
        search_term = data.get("search_term", "")
        location = data.get("location", "Bruxelles, BE")
        filter_by_title = data.get("filter_by_title", [])
        results_wanted = data.get("results_wanted", 25)
        hours_old = data.get("hours_old", 24)
        country = data.get("country", "Belgium")

        jobs = scrape_jobs(
            site_name=site_name,
            search_term=search_term,
            location=location,
            locations=[location],
            filter_by_title=filter_by_title,
            results_wanted=results_wanted,
            hours_old=hours_old,
            country_indeed=country,
        )
        insert_jobs_into_db(jobs)
        return jsonify({"success": True, "jobs_scraped": len(jobs)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=False)
