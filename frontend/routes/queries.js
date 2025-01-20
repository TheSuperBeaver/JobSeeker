const express = require("express");
const router = express.Router();
const axios = require("axios");
const JobQueries = require("../models/JobQueries");
const JobQueryFilters = require("../models/JobQueryFilters");

// Fetch all queries
router.get("/", async (req, res) => {
  try {
    const jobQueries = await JobQueries.findAll({
      include: [
        {
          model: JobQueryFilters,
          as: "filters", // Use the alias defined in the model association
        },
      ],
    });

    res.render("queries", { queries: jobQueries });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Add a new query
router.post("/", async (req, res) => {
  try {
    const {
      search_term,
      town,
      country,
      query_google = false,
      query_indeed = false,
      query_linkedin = false,
      results,
      status,
    } = req.body;

    const newQuery = await JobQueries.create({
      search_term,
      town,
      country,
      query_google,
      query_indeed,
      query_linkedin,
      results,
      status,
    });

    res.status(201).json(newQuery);
  } catch (err) {
    res.status(500).json({ error: "Failed to create query" });
  }
});

router.post("/manualquery/:id", async (req, res) => {
  try {
    console.log("Trying to manual query")
    const queryId = req.params.id;
    const jobQuery = await JobQueries.findByPk(queryId);
    if (jobQuery == null) {
      console.log("jobQuery not found")
      return res.status(404).json({message : "jobQuery not found"})
    }
    console.log("Loaded jobQuery, now querying sites")

    if (jobQuery.query_indeed) {
      console.log("Query indeed")
      const data = {
        site_name: "indeed", 
        search_term: jobQuery.search_term,
        location: jobQuery.location || "Bruxelles, BE",
        filter_by_title: jobQuery.filter_by_title || [],
        results_wanted: jobQuery.results_wanted || 25,
        hours_old: jobQuery.hours_old || 24,
        country: jobQuery.country || "Belgium"
      };
      const pythonEndpoint = "http://127.0.0.1:5000/scrape_jobs"; 
      axios.post(pythonEndpoint, data)
        .catch(error => {
          console.error("Error sending request:", error);
        });
    }

    if (jobQuery.query_linkedin) {
      const data = {
        site_name: "linkedin", 
        search_term: jobQuery.search_term,
        location: jobQuery.location || "Bruxelles, BE",
        filter_by_title: jobQuery.filter_by_title || [],
        results_wanted: jobQuery.results_wanted || 25,
        hours_old: jobQuery.hours_old || 24,
        country: jobQuery.country || "Belgium"
      };
      const pythonEndpoint = "http://127.0.0.1:5000/scrape_jobs";
      axios.post(pythonEndpoint, data)
        .catch(error => {
          console.error("Error sending request:", error);
        });
    }

    if (jobQuery.query_google) {
      const data = {
        site_name: "google", 
        search_term: jobQuery.search_term,
        location: jobQuery.location || "Bruxelles, BE",
        filter_by_title: jobQuery.filter_by_title || [],
        results_wanted: jobQuery.results_wanted || 25,
        hours_old: jobQuery.hours_old || 24,
        country: jobQuery.country || "Belgium"
      };
      const pythonEndpoint = "http://127.0.0.1:5000/scrape_jobs";
      axios.post(pythonEndpoint, data)
        .catch(error => {
          console.error("Error sending request:", error);
        });
    }


    return res.status(200);
        
  } catch (err) {
    console.log(err)
    res.status(500).json({ error : "Failed to execute jobQuery" + err})
  }
});

router.put("/:id", async (req, res) => {
  try {
    const queryId = req.params.id;
    const { search_term, town, country, status } = req.body;

    const updatedQuery = await JobQueries.update(
      { search_term, town, country, status },
      { where: { id: queryId } }
    );

    if (updatedQuery[0] === 0) {
      return res.status(404).json({ error: "Query not found" });
    }

    res.status(200).json({ message: "Query updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update query" });
  }
});

router.get("/queries/:id", async (req, res) => {
  const queryId = req.params.id;
  const query = await JobQueries.getQueryById(queryId); // Replace with your database logic
  res.json(query);
});

// Add a new filter to a query
router.post("/:queryId/filters", async (req, res) => {
  try {
    const { queryId } = req.params;
    const { filter } = req.body;

    const newFilter = await JobQueryFilters.create({
      job_query_id: queryId,
      filter,
    });

    res.status(201).json(newFilter);
  } catch (err) {
    res.status(500).json({ error: "Failed to add filter" });
  }
});

// Delete a query
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await JobQueries.destroy({ where: { id } });
    res.status(200).json({ message: "Query deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete query" });
  }
});

// Delete a filter
router.delete("/:id", async (req, res) => {
  try {
    const queryId = req.params.id;

    // Find the query by ID and delete it
    const deletedQuery = await JobQueries.destroy({
      where: { id: queryId },
    });

    if (deletedQuery === 0) {
      return res.status(404).json({ error: "Query not found" });
    }

    res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete query" });
  }
});

module.exports = router;
