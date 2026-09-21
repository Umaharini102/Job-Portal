const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const JobSeekerProfile = require('../models/JobSeekerProfile');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Job Seeker)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter, resume: providedResume, resumeOriginalName } = req.body;

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

    if (job.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is closed and no longer accepting applications',
      });
    }

    // Check if user has already applied
    const existingApp = await Application.findOne({
      jobId,
      applicantId: req.user._id,
    });

    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position',
      });
    }

    // Determine resume to use: provided in body, or fallback to profile resume
    let finalResume = providedResume;
    let finalResumeName = resumeOriginalName || '';

    if (!finalResume) {
      const seekerProfile = await JobSeekerProfile.findOne({
        userId: req.user._id,
      });
      if (seekerProfile && seekerProfile.resume) {
        finalResume = seekerProfile.resume;
        finalResumeName = seekerProfile.resumeOriginalName || 'Resume.pdf';
      }
    }

    if (!finalResume) {
      return res.status(400).json({
        success: false,
        message: 'Please provide or upload a resume to complete your application',
      });
    }

    const application = await Application.create({
      jobId,
      applicantId: req.user._id,
      recruiterId: job.recruiterId,
      resume: finalResume,
      resumeOriginalName: finalResumeName,
      coverLetter: coverLetter || '',
      status: 'Applied',
    });

    // Notify the applicant
    await Notification.create({
      userId: req.user._id,
      title: 'Application Submitted',
      message: `You successfully applied for "${job.title}" at ${job.companyName}.`,
      type: 'application_submitted',
      link: '/applications',
    });

    // Notify the recruiter
    await Notification.create({
      userId: job.recruiterId,
      title: 'New Candidate Application',
      message: `${req.user.name} applied for "${job.title}"`,
      type: 'application_received',
      link: `/recruiter/applicants?jobId=${job._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's job applications
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker)
const getMyApplications = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = { applicantId: req.user._id };
    if (status && status !== 'All') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate({
        path: 'jobId',
        select: 'title companyName companyLogo location jobType workMode salaryMin salaryMax status',
      })
      .populate('recruiterId', 'name email')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for recruiter's jobs
// @route   GET /api/applications/recruiter
// @access  Private (Recruiter)
const getRecruiterApplications = async (req, res, next) => {
  try {
    const { jobId, status, search } = req.query;

    const query = { recruiterId: req.user._id };

    if (jobId) {
      query.jobId = jobId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    let applications = await Application.find(query)
      .populate('jobId', 'title companyName location jobType status')
      .populate('applicantId', 'name email profileImage phone location')
      .sort({ appliedAt: -1 });

    // Augment with applicant's seeker profile
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const appObj = app.toObject();
        if (app.applicantId) {
          const seekerProfile = await JobSeekerProfile.findOne({
            userId: app.applicantId._id,
          });
          appObj.seekerProfile = seekerProfile;
        }
        return appObj;
      })
    );

    // If search keyword provided, filter applicant name or skills
    let filtered = enriched;
    if (search) {
      const s = search.toLowerCase();
      filtered = enriched.filter((item) => {
        const nameMatch = item.applicantId?.name?.toLowerCase().includes(s);
        const jobMatch = item.jobId?.title?.toLowerCase().includes(s);
        const skillMatch = item.seekerProfile?.skills?.some((sk) =>
          sk.toLowerCase().includes(s)
        );
        return nameMatch || jobMatch || skillMatch;
      });
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      applications: filtered,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('applicantId', 'name email profileImage phone location')
      .populate('recruiterId', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const isOwner =
      application.applicantId &&
      application.applicantId._id.toString() === req.user._id.toString();
    const isRecruiter =
      application.recruiterId &&
      application.recruiterId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isOwner && !isRecruiter && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application',
      });
    }

    const appObj = application.toObject();
    if (application.applicantId) {
      appObj.seekerProfile = await JobSeekerProfile.findOne({
        userId: application.applicantId._id,
      });
    }

    res.status(200).json({
      success: true,
      application: appObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter / Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const validStatuses = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview',
      'Selected',
      'Rejected',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (
      req.user.role !== 'Admin' &&
      application.recruiterId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    application.status = status;
    if (notes !== undefined) application.notes = notes;
    await application.save();

    // Create notification for the applicant
    const jobTitle = application.jobId ? application.jobId.title : 'the position';
    const company = application.jobId ? application.jobId.companyName : 'the company';

    await Notification.create({
      userId: application.applicantId,
      title: `Application Status: ${status}`,
      message: `Your application for "${jobTitle}" at ${company} has been updated to "${status}".`,
      type: 'application_status',
      link: '/applications',
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Job Seeker)
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.applicantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application',
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
};
