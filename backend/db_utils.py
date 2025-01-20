import json
import mysql.connector
from mysql.connector import Error
from jobspy import Country


def load_config(config_file="config.json"):
    with open(config_file, "r") as file:
        return json.load(file)


def get_db_connection():
    try:
        config = load_config()
        db_config = config["db_config"]
        return mysql.connector.connect(
            host=db_config["host"],
            port=db_config["port"],
            database=db_config["database"],
            user=db_config["user"],
            password=db_config["password"],
        )
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        return None


def identify_platform(input_string):
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


def get_country_by_code(country_code: str):
    """
    Retrieve the country name based on the ISO code (e.g., "BE" -> "Belgium").
    """
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
        connection = get_db_connection()
        cursor = connection.cursor()

        check_query = "SELECT COUNT(*) FROM jobposts WHERE site_id = %s"
        insert_query = """
        INSERT INTO jobposts (
            site_id, title, company, company_url, job_url, site,
            location_country, location_city, location_state,
            description, job_type, job_function_interval, job_function_min_amount,
            job_function_max_amount, job_function_currency, job_function_salary_source,
            date_posted, emails, is_remote, job_level, company_industry,
            company_addresses, company_employees_label,
            company_revenue_label, company_description, company_logo
        )
        VALUES (
            %s, %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s, 
            %s, %s, %s, %s, %s, %s, 
            %s, %s, %s, %s, %s, %s, 
            %s, %s
        )
        """

        rowcount = 0

        for job in jobs:
            if(isinstance(job, str)):
                print(job + " is of type str, shouldn't happen")
                continue
            
            cursor.execute(check_query, (job.id,))
            exists = cursor.fetchone()[0] > 0

            if exists:
                print(f"Job with site_id '{job.id}' already exists. Skipping...")
                return

            country = job.location.country
            if isinstance(job.location.country, Country):
                country = job.location.country.name

            jobType = " - ".join(str(jt.name) for jt in job.job_type) if job.job_type else None

            data = (
                job.id,
                job.title,
                job.company_name if job.company_name else " ",
                job.company_url if job.company_url else " ",
                job.job_url,
                identify_platform(job.id),
                country,
                job.location.city,
                job.location.state,
                job.description.encode('utf-8'),
                jobType,
                None,
                None,
                None,
                None,
                None,
                job.date_posted,
                ", ".join(job.emails) if job.emails else None,
                int(job.is_remote) if job.is_remote else None,
                job.job_level,
                job.company_industry,
                job.company_addresses,
                job.company_num_employees,
                job.company_revenue,
                job.company_description,
                job.company_logo,
            )

            cursor.execute(insert_query, data)
            rowcount += cursor.rowcount

        connection.commit()
        print(f"{rowcount} job(s) inserted successfully.")
    except Error as e:
        print(f"Error while inserting data: {e}")
        connection.rollback()
    finally:
        cursor.close()
        connection.close()


def get_jobquery_by_id(id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM jobqueries WHERE id = %s", (id,))
        row = cursor.fetchone()
        return row
    except Error as e:
        print(f"Error while fetching job query: {e}")
    finally:
        cursor.close()
        connection.close()


def get_all_automatic_jobqueries():
    connection = None
    cursor = None
    try:
        # Get the database connection
        connection = get_db_connection()

        # Ensure the connection was successful
        if not connection:
            raise Exception("Failed to establish a database connection.")

        # Execute the query
        cursor = connection.cursor(
            dictionary=True
        )  # Use dictionary=True for easier handling of rows as dicts
        query = """
            SELECT * FROM jobqueries
            WHERE status = 'automatic'
            AND hour_automatic_query = HOUR(NOW());
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        return rows

    except Error as e:
        print(f"Error while fetching job queries: {e}")
        return []  # Return an empty list to avoid breaking the loop in the batch script

    finally:
        # Close the cursor if it exists
        if cursor:
            cursor.close()

        # Close the connection if it exists
        if connection:
            connection.close()


if __name__ == "__main__":
    config = load_config()
    db_config = config["db_config"]
