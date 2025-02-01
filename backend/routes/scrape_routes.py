from flask import Blueprint, jsonify
from db.db_model import JobQueries
from db.db_utils import get_country_by_code, insert_jobs_into_db
from jobspy import scrape_jobs

scrape_routes = Blueprint("scrape_routes", __name__)


@scrape_routes.route("/<int:id>", methods=["POST"])
def scrape_job_query(id):
    query = JobQueries.query.get(id)
    if not query:
        return jsonify({"error": "Job query not found"}), 404
    search_term = query.search_term if query.search_term else ""
    town = query.town
    country = query.country
    full_country = get_country_by_code(query.country)
    location = town + "," + country
    filters = query.filters
    results_wanted = query.results
    query_google = query.query_google
    offset_google = query.offset_google
    query_indeed = query.query_indeed
    offset_indeed = query.offset_indeed
    query_linkedin = query.query_linkedin
    offset_linkedin = query.offset_linkedin

    if filters:
        filter_by_title_list = [title.strip() for title in filters.split(",")]
    else:
        filter_by_title_list = []

    if query_google is True:
        google_job_results = scrape_jobs(
            site_name="google",
            search_term=search_term,
            location=location,
            locations=[location],
            filter_by_title=filter_by_title_list,
            results_wanted=results_wanted,
            offset=offset_google,
            hours_old=24,
            google_search_term=search_term
        )
        insert_jobs_into_db(google_job_results, id)
    if query_indeed is True:
        indeed_job_results = scrape_jobs(
            site_name="indeed",
            search_term=search_term,
            location=location,
            locations=[location],
            filter_by_title=filter_by_title_list,
            results_wanted=results_wanted,
            offset=offset_indeed,
            hours_old=24,
            country_indeed=full_country
        )
        insert_jobs_into_db(indeed_job_results, id)
    if query_linkedin is True:
        linkedin_job_results = scrape_jobs(
            site_name="linkedin",
            search_term=search_term,
            location=location,
            locations=[location],
            filter_by_title=filter_by_title_list,
            results_wanted=results_wanted,
            offset=offset_linkedin,
            hours_old=24,
            linkedin_fetch_description=True,
        )
        insert_jobs_into_db(linkedin_job_results, id)
    return jsonify(
        {
            "success": True,
            "google_jobs_scraped": len(locals().get("google_job_results", [])),
            "indeed_jobs_scraped": len(locals().get("indeed_job_results", [])),
            "linkedin_jobs_scraped": len(locals().get("linkedin_job_results", [])),
        }
    )
