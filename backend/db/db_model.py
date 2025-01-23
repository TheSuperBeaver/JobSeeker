from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from datetime import datetime

db = SQLAlchemy()


class JobPost(db.Model):
    __tablename__ = "jobposts"

    id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.String, nullable=False)
    jobquery_id = db.Column(db.Integer, ForeignKey("jobqueries.id"))
    site = db.Column(db.String)
    title = db.Column(db.String, nullable=False)
    company = db.Column(db.String, nullable=False)
    company_url = db.Column(db.String)
    job_url = db.Column(db.String(1000))
    location_country = db.Column(db.String)
    location_city = db.Column(db.String)
    location_state = db.Column(db.String)
    description = db.Column(db.Text)
    job_type = db.Column(db.String)
    job_function_interval = db.Column(
        db.String, default=None
    )  # Can use Enum in SQLAlchemy if needed
    job_function_min_amount = db.Column(db.Numeric(10, 2))
    job_function_max_amount = db.Column(db.Numeric(10, 2))
    job_function_currency = db.Column(db.String)
    job_function_salary_source = db.Column(db.String)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    emails = db.Column(db.String)
    is_remote = db.Column(db.Boolean, default=False)
    job_level = db.Column(db.String)
    company_industry = db.Column(db.String)
    company_country = db.Column(db.String)
    company_addresses = db.Column(db.Text)
    company_employees_label = db.Column(db.String)
    company_revenue_label = db.Column(db.String)
    company_description = db.Column(db.Text)
    company_logo = db.Column(db.String)
    status = db.Column(db.String, default="new")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
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


class JobQueries(db.Model):
    __tablename__ = "jobqueries"

    id = db.Column(db.Integer, primary_key=True)
    search_term = db.Column(db.String(100), nullable=False)
    town = db.Column(db.String(255))
    country = db.Column(db.String(100), default="BE")
    query_google = db.Column(db.Boolean, default=False)
    query_indeed = db.Column(db.Boolean, default=False)
    query_linkedin = db.Column(db.Boolean, default=False)
    offset_google = db.Column(db.Integer, default=0)
    offset_indeed = db.Column(db.Integer, default=0)
    offset_linkedin = db.Column(db.Integer, default=0)
    results = db.Column(db.Integer, default=25)
    hour_automatic_query = db.Column(db.Integer, default=0)
    status = db.Column(db.String, default="manual")
    filters = db.Column(db.String, default="")

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
