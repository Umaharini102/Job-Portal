const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Report = require('../models/Report');
const Company = require('../models/Company');
const RecruiterProfile = require('../models/RecruiterProfile');
const JobSeekerProfile = require('../models/JobSeekerProfile');

// @desc    Get comprehensive admin dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSeekers = await User.countDocuments({ role: 'Job Seeker' });
    const totalRecruiters = await User.countDocuments({ role: 'Recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Active' });
    const closedJobs = await Job.countDocuments({ status: 'Closed' });
    const totalApplications = await Application.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });

    // Company metrics
    const totalCompanies = await Company.countDocuments();
    const indianCompanies = await Company.countDocuments({ category: 'Indian Company' });
    const mncCompanies = await Company.countDocuments({ category: 'MNC / Global Company' });
    const distinctActiveCompanies = await Job.distinct('companyName', { status: 'Active' });
    const companiesWithActiveJobs = distinctActiveCompanies.length;

    // Applications by status breakdown for charts
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Jobs by jobType breakdown
    const jobsByType = await Job.aggregate([
      {
        $group: {
          _id: '$jobType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Jobs by workMode breakdown
    const jobsByWorkMode = await Job.aggregate([
      {
        $group: {
          _id: '$workMode',
          count: { $sum: 1 },
        },
      },
    ]);

    // Monthly activity estimation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const mIdx = (currentMonth - i + 12) % 12;
      monthlyData.push({
        month: months[mIdx],
        users: Math.floor(totalUsers * (0.4 + (5 - i) * 0.12)),
        jobs: Math.floor(totalJobs * (0.35 + (5 - i) * 0.13)),
        applications: Math.floor(totalApplications * (0.3 + (5 - i) * 0.14)),
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSeekers,
        totalRecruiters,
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
        pendingReports,
        totalCompanies,
        indianCompanies,
        mncCompanies,
        companiesWithActiveJobs,
      },
      charts: {
        applicationsByStatus,
        jobsByType,
        jobsByWorkMode,
        monthlyData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for Admin management
// @route   GET /api/admin/jobs
// @access  Private/Admin
const getAllJobsAdmin = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 15 } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiterId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all recruiters for Admin
// @route   GET /api/admin/recruiters
// @access  Private/Admin
const getAllRecruitersAdmin = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 15 } = req.query;

    const query = { role: 'Recruiter' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const recruiters = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const enriched = await Promise.all(
      recruiters.map(async (rec) => {
        const profile = await RecruiterProfile.findOne({ userId: rec._id });
        const jobsCount = await Job.countDocuments({ recruiterId: rec._id });
        const activeJobsCount = await Job.countDocuments({ recruiterId: rec._id, status: 'Active' });
        return {
          _id: rec._id,
          name: rec.name,
          email: rec.email,
          phone: rec.phone,
          location: rec.location,
          isActive: rec.isActive,
          createdAt: rec.createdAt,
          companyName: profile?.companyName || 'Not Set',
          companyEmail: profile?.companyEmail || '',
          companyLogo: profile?.companyLogo || '',
          industry: profile?.industry || 'Technology',
          website: profile?.website || profile?.companyWebsite || '',
          companySize: profile?.companySize || '51-200',
          jobsCount,
          activeJobsCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      recruiters: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all platform applications for Admin
// @route   GET /api/admin/applications
// @access  Private/Admin
const getAllApplicationsAdmin = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 15 } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('jobId', 'title companyName location')
      .populate('applicantId', 'name email phone')
      .populate('recruiterId', 'name email')
      .sort({ appliedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies for Admin with filtering and live job metrics
// @route   GET /api/admin/companies
// @access  Private/Admin
const getAllCompaniesAdmin = async (req, res, next) => {
  try {
    const { search, category, industry, isVerified } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (industry && industry !== 'All') {
      query.industry = industry;
    }

    if (isVerified !== undefined && isVerified !== '' && isVerified !== 'All') {
      query.isVerified = isVerified === 'true' || isVerified === true;
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { industry: regex },
        { headquarters: regex },
      ];
    }

    const companies = await Company.find(query).sort({ name: 1 });

    const enriched = await Promise.all(
      companies.map(async (comp) => {
        const jobsCount = await Job.countDocuments({
          $or: [{ companyId: comp._id }, { companyName: comp.name }],
        });
        const activeJobsCount = await Job.countDocuments({
          $or: [{ companyId: comp._id }, { companyName: comp.name }],
          status: 'Active',
        });
        const recruiterProfile = await RecruiterProfile.findOne({
          $or: [{ companyId: comp._id }, { companyName: comp.name }],
        }).populate('userId', 'name email');

        return {
          _id: comp._id,
          name: comp.name,
          companyName: comp.name,
          logo: comp.logo,
          companyLogo: comp.logo,
          category: comp.category,
          industry: comp.industry,
          headquarters: comp.headquarters,
          location: comp.headquarters,
          indiaLocations: comp.indiaLocations || [],
          website: comp.website,
          companySize: comp.companySize,
          foundedYear: comp.foundedYear,
          isVerified: comp.isVerified,
          description: comp.description,
          recruiterName: recruiterProfile?.userId?.name || null,
          recruiterEmail: recruiterProfile?.userId?.email || null,
          jobsCount,
          activeJobsCount,
          createdAt: comp.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enriched.length,
      companies: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a report against a job
// @route   POST /api/admin/reports
// @access  Private
const createReport = async (req, res, next) => {
  try {
    const { jobId, reason, description } = req.body;

    if (!jobId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Job ID and reason are required',
      });
    }

    const report = await Report.create({
      reportedBy: req.user._id,
      jobId,
      reason,
      description: description || '',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Job reported successfully. Our team will review it.',
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('reportedBy', 'name email')
      .populate('jobId', 'title companyName status recruiterId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
const updateReportStatus = async (req, res, next) => {
  try {
    const { status, deleteJob } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    if (status) report.status = status;
    await report.save();

    if (deleteJob && report.jobId) {
      await Job.findByIdAndDelete(report.jobId);
      await Application.deleteMany({ jobId: report.jobId });
    }

    res.status(200).json({
      success: true,
      message: `Report marked as ${status}${deleteJob ? ' and offending job removed' : ''}`,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter analytics
// @route   GET /api/admin/recruiter-analytics
// @access  Private (Recruiter)
const getRecruiterStats = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    const totalJobs = await Job.countDocuments({ recruiterId });
    const activeJobs = await Job.countDocuments({ recruiterId, status: 'Active' });
    const closedJobs = await Job.countDocuments({ recruiterId, status: 'Closed' });
    const totalApplicants = await Application.countDocuments({ recruiterId });
    const shortlistedCount = await Application.countDocuments({
      recruiterId,
      status: 'Shortlisted',
    });
    const interviewCount = await Application.countDocuments({
      recruiterId,
      status: 'Interview',
    });
    const selectedCount = await Application.countDocuments({
      recruiterId,
      status: 'Selected',
    });

    const statusDistribution = await Application.aggregate([
      { $match: { recruiterId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const applicationsByJob = await Application.aggregate([
      { $match: { recruiterId } },
      {
        $group: {
          _id: '$jobId',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'jobDetails',
        },
      },
      { $unwind: '$jobDetails' },
      {
        $project: {
          jobTitle: '$jobDetails.title',
          count: 1,
        },
      },
      { $limit: 6 },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const monthlyTrends = [];

    for (let i = 4; i >= 0; i--) {
      const mIdx = (currentMonth - i + 12) % 12;
      monthlyTrends.push({
        month: months[mIdx],
        applications: Math.max(1, Math.floor(totalApplicants * (0.2 + (4 - i) * 0.2))),
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplicants,
        shortlistedCount,
        interviewCount,
        selectedCount,
      },
      charts: {
        statusDistribution,
        applicationsByJob,
        monthlyTrends,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllJobsAdmin,
  getAllRecruitersAdmin,
  getAllApplicationsAdmin,
  getAllCompaniesAdmin,
  createReport,
  getReports,
  updateReportStatus,
  getRecruiterStats,
};
