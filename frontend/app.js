const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./config/database");
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Database sync failed:", err));

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ origin: "http://localhost:4200" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("charset", "utf-8");

app.use(
  "/bootstrap-icons",
  express.static(path.join(__dirname, "node_modules/bootstrap-icons/font"))
);

// Routes
const jobRoutes = require("./routes/jobs");
app.use("/jobs", jobRoutes);

const queriesRoutes = require("./routes/queries");
app.use("/queries", queriesRoutes);

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
