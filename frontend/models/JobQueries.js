const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Define JobQueryFilters model
const JobQueryFilters = require("./JobQueryFilters");

const JobQueries = sequelize.define("JobQueries", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  search_term: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  town: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: "BE",
  },
  query_google: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  query_indeed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  query_linkedin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  offset_google: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  offset_indeed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  offset_linkedin: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  results: {
    type: DataTypes.INTEGER,
    defaultValue: 25,
  },
  hour_automatic_query: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("automatic", "manual", "deactivated"),
    defaultValue: "manual",
  },
});

// Association with JobQueryFilters
JobQueries.hasMany(JobQueryFilters, {
  foreignKey: "job_query_id",
  as: "filters",
});
JobQueryFilters.belongsTo(JobQueries, {
  foreignKey: "job_query_id",
  as: "jobQuery",
});

module.exports = JobQueries;
