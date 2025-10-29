const express = require('express');
const Job = require('../models/Job');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all jobs for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single job
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create job
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { jobTitle, jobDescription, lastDateForApplication, companyName } = req.body;

    // Validation
    if (!jobTitle || !jobDescription || !lastDateForApplication || !companyName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const job = new Job({
      jobTitle,
      jobDescription,
      lastDateForApplication: new Date(lastDateForApplication),
      companyName,
      postedBy: req.user._id
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update job
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { jobTitle, jobDescription, lastDateForApplication, companyName } = req.body;

    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.jobTitle = jobTitle || job.jobTitle;
    job.jobDescription = jobDescription || job.jobDescription;
    job.lastDateForApplication = lastDateForApplication ? new Date(lastDateForApplication) : job.lastDateForApplication;
    job.companyName = companyName || job.companyName;

    await job.save();
    res.json(job);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete job
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


