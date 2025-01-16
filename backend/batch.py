from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from jobspy import scrape_jobs
from db_utils import (
    get_all_automatic_jobqueries,
    insert_jobs_into_db,
    get_country_by_code,
)
import time


def check_job_queries():
    print("Checking for scheduled job queries...")
    try:
        jobs = get_all_automatic_jobqueries()

        for job in jobs:
            if job.get("query_google") == 1:
                job_results = scrape_jobs(
                    site_name="google",
                    search_term=job.get("search_term"),
                    location=f"{job.get('town')}, {job.get('country')}",
                    locations=[f"{job.get('town')}, {job.get('country')}"],
                    filter_by_title=[],
                    results_wanted=job.get("results", 0),
                    hours_old=24,
                )
                insert_jobs_into_db(job_results)
            if job.get("query_indeed") == 1:
                job_results = scrape_jobs(
                    site_name="indeed",
                    search_term=job.get("search_term"),
                    location=f"{job.get('town')}, {job.get('country')}",
                    locations=[f"{job.get('town')}, {job.get('country')}"],
                    filter_by_title=[],
                    results_wanted=job.get("results", 0),
                    hours_old=24,
                    country_indeed=get_country_by_code(job.get("country")),
                )
                insert_jobs_into_db(job_results)
            if job.get("query_linkedin") == 1:
                job_results = scrape_jobs(
                    site_name="linkedin",
                    search_term=job.get("search_term"),
                    location=f"{job.get('town')}, {job.get('country')}",
                    locations=[f"{job.get('town')}, {job.get('country')}"],
                    filter_by_title=[],
                    results_wanted=job.get("results", 0),
                    hours_old=24,
                )
                insert_jobs_into_db(job_results)

        print("Job check completed.")
    except Exception as e:
        print(f"Error checking job queries: {e}")


if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_job_queries, CronTrigger(hour="*"))

    try:
        scheduler.start()
        print("Scheduler started. Waiting for tasks...")
        while True:
            time.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        print("Scheduler stopped.")
