const express = require("express");
const router = express.Router();
const JobPost = require("../models/JobPost");
const marked = require("marked");

router.get("/:status?", async (req, res) => {
  const status = req.params.status || "all";
  const whereCondition = status !== "all" ? { status } : {};
  const order =
    status === "starred" ? [["status", "DESC"]] : [["date_posted", "DESC"]];

  try {
    const jobs = await JobPost.findAll({ where: whereCondition, order });
    const allJobsCount = await JobPost.count();
    const newJobsCount = await JobPost.count({ where: [{ status: "new" }] });
    const viewedJobsCount = await JobPost.count({
      where: [{ status: "viewed" }],
    });
    const starredJobsCount = await JobPost.count({
      where: [{ status: "starred" }],
    });
    const hiddenJobsCount = await JobPost.count({
      where: [{ status: "hidden" }],
    });

    res.json({
      jobs: jobs,
      allJobsCount,
      newJobsCount,
      viewedJobsCount,
      starredJobsCount,
      hiddenJobsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching jobs.");
  }
});

// Fetch a single job by ID
router.get("/:id", async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await JobPost.findByPk(jobId);

    if (!job) {
      return res.status(404).send("Job not found.");
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching job details.");
  }
});

// Update job status
router.post("/:id/status", async (req, res) => {
  const jobId = req.params.id;
  const { status } = req.body;

  try {
    const job = await JobPost.findByPk(jobId);

    if (!job) {
      return res.status(404).send("Job not found.");
    }

    job.status = status;
    await job.save();

    res.json({ id: jobId, status });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating job status.");
  }
});

// Load more jobs for infinite scrolling
router.get("/load-more", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Adjust the number of jobs per page as needed
  const offset = (page - 1) * limit;

  try {
    const jobs = await JobPost.findAll({
      limit,
      offset,
      order: [["date_posted", "DESC"]],
    });

    const processedJobs = jobs.map((job) => {
      const fullDescription = marked.parse(job.description || "");
      const shortDescription = marked.parse(
        (job.description || "").substring(0, 300) + "..."
      );
      return { ...job, fullDescription, shortDescription };
    });

    const hasMore = jobs.length === limit; // If fewer jobs than the limit, no more pages
    res.json({ processedJobs, hasMore });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading more jobs.");
  }
});

module.exports = router;
