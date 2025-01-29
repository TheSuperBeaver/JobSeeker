import os


class Config:
    MYSQL_HOST = os.getenv("MYSQL_HOST", "host.docker.internal")
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://jobspy:jobspy@{MYSQL_HOST}/jobspy"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
