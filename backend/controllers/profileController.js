const User = require('../models/User');
const Company = require('../models/Company');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const RecruiterProfile = require('../models/RecruiterProfile');

// @desc    Get profile by user ID
// @route   GET /api/profiles/:id
// @access  Public
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let profile = null;
    if (user.role === 'Job Seeker') {
      profile = await JobSeekerProfile.findOne({ userId: user._id });
    } else if (user.role === 'Recruiter') {
      profile = await RecruiterProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        phone: user.phone,
        location: user.location,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Job Seeker profile
// @route   PUT /api/profiles/seeker
// @access  Private (Job Seeker)
const updateJobSeekerProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      name,
      phone,
      location,
      headline,
      about,
      skills,
      education,
      experience,
      projects,
      certifications,
      careerGoals,
    } = req.body;

    // Update User model fields if provided
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (phone !== undefined) userUpdates.phone = phone;
    if (location !== undefined) userUpdates.location = location;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(userId, userUpdates);
    }

    // Update or create JobSeekerProfile
    let profile = await JobSeekerProfile.findOne({ userId });

    if (!profile) {
      profile = new JobSeekerProfile({ userId });
    }

    if (headline !== undefined) profile.headline = headline;
    if (about !== undefined) profile.about = about;
    if (skills !== undefined) profile.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim()).filter(Boolean);
    if (education !== undefined) profile.education = education;
    if (experience !== undefined) profile.experience = experience;
    if (projects !== undefined) profile.projects = projects;
    if (certifications !== undefined) profile.certifications = certifications;
    if (careerGoals !== undefined) profile.careerGoals = careerGoals;

    await profile.save();

    const updatedUser = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Recruiter profile
// @route   PUT /api/profiles/recruiter
// @access  Private (Recruiter)
const updateRecruiterProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      name,
      phone,
      companyId,
      companyName,
      companyDescription,
      companyWebsite,
      website,
      industry,
      companyLocation,
      location,
      companySize,
      companyEmail,
    } = req.body;

    // Update User model fields
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (phone !== undefined) userUpdates.phone = phone;
    if (location !== undefined) userUpdates.location = location;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(userId, userUpdates);
    }

    // Update or create RecruiterProfile
    let profile = await RecruiterProfile.findOne({ userId });

    if (!profile) {
      profile = new RecruiterProfile({
        userId,
        companyName: companyName || `${req.user.name}'s Company`,
      });
    }

    if (companyId) {
      profile.companyId = companyId;
      const comp = await Company.findById(companyId);
      if (comp) {
        profile.companyName = comp.name;
        if (comp.logo) profile.companyLogo = comp.logo;
        if (comp.industry) profile.industry = comp.industry;
        if (comp.headquarters) {
          profile.location = comp.headquarters;
          profile.companyLocation = comp.headquarters;
        }
        if (comp.website) {
          profile.website = comp.website;
          profile.companyWebsite = comp.website;
        }
        if (comp.companySize) profile.companySize = comp.companySize;
        if (comp.description) profile.companyDescription = comp.description;
      }
    } else {
      if (companyName) profile.companyName = companyName;
      if (companyDescription !== undefined) profile.companyDescription = companyDescription;
      if (website !== undefined) {
        profile.website = website;
        profile.companyWebsite = website;
      }
      if (companyWebsite !== undefined) {
        profile.companyWebsite = companyWebsite;
        profile.website = companyWebsite;
      }
      if (industry !== undefined) profile.industry = industry;
      if (location !== undefined) {
        profile.location = location;
        profile.companyLocation = location;
      }
      if (companyLocation !== undefined) {
        profile.companyLocation = companyLocation;
        profile.location = companyLocation;
      }
      if (companySize !== undefined) profile.companySize = companySize;
    }

    if (companyEmail !== undefined) profile.companyEmail = companyEmail;

    await profile.save();

    const updatedUser = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully',
      user: updatedUser,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   POST /api/profiles/upload/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    // Path relative to backend root
    const filePath = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: filePath },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      profileImage: filePath,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/profiles/upload/resume
// @access  Private (Job Seeker)
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file (.pdf, .doc, .docx)',
      });
    }

    const filePath = `/uploads/resumes/${req.file.filename}`;

    let profile = await JobSeekerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new JobSeekerProfile({ userId: req.user._id });
    }

    profile.resume = filePath;
    profile.resumeOriginalName = req.file.originalname;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: filePath,
      resumeOriginalName: req.file.originalname,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload company logo
// @route   POST /api/profiles/upload/logo
// @access  Private (Recruiter)
const uploadCompanyLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a company logo image',
      });
    }

    const filePath = `/uploads/logos/${req.file.filename}`;

    let profile = await RecruiterProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new RecruiterProfile({
        userId: req.user._id,
        companyName: `${req.user.name}'s Company`,
      });
    }

    profile.companyLogo = filePath;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Company logo uploaded successfully',
      companyLogo: filePath,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateJobSeekerProfile,
  updateRecruiterProfile,
  uploadAvatar,
  uploadResume,
  uploadCompanyLogo,
};
