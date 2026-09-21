const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const RecruiterProfile = require('../models/RecruiterProfile');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jobconnect_super_secret_jwt_key_2025_secure_xyz987', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// @desc    Register a new user (Job Seeker or Recruiter)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      phone,
      location,
      companyId,
      companyName,
      companyCategory,
      companyEmail,
      companyLocation,
      companyWebsite,
      companyDescription,
      companySize,
      industry,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const userRole = role === 'Recruiter' ? 'Recruiter' : 'Job Seeker';

    if (userRole === 'Recruiter' && !companyId && !companyName) {
      return res.status(400).json({
        success: false,
        message: 'Please select an existing company or provide a company name',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      phone: phone || '',
      location: location || companyLocation || '',
    });

    // Create fresh empty profile
    if (userRole === 'Job Seeker') {
      await JobSeekerProfile.create({
        userId: user._id,
        headline: '',
        about: '',
        skills: [],
        education: [],
        experience: [],
        projects: [],
        certifications: [],
        careerGoals: '',
        resume: '',
      });
    } else if (userRole === 'Recruiter') {
      let finalCompanyId = null;
      let finalCompanyName = companyName ? companyName.trim() : '';
      let finalCompanyLogo = '';
      let finalIndustry = industry || 'IT & Software';
      let finalWebsite = companyWebsite || '';
      let finalLocation = companyLocation || location || '';
      let finalDescription = companyDescription || '';
      let finalSize = companySize || '51-200';

      if (companyId) {
        const existingCompany = await Company.findById(companyId);
        if (existingCompany) {
          finalCompanyId = existingCompany._id;
          finalCompanyName = existingCompany.name;
          finalCompanyLogo = existingCompany.logo || '';
          finalIndustry = existingCompany.industry || finalIndustry;
          finalWebsite = existingCompany.website || finalWebsite;
          finalLocation = existingCompany.headquarters || finalLocation;
          finalDescription = existingCompany.description || finalDescription;
          finalSize = existingCompany.companySize || finalSize;
        }
      } else if (finalCompanyName) {
        // Check if company exists by name
        let matched = await Company.findOne({ name: finalCompanyName });
        if (!matched) {
          // Create new company in MongoDB
          matched = await Company.create({
            name: finalCompanyName,
            category: companyCategory || 'Indian Company',
            industry: finalIndustry,
            headquarters: finalLocation,
            indiaLocations: finalLocation ? [finalLocation] : [],
            website: finalWebsite,
            description: finalDescription,
            companySize: finalSize,
            isVerified: false,
          });
        }
        finalCompanyId = matched._id;
        finalCompanyName = matched.name;
        finalCompanyLogo = matched.logo || '';
      }

      await RecruiterProfile.create({
        userId: user._id,
        companyId: finalCompanyId,
        companyName: finalCompanyName,
        companyEmail: (companyEmail || email).trim(),
        companyLocation: finalLocation,
        location: finalLocation,
        companyDescription: finalDescription,
        companyWebsite: finalWebsite,
        website: finalWebsite,
        companyLogo: finalCompanyLogo,
        industry: finalIndustry,
        companySize: finalSize,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
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
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user with password selected
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
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
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user & populated profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

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

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  updatePassword,
};
