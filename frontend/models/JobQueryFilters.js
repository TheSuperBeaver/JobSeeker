const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobQueryFilters = sequelize.define("JobQueryFilters", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  job_query_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "JobQueries",
      key: "id",
    },
  },
  filter: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

module.exports = JobQueryFilters;
