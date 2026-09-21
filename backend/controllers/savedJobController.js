const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Get current user's saved jobs
// @route   GET /api/saved-jobs
// @access  Private (Job Seeker)
const getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.find({ userId: req.user._id })
      .populate({
        path: 'jobId',
        populate: {
          path: 'recruiterId',
          select: 'name email profileImage',
        },
      })
      .sort({ savedAt: -1 });

    // Filter out any jobs that might have been deleted
    const validSavedJobs = savedJobs.filter((item) => item.jobId !== null);

    res.status(200).json({
      success: true,
      count: validSavedJobs.length,
      savedJobs: validSavedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a job
// @route   POST /api/saved-jobs
// @access  Private (Job Seeker)
const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required',
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    const existing = await SavedJob.findOne({
      userId: req.user._id,
      jobId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Job is already saved in your bookmarks',
      });
    }

    const savedJob = await SavedJob.create({
      userId: req.user._id,
      jobId,
    });

    res.status(201).json({
      success: true,
      message: 'Job saved to your bookmarks',
      savedJob,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a job from saved jobs
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private (Job Seeker)
const removeSavedJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const saved = await SavedJob.findOneAndDelete({
      userId: req.user._id,
      jobId,
    });

    if (!saved) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job removed from saved jobs',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSavedJobs,
  saveJob,
  removeSavedJob,
};
