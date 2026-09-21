const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const RecruiterProfile = require('../models/RecruiterProfile');
const User = require('../models/User');

// Helper to check user ID from optional Bearer token
const getUserIdFromAuthHeader = (req) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'jobconnect_super_secret_jwt_key_2025_secure_xyz987'
      );
      return decoded.id;
    }
  } catch (err) {
    return null;
  }
  return null;
};

// @desc    Get all jobs with search, multi-faceted filtering, sorting, and pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      company,
      companyId,
      location,
      jobType,
      experienceLevel,
      workMode,
      minSalary,
      maxSalary,
      datePosted,
      status = 'Active',
      sort = 'latest',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Status filter (default Active)
    if (status && status !== 'all') {
      query.status = status;
    }

    // Keyword search across title, description, skills, companyName
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { companyName: regex },
        { skills: { $in: [regex] } },
      ];
    }

    // Company filter (by ObjectId or name)
    const targetComp = companyId || company;
    if (targetComp && targetComp !== 'All') {
      if (mongoose.Types.ObjectId.isValid(targetComp)) {
        const compObjId = new mongoose.Types.ObjectId(targetComp);
        query.$or = query.$or
          ? [{ companyId: compObjId }, { companyName: targetComp }, ...query.$or]
          : [{ companyId: compObjId }, { companyName: targetComp }];
      } else {
        const compRegex = new RegExp(targetComp.trim(), 'i');
        query.companyName = compRegex;
      }
    }

    // Location search
    if (location && location !== 'All') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Job Type filter
    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    // Experience Level filter
    if (experienceLevel && experienceLevel !== 'All') {
      query.experienceLevel = experienceLevel;
    }

    // Work Mode filter
    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }

    // Salary range
    if (minSalary) {
      query.salaryMax = { $gte: Number(minSalary) };
    }
    if (maxSalary) {
      query.salaryMin = { $lte: Number(maxSalary) };
    }

    // Date posted filter
    if (datePosted && datePosted !== 'any') {
      const now = new Date();
      let days = 30;
      if (datePosted === '24h') days = 1;
      else if (datePosted === '7d') days = 7;
      else if (datePosted === '14d') days = 14;
      else if (datePosted === '30d') days = 30;

      const sinceDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      query.createdAt = { $gte: sinceDate };
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default latest
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'salary_high') {
      sortOptions = { salaryMax: -1 };
    } else if (sort === 'salary_low') {
      sortOptions = { salaryMin: 1 };
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiterId', 'name email profileImage')
      .populate('companyId', 'name logo category industry headquarters indiaLocations isVerified')
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // If authenticated user, annotate jobs with saved status
    const currentUserId = getUserIdFromAuthHeader(req);
    let savedJobIds = new Set();
    let appliedJobIds = new Set();

    if (currentUserId) {
      const saved = await SavedJob.find({ userId: currentUserId }).select('jobId');
      savedJobIds = new Set(saved.map((s) => s.jobId.toString()));

      const applied = await Application.find({ applicantId: currentUserId }).select('jobId');
      appliedJobIds = new Set(applied.map((a) => a.jobId.toString()));
    }

    const enrichedJobs = jobs.map((job) => {
      const jobObj = job.toObject();
      jobObj.isSaved = savedJobIds.has(job._id.toString());
      jobObj.hasApplied = appliedJobIds.has(job._id.toString());

      // Dynamically pull name and logo from Company model if populated
      if (jobObj.companyId && typeof jobObj.companyId === 'object') {
        jobObj.companyName = jobObj.companyId.name || jobObj.companyName;
        jobObj.companyLogo = jobObj.companyId.logo || jobObj.companyLogo;
        jobObj.isVerified = Boolean(jobObj.companyId.isVerified);
        jobObj.companyCategory = jobObj.companyId.category;
      }

      return jobObj;
    });

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      jobs: enrichedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiterId', 'name email profileImage')
      .populate('companyId', 'name logo category industry headquarters indiaLocations website companySize foundedYear isVerified description');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Get company profile if available
    const recruiterProfile = await RecruiterProfile.findOne({
      userId: job.recruiterId?._id,
    });

    const jobObj = job.toObject();
    jobObj.recruiterProfile = recruiterProfile;

    // Dynamically pull verified status and updated company details
    if (jobObj.companyId && typeof jobObj.companyId === 'object') {
      jobObj.companyName = jobObj.companyId.name || jobObj.companyName;
      jobObj.companyLogo = jobObj.companyId.logo || jobObj.companyLogo;
      jobObj.isVerified = Boolean(jobObj.companyId.isVerified);
      jobObj.companyCategory = jobObj.companyId.category;
      jobObj.companyIndustry = jobObj.companyId.industry;
      jobObj.companyLocations = jobObj.companyId.indiaLocations;
      jobObj.companyWebsite = jobObj.companyId.website;
    }

    // Check if current user has applied or saved this job
    const currentUserId = getUserIdFromAuthHeader(req);
    jobObj.hasApplied = false;
    jobObj.isSaved = false;
    jobObj.applicationStatus = null;

    if (currentUserId) {
      const application = await Application.findOne({
        jobId: job._id,
        applicantId: currentUserId,
      });
      if (application) {
        jobObj.hasApplied = true;
        jobObj.applicationStatus = application.status;
      }

      const saved = await SavedJob.findOne({
        jobId: job._id,
        userId: currentUserId,
      });
      if (saved) {
        jobObj.isSaved = true;
      }
    }

    // Also get total applicants count for this job
    const applicantCount = await Application.countDocuments({ jobId: job._id });
    jobObj.applicantCount = applicantCount;

    res.status(200).json({
      success: true,
      job: jobObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      companyId,
      companyName,
      companyLogo,
      description,
      responsibilities,
      requirements,
      skills,
      location,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      workMode,
      benefits,
      deadline,
    } = req.body;

    // Fetch recruiter's company profile to default company info if missing
    const recruiterProfile = await RecruiterProfile.findOne({
      userId: req.user._id,
    });

    let finalCompanyId = companyId || recruiterProfile?.companyId || null;
    let finalCompanyName = companyName || recruiterProfile?.companyName || `${req.user.name}'s Company`;
    let finalCompanyLogo = companyLogo || recruiterProfile?.companyLogo || '';

    // If companyId is known, resolve verified company name & logo
    if (finalCompanyId && mongoose.Types.ObjectId.isValid(finalCompanyId)) {
      const matchedComp = await Company.findById(finalCompanyId);
      if (matchedComp) {
        finalCompanyName = matchedComp.name;
        finalCompanyLogo = matchedComp.logo || finalCompanyLogo;
      }
    } else if (!finalCompanyId && finalCompanyName) {
      // Look up company by name if companyId wasn't passed directly
      const matchedComp = await Company.findOne({ name: finalCompanyName.trim() });
      if (matchedComp) {
        finalCompanyId = matchedComp._id;
        finalCompanyLogo = matchedComp.logo || finalCompanyLogo;
      }
    }

    const parseList = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) return input;
      return input
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    };

    const parseSkills = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) return input;
      return input
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    };

    const job = await Job.create({
      recruiterId: req.user._id,
      companyId: finalCompanyId,
      companyName: finalCompanyName,
      companyLogo: finalCompanyLogo,
      title,
      description,
      responsibilities: parseList(responsibilities),
      requirements: parseList(requirements),
      skills: parseSkills(skills),
      location,
      jobType: jobType || 'Full Time',
      experienceLevel: experienceLevel || 'Mid Level',
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      workMode: workMode || 'Hybrid',
      benefits: parseList(benefits),
      deadline: deadline ? new Date(deadline) : undefined,
      status: 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter who created it or Admin)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check authorization
    if (
      req.user.role !== 'Admin' &&
      job.recruiterId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    const {
      title,
      companyId,
      companyName,
      companyLogo,
      description,
      responsibilities,
      requirements,
      skills,
      location,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      workMode,
      benefits,
      deadline,
      status,
    } = req.body;

    const parseList = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) return input;
      return input
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    };

    const parseSkills = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) return input;
      return input
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    };

    if (companyId !== undefined) {
      job.companyId = companyId || null;
      if (companyId && mongoose.Types.ObjectId.isValid(companyId)) {
        const comp = await Company.findById(companyId);
        if (comp) {
          job.companyName = comp.name;
          if (comp.logo) job.companyLogo = comp.logo;
        }
      }
    }
    if (title) job.title = title;
    if (companyName && !companyId) job.companyName = companyName;
    if (companyLogo !== undefined) job.companyLogo = companyLogo;
    if (description) job.description = description;
    if (responsibilities !== undefined) job.responsibilities = parseList(responsibilities);
    if (requirements !== undefined) job.requirements = parseList(requirements);
    if (skills !== undefined) job.skills = parseSkills(skills);
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (experienceLevel) job.experienceLevel = experienceLevel;
    if (salaryMin !== undefined) job.salaryMin = Number(salaryMin);
    if (salaryMax !== undefined) job.salaryMax = Number(salaryMax);
    if (workMode) job.workMode = workMode;
    if (benefits !== undefined) job.benefits = parseList(benefits);
    if (deadline !== undefined) job.deadline = deadline ? new Date(deadline) : null;
    if (status) job.status = status;

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter who created it or Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (
      req.user.role !== 'Admin' &&
      job.recruiterId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    // Cascade delete applications and saved jobs
    await Application.deleteMany({ jobId: job._id });
    await SavedJob.deleteMany({ jobId: job._id });
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job and related applications deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's own posted jobs with applicant counts
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter)
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({
      createdAt: -1,
    });

    // Attach applicant counts to each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({
          jobId: job._id,
        });
        const jobObj = job.toObject();
        jobObj.applicantCount = applicantCount;
        return jobObj;
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      jobs: jobsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle job active/closed status
// @route   PUT /api/jobs/:id/toggle-status
// @access  Private (Recruiter / Admin)
const toggleJobStatus = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (
      req.user.role !== 'Admin' &&
      job.recruiterId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change status of this job',
      });
    }

    job.status = job.status === 'Active' ? 'Closed' : 'Active';
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job is now ${job.status}`,
      status: job.status,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top hiring companies with open jobs count
// @route   GET /api/jobs/companies/popular
// @access  Public
const getTopCompanies = async (req, res, next) => {
  try {
    const companies = await Job.aggregate([
      { $match: { status: 'Active' } },
      {
        $group: {
          _id: '$companyName',
          openJobsCount: { $sum: 1 },
          companyLogo: { $first: '$companyLogo' },
          location: { $first: '$location' },
        },
      },
      { $sort: { openJobsCount: -1 } },
      { $limit: 12 },
    ]);

    // Augment with recruiter profile data if available
    const enriched = await Promise.all(
      companies.map(async (comp) => {
        const profile = await RecruiterProfile.findOne({
          companyName: comp._id,
        });
        return {
          name: comp._id,
          openJobsCount: comp.openJobsCount,
          companyLogo: (profile && profile.companyLogo) || comp.companyLogo,
          location: (profile && profile.location) || comp.location,
          industry: (profile && profile.industry) || 'Technology',
          website: profile ? profile.website : '',
          description: profile ? profile.companyDescription : '',
          companySize: profile ? profile.companySize : '51-200',
        };
      })
    );

    res.status(200).json({
      success: true,
      companies: enriched,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  toggleJobStatus,
  getTopCompanies,
};
