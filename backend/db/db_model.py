import enum
from flask import json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, Enum
from datetime import datetime

db = SQLAlchemy()


class JobType(enum.Enum):
    fulltime: 1
    parttime: 2
    internship: 3
    contract: 4

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


class JobStatus(enum.Enum):
    new = "new"
    viewed = "viewed"
    starred = "starred"
    hidden = "hidden"

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


class JobPost(db.Model):
    __tablename__ = "jobposts"

    id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.String(255, collation="utf8_bin"), nullable=False)
    jobquery_id = db.Column(db.Integer, ForeignKey("jobqueries.id"), nullable=False)
    site = db.Column(db.String(255, collation="utf8_bin"))
    title = db.Column(db.String(255, collation="utf8_bin"), nullable=False)
    company = db.Column(db.String(255, collation="utf8_bin"), nullable=False)
    company_url = db.Column(db.String(255, collation="utf8_bin"))
    job_url = db.Column(db.String(1000, collation="utf8_bin"))
    location_country = db.Column(db.String(255, collation="utf8_bin"))
    location_city = db.Column(db.String(255, collation="utf8_bin"))
    location_state = db.Column(db.String(255, collation="utf8_bin"))
    description = db.Column(db.Text(collation="utf8_bin"))
    job_type = db.Column(Enum(JobType, collation="utf8_bin"))
    job_function_interval = db.Column(
        db.String(255, collation="utf8_bin"), default=None
    )
    job_function_min_amount = db.Column(db.Numeric(10, 2))
    job_function_max_amount = db.Column(db.Numeric(10, 2))
    job_function_currency = db.Column(db.String(255, collation="utf8_bin"))
    job_function_salary_source = db.Column(db.String(255, collation="utf8_bin"))
    date_posted = db.Column(db.DateTime, default=datetime.now())
    emails = db.Column(db.String(1000, collation="utf8_bin"))
    is_remote = db.Column(db.Boolean, default=False)
    job_level = db.Column(db.String(255, collation="utf8_bin"))
    company_industry = db.Column(db.String(255, collation="utf8_bin"))
    company_country = db.Column(db.String(255, collation="utf8_bin"))
    company_addresses = db.Column(db.Text(collation="utf8_bin"))
    company_employees_label = db.Column(db.String(255, collation="utf8_bin"))
    company_revenue_label = db.Column(db.String(255, collation="utf8_bin"))
    company_description = db.Column(db.Text(collation="utf8_bin"))
    company_logo = db.Column(db.String(1000, collation="utf8_bin"))
    status = db.Column(Enum(JobStatus, collation="utf8_bin"))
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now(),
        onupdate=datetime.now(),
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "site_id": self.site_id,
            "site": self.site,
            "title": self.title,
            "company": self.company,
            "company_url": self.company_url,
            "job_url": self.job_url,
            "location_country": self.location_country,
            "location_city": self.location_city,
            "location_state": self.location_state,
            "description": self.description,
            "job_type": self.job_type,
            "job_function_interval": self.job_function_interval,
            "job_function_min_amount": str(self.job_function_min_amount),
            "job_function_max_amount": str(self.job_function_max_amount),
            "job_function_currency": self.job_function_currency,
            "job_function_salary_source": self.job_function_salary_source,
            "date_posted": self.date_posted.isoformat() if self.date_posted else None,
            "emails": self.emails,
            "is_remote": self.is_remote,
            "job_level": self.job_level,
            "company_industry": self.company_industry,
            "company_country": self.company_country,
            "company_addresses": self.company_addresses,
            "company_employees_label": self.company_employees_label,
            "company_revenue_label": self.company_revenue_label,
            "company_description": self.company_description,
            "company_logo": self.company_logo,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


class JobQueriesStatus(enum.Enum):
    automatic = "automatic"
    manual = "manual"
    deactivated = "deactivated"

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


class JobQueries(db.Model):
    __tablename__ = "jobqueries"

    id = db.Column(db.Integer, primary_key=True)
    search_term = db.Column(db.String(100, collation="utf8_bin"), nullable=False)
    town = db.Column(db.String(255, collation="utf8_bin"))
    country = db.Column(db.String(100, collation="utf8_bin"), default="BE")
    query_google = db.Column(db.Boolean, default=False)
    query_indeed = db.Column(db.Boolean, default=False)
    query_linkedin = db.Column(db.Boolean, default=False)
    offset_google = db.Column(db.Integer, default=0)
    offset_indeed = db.Column(db.Integer, default=0)
    offset_linkedin = db.Column(db.Integer, default=0)
    results = db.Column(db.Integer, default=25)
    hour_automatic_query = db.Column(db.Integer, default=0)
    status = db.Column(Enum(JobQueriesStatus, collation="utf8_bin"))
    filters = db.Column(db.String(1000, collation="utf8_bin"), default="")
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now(),
        onupdate=datetime.now(),
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "search_term": self.search_term,
            "town": self.town,
            "country": self.country,
            "query_google": self.query_google,
            "query_indeed": self.query_indeed,
            "query_linkedin": self.query_linkedin,
            "offset_google": self.offset_google,
            "offset_indeed": self.offset_indeed,
            "offset_linkedin": self.offset_linkedin,
            "results": self.results,
            "hour_automatic_query": self.hour_automatic_query,
            "status": self.status,
            "filters": self.filters,
        }
