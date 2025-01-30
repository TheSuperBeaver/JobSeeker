from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from db.db_utils import json_encoder
from db.db_model import db
from config import Config
from routes.job_routes import job_routes
from routes.query_routes import query_routes


app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "X-User-Email"],
    methods=["GET", "POST", "OPTIONS"],
)
app.register_blueprint(job_routes, url_prefix="/jobs")
app.register_blueprint(query_routes, url_prefix="/queries")
app.json.default = json_encoder

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
