import datetime
import enum
import json
import pandas as pd
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


def insert_jobs_into_db(jobs, jobquery_id):
    """
    Inserts a list of job objects into the jobposts table.
    """
    try:
        rowcount = 0
        for _, job in jobs.iterrows():
            if isinstance(job, str):
                print(f"{job} is of type str, shouldn't happen")
                continue

            # Check if the job already exists
            existing_job = JobPost.query.filter_by(id=job.id).first()
            if existing_job:
                print(f"Job with site_id '{job.id}' already exists. Skipping...")
                continue

            locations = job.location.split(", ")
            town = locations[0]
            country = locations[-1]
            jobType = job.job_type

            new_job = JobPost(
                site_id=job.id,
                jobquery_id=jobquery_id,
                title=safe_value(job.title),
                company=safe_value(job.company),
                company_url=safe_value(job.company_url),
                job_url=job.job_url,
                site=identify_platform(job.id),
                location_country=safe_value(country),
                location_city=safe_value(town),
                location_state="",
                description=safe_value(job.description),
                job_type=safe_value(jobType),
                date_posted=safe_value(job.date_posted),
                emails=safe_value(job.emails),
                is_remote=safe_value(job.is_remote),
                job_level=safe_value(job.job_level),
                company_industry=safe_value(job.company_industry),
                company_addresses=safe_value(job.company_addresses),
                company_employees_label=safe_value(job.company_num_employees),
                company_revenue_label=safe_value(job.company_revenue),
                company_description=safe_value(job.company_description),
                company_logo=safe_value(job.company_logo),
                status="new",
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


def safe_value(value, default=None):
    """Returns None if value is NaN, otherwise returns the value itself."""
    return default if pd.isna(value) else value


def get_jobquery_by_id(jobquery_id):
    """Retrieve a job query by its ID."""
    return JobQueries.query.filter_by(id=jobquery_id).first()


def get_all_automatic_jobqueries():
    """Get all automatic job queries for the current hour."""
    return JobQueries.query.filter_by(
        status="automatic", hour_automatic_query=db.func.hour(db.func.now())
    ).all()


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


def json_encoder(obj):
    if isinstance(obj, enum.Enum):
        return obj.value
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")
