const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobPost = sequelize.define(
  "jobpost",
  {
    site_id: { type: DataTypes.STRING, allowNull: false },
    site: DataTypes.STRING,
    title: { type: DataTypes.STRING, allowNull: false },
    company: { type: DataTypes.STRING, allowNull: false },
    company_url: DataTypes.STRING,
    job_url: DataTypes.STRING(1000),
    location_country: DataTypes.STRING,
    location_city: DataTypes.STRING,
    location_state: DataTypes.STRING,
    description: DataTypes.TEXT,
    job_type: DataTypes.STRING,
    job_function_interval: DataTypes.ENUM(
      "yearly",
      "monthly",
      "weekly",
      "daily",
      "hourly"
    ),
    job_function_min_amount: DataTypes.DECIMAL(10, 2),
    job_function_max_amount: DataTypes.DECIMAL(10, 2),
    job_function_currency: DataTypes.STRING,
    job_function_salary_source: DataTypes.ENUM("direct_data", "description"),
    date_posted: DataTypes.DATE,
    emails: DataTypes.STRING,
    is_remote: { type: DataTypes.BOOLEAN, defaultValue: false },
    job_level: DataTypes.STRING,
    company_industry: DataTypes.STRING,
    company_country: DataTypes.STRING,
    company_addresses: DataTypes.TEXT,
    company_employees_label: DataTypes.STRING,
    company_revenue_label: DataTypes.STRING,
    company_description: DataTypes.TEXT,
    company_logo: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("new", "viewed", "hidden", "starred"),
      defaultValue: "new",
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    timestamps: false,
  }
);

module.exports = JobPost;
