const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
  filters: {
    type: DataTypes.STRING,
    defaultValue: ""
  }
});

module.exports = JobQueries;
