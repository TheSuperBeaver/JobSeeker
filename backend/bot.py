from jobspy import scrape_jobs
from db_utils import insert_jobs_into_db

jobs = scrape_jobs(
    site_name=["indeed"],
    search_term="java",
    google_search_term="java developer",
    location="Bruxelles, BE",
    locations=["Bruxelles, BE"],
    results_wanted=20,
    hours_old=72,
    filter_by_title=[],
    country_indeed='Belgium'
)
print(f"Found {len(jobs)} jobs")
insert_jobs_into_db(jobs)

jobs = scrape_jobs(
    site_name=["linkedin"],
    search_term="java",
    google_search_term="java developer",
    location="Bruxelles, BE",
    locations=["Bruxelles, BE"],
    results_wanted=20,
    hours_old=72,
    filter_by_title=[],
    linkedin_fetch_description=True
)
print(f"Found {len(jobs)} jobs")
insert_jobs_into_db(jobs)

jobs = scrape_jobs(
    site_name=["google"],
    search_term="java",
    google_search_term="java",
    location="Bruxelles, BE",
    locations=["Bruxelles, BE"],
    results_wanted=20,
    filter_by_title=[],
    hours_old=72
)
print(f"Found {len(jobs)} jobs")
insert_jobs_into_db(jobs)