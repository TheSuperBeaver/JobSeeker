import os
from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from db.db_utils import json_encoder
from db.db_model import db
from config import Config
from routes.job_routes import job_routes
from routes.query_routes import query_routes
from routes.users_routes import users_routes
from routes.user_routes import user_routes
from routes.scrape_routes import scrape_routes

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "X-User-Email"],
    methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
)
app.register_blueprint(job_routes, url_prefix="/jobs")
app.register_blueprint(query_routes, url_prefix="/queries")
app.register_blueprint(users_routes, url_prefix="/users")
app.register_blueprint(user_routes, url_prefix="/user")
app.register_blueprint(scrape_routes, url_prefix="/scrape")
app.json.default = json_encoder

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
