const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    industry: {
      type: String,
      default: 'IT & Software',
      trim: true,
    },
    category: {
      type: String,
      enum: ['Indian Company', 'MNC / Global Company'],
      default: 'Indian Company',
      required: true,
    },
    headquarters: {
      type: String,
      default: '',
      trim: true,
    },
    indiaLocations: {
      type: [String],
      default: [],
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    companySize: {
      type: String,
      default: '10,000+',
    },
    foundedYear: {
      type: Number,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes
companySchema.index({ name: 'text', description: 'text', industry: 'text', headquarters: 'text' });
companySchema.index({ category: 1, industry: 1 });

module.exports = mongoose.model('Company', companySchema);
