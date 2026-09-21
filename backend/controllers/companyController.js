const mongoose = require('mongoose');
const Company = require('../models/Company');
const Job = require('../models/Job');

// Helper to normalize category param
const normalizeCategory = (cat) => {
  if (!cat || cat === 'All') return null;
  const lower = cat.toLowerCase();
  if (lower.includes('indian')) return 'Indian Company';
  if (lower.includes('mnc') || lower.includes('global')) return 'MNC / Global Company';
  return cat;
};

// @desc    Get all companies with search, multi-faceted filtering, pagination, and live job counts
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res, next) => {
  try {
    const {
      search,
      category,
      industry,
      location,
      companySize,
      isVerified,
      page = 1,
      limit = 12,
      sort = 'name',
    } = req.query;

    const query = {};

    // Category filter
    const normCategory = normalizeCategory(category);
    if (normCategory) {
      query.category = normCategory;
    }

    // Industry filter
    if (industry && industry !== 'All') {
      query.industry = industry;
    }

    // Keyword search (Company name, industry, headquarters, description)
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { industry: regex },
        { headquarters: regex },
        { description: regex },
      ];
    }

    // Location search (matches within indiaLocations array or headquarters)
    if (location && location !== 'All') {
      const locRegex = new RegExp(location.trim(), 'i');
      query.$or = [
        { indiaLocations: { $elemMatch: { $regex: locRegex } } },
        { headquarters: locRegex },
      ];
    }

    // Company Size filter
    if (companySize && companySize !== 'All') {
      query.companySize = companySize;
    }

    // Verification status
    if (isVerified !== undefined && isVerified !== '') {
      query.isVerified = isVerified === 'true' || isVerified === true;
    }

    // Sort order
    let sortOptions = { name: 1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'founded_oldest') sortOptions = { foundedYear: 1 };
    if (sort === 'founded_newest') sortOptions = { foundedYear: -1 };

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Augment each company dynamically with live active jobs count
    const enrichedCompanies = await Promise.all(
      companies.map(async (comp) => {
        const compObj = comp.toObject();
        const openJobsCount = await Job.countDocuments({
          $or: [{ companyId: comp._id }, { companyName: comp.name }],
          status: 'Active',
        });
        compObj.openJobsCount = openJobsCount;
        return compObj;
      })
    );

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      companies: enrichedCompanies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top/popular companies for Home page
// @route   GET /api/companies/popular
// @access  Public
const getPopularCompanies = async (req, res, next) => {
  try {
    const popularNames = [
      'Tata Consultancy Services (TCS)',
      'Infosys',
      'Wipro',
      'HCLTech',
      'Accenture',
      'Cognizant',
      'Microsoft',
      'Amazon',
      'Google',
      'IBM',
      'Zoho',
      'NVIDIA',
    ];

    const companies = await Company.find({
      name: { $in: popularNames },
    });

    const enriched = await Promise.all(
      companies.map(async (comp) => {
        const compObj = comp.toObject();
        const openJobsCount = await Job.countDocuments({
          $or: [{ companyId: comp._id }, { companyName: comp.name }],
          status: 'Active',
        });
        compObj.openJobsCount = openJobsCount;
        return compObj;
      })
    );

    // Sort according to popular list order
    enriched.sort((a, b) => {
      const idxA = popularNames.indexOf(a.name);
      const idxB = popularNames.indexOf(b.name);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });

    res.status(200).json({
      success: true,
      companies: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company by ID
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid company ID format',
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    const openJobsCount = await Job.countDocuments({
      $or: [{ companyId: company._id }, { companyName: company.name }],
      status: 'Active',
    });

    const companyObj = company.toObject();
    companyObj.openJobsCount = openJobsCount;

    res.status(200).json({
      success: true,
      company: companyObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active jobs associated with a company
// @route   GET /api/companies/:id/jobs
// @access  Public
const getCompanyJobs = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid company ID',
      });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    const jobs = await Job.find({
      $or: [{ companyId: company._id }, { companyName: company.name }],
      status: 'Active',
    })
      .populate('recruiterId', 'name email profileImage')
      .populate('companyId', 'name logo category isVerified industry')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private (Recruiter / Admin)
const createCompany = async (req, res, next) => {
  try {
    const {
      name,
      logo,
      description,
      industry,
      category,
      headquarters,
      indiaLocations,
      website,
      companySize,
      foundedYear,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required',
      });
    }

    const existing = await Company.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A company with this name already exists',
        company: existing,
      });
    }

    const parsedLocations = Array.isArray(indiaLocations)
      ? indiaLocations
      : indiaLocations
      ? indiaLocations.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const normCategory = normalizeCategory(category) || 'Indian Company';

    const company = await Company.create({
      name: name.trim(),
      logo: logo || '',
      description: description || '',
      industry: industry || 'IT & Software',
      category: normCategory,
      headquarters: headquarters || '',
      indiaLocations: parsedLocations,
      website: website || '',
      companySize: companySize || '51-200',
      foundedYear: foundedYear ? Number(foundedYear) : null,
      isVerified: false, // Per specification: default false
    });

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company details
// @route   PUT /api/companies/:id
// @access  Private (Admin)
const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    let company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    const {
      name,
      logo,
      description,
      industry,
      category,
      headquarters,
      indiaLocations,
      website,
      companySize,
      foundedYear,
      isVerified,
    } = req.body;

    if (name && name.trim() !== company.name) {
      const duplicate = await Company.findOne({ name: name.trim(), _id: { $ne: id } });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Another company already uses this name',
        });
      }
      company.name = name.trim();
    }

    if (logo !== undefined) company.logo = logo;
    if (description !== undefined) company.description = description;
    if (industry) company.industry = industry;
    if (category) {
      const normCat = normalizeCategory(category);
      if (normCat) company.category = normCat;
    }
    if (headquarters !== undefined) company.headquarters = headquarters;
    if (indiaLocations !== undefined) {
      company.indiaLocations = Array.isArray(indiaLocations)
        ? indiaLocations
        : indiaLocations.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (website !== undefined) company.website = website;
    if (companySize) company.companySize = companySize;
    if (foundedYear !== undefined) company.foundedYear = foundedYear ? Number(foundedYear) : null;
    if (isVerified !== undefined) company.isVerified = Boolean(isVerified);

    await company.save();

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle company verification status (✓ Verified Company)
// @route   PUT /api/companies/:id/verify
// @access  Private (Admin)
const toggleVerifyCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    company.isVerified = !company.isVerified;
    await company.save();

    res.status(200).json({
      success: true,
      message: `Company marked as ${company.isVerified ? 'Verified' : 'Unverified'}`,
      isVerified: company.isVerified,
      company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private (Admin)
const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    // Unlink companyId from jobs rather than breaking them
    await Job.updateMany({ companyId: company._id }, { $unset: { companyId: 1 } });
    await Company.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  getPopularCompanies,
  getCompanyById,
  getCompanyJobs,
  createCompany,
  updateCompany,
  toggleVerifyCompany,
  deleteCompany,
};
