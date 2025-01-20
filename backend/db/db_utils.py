import json
from sqlalchemy.exc import SQLAlchemyError
from jobspy import Country
from db.db_model import JobPost, JobQueries, db

def load_config(config_file="config.json"):
    """Load configuration from a JSON file."""
    with open(config_file, "r") as file:
        return json.load(file)

def get_country_by_code(country_code: str):
    """Retrieve the country name based on the ISO code."""
    country_code = country_code.lower()
    for country in Country:
        if country.value[1] == country_code:
            return country.name.capitalize()
    raise ValueError(f"Invalid country code: '{country_code}'.")

def insert_jobs_into_db(jobs):
    """
    Inserts a list of job objects into the jobposts table.
    """
    try:
        rowcount = 0
        for job in jobs:
            if isinstance(job, str):
                print(f"{job} is of type str, shouldn't happen")
                continue
            
            # Check if the job already exists
            existing_job = JobPost.query.filter_by(id=job.id).first()
            if existing_job:
                print(f"Job with site_id '{job.id}' already exists. Skipping...")
                continue

            country = job.location.country
            if isinstance(job.location.country, Country):
                country = job.location.country.name

            jobType = " - ".join(str(jt.name) for jt in job.job_type) if job.job_type else None

            new_job = JobPost(
                id=job.id,
                title=job.title,
                company=job.company_name if job.company_name else " ",
                company_url=job.company_url if job.company_url else " ",
                job_url=job.job_url,
                site=identify_platform(job.id),
                location_country=country,
                location_city=job.location.city,
                location_state=job.location.state,
                description=job.description,
                job_type=jobType,
                date_posted=job.date_posted,
                emails=", ".join(job.emails) if job.emails else None,
                is_remote=job.is_remote,
                job_level=job.job_level,
                company_industry=job.company_industry,
                company_addresses=job.company_addresses,
                company_employees_label=job.company_num_employees,
                company_revenue_label=job.company_revenue,
                company_description=job.company_description,
                company_logo=job.company_logo
            )

            db.session.add(new_job)
            rowcount += 1

        db.session.commit()
        print(f"{rowcount} job(s) inserted successfully.")
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Error while inserting data: {e}")
    finally:
        db.session.remove()

def get_jobquery_by_id(jobquery_id):
    """Retrieve a job query by its ID."""
    return JobQueries.query.filter_by(id=jobquery_id).first()

def get_all_automatic_jobqueries():
    """Get all automatic job queries for the current hour."""
    return JobQueries.query.filter_by(status="automatic", hour_automatic_query=db.func.hour(db.func.now())).all()

def identify_platform(input_string):
    """Identify the platform from the job site prefix."""
    if len(input_string) < 2:
        return None
    prefix = input_string[:2].lower()
    if prefix == "go":
        return "Google"
    elif prefix == "in":
        return "Indeed"
    elif prefix == "li":
        return "LinkedIn"
    else:
        return None

