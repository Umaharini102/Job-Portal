const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    companyDescription: {
      type: String,
      default: '',
    },
    companyWebsite: {
      type: String,
      default: '',
      trim: true,
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    industry: {
      type: String,
      default: 'Technology',
    },
    companyLocation: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    companySize: {
      type: String,
      default: '51-200',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
