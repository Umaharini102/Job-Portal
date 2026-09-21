const path = require('path');
const fs = require('fs');
const Company = require('../models/Company');
const User = require('../models/User');
const RecruiterProfile = require('../models/RecruiterProfile');
const Job = require('../models/Job');
const { allCompanies } = require('./companySeedData');

/**
 * Ensure upload directories exist so file uploads do not fail in production.
 */
const ensureUploadsDirs = () => {
  try {
    const dirs = [
      path.join(__dirname, '..', 'uploads'),
      path.join(__dirname, '..', 'uploads', 'avatars'),
      path.join(__dirname, '..', 'uploads', 'logos'),
      path.join(__dirname, '..', 'uploads', 'resumes'),
    ];
    dirs.forEach((d) => {
      if (!fs.existsSync(d)) {
        fs.mkdirSync(d, { recursive: true });
      }
    });
  } catch (err) {
    console.warn('[Storage] Notice creating uploads directories:', err.message);
  }
};

/**
 * Automatically initialize default company catalog and core accounts if database is empty.
 * This is non-destructive and only executes when collections are completely empty.
 */
const initDatabase = async () => {
  try {
    ensureUploadsDirs();

    // 1. Check if Company collection has records
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      console.log(`[Auto-Init] No companies found in database. Seeding ${allCompanies.length} Indian & MNC companies...`);
      const insertedCompanies = await Company.insertMany(allCompanies);
      console.log(`[Auto-Init] Successfully seeded ${insertedCompanies.length} companies into database.`);
    } else {
      console.log(`[Database] Company directory verified (${companyCount} companies present).`);
    }

    // 2. Check if User collection is empty (fresh cloud database initialization)
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Auto-Init] No users found in database. Initializing default admin & recruiter accounts...');

      // Admin Account
      const admin = await User.create({
        name: 'Platform Administrator',
        email: 'admin@jobconnect.com',
        password: 'Admin@123',
        role: 'Admin',
        phone: '+91 98765 43210',
        location: 'Bengaluru, India',
      });

      // Recruiter Account associated with an Indian enterprise
      const infosysComp = await Company.findOne({ name: 'Infosys' });
      const recruiter = await User.create({
        name: 'Tech Talent Acquisition Lead',
        email: 'recruiter@jobconnect.com',
        password: 'Recruiter@123',
        role: 'Recruiter',
        phone: '+91 98123 45678',
        location: 'Bengaluru, India',
      });

      await RecruiterProfile.create({
        userId: recruiter._id,
        companyId: infosysComp ? infosysComp._id : null,
        companyName: infosysComp ? infosysComp.name : 'Infosys',
        companyEmail: 'careers@talentpartners.example.com',
        companyDescription: infosysComp ? infosysComp.description : 'Global leader in next-generation digital services and consulting.',
        website: infosysComp ? infosysComp.website : 'https://www.infosys.com',
        companyWebsite: infosysComp ? infosysComp.website : 'https://www.infosys.com',
        industry: 'IT & Software',
        location: 'Bengaluru, Karnataka, India',
        companyLocation: 'Bengaluru, Karnataka, India',
        companySize: '10,000+',
      });

      // Starter job postings so the job portal has immediate opportunities
      const tcsComp = await Company.findOne({ name: 'Tata Consultancy Services (TCS)' });
      const msftComp = await Company.findOne({ name: 'Microsoft' });

      await Job.create([
        {
          recruiterId: recruiter._id,
          companyId: infosysComp ? infosysComp._id : null,
          companyName: 'Infosys',
          companyLogo: '',
          title: 'Senior Frontend Engineer (React)',
          category: 'Software Development',
          industry: 'IT & Software',
          location: 'Bengaluru, India',
          jobType: 'Full Time',
          workMode: 'Hybrid',
          experienceLevel: 'Mid Level',
          salaryMin: 900000,
          salaryMax: 1500000,
          salaryCurrency: 'INR',
          salaryPeriod: 'Per Year',
          description: 'Design and develop cutting-edge web applications using React, TypeScript, and modern state architecture.',
          responsibilities: [
            'Develop responsive, high-performance web components',
            'Collaborate with UX designers and backend engineers',
            'Participate in code reviews and architectural planning',
          ],
          requirements: [
            '3+ years of professional React and JavaScript experience',
            'Experience with REST APIs and state management',
            'Strong knowledge of modern CSS and responsive layouts',
          ],
          skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'REST API'],
          status: 'Active',
        },
        {
          recruiterId: recruiter._id,
          companyId: tcsComp ? tcsComp._id : null,
          companyName: 'Tata Consultancy Services (TCS)',
          companyLogo: '',
          title: 'Cloud Solutions Architect',
          category: 'Cloud & DevOps',
          industry: 'IT & Software',
          location: 'Pune, India',
          jobType: 'Full Time',
          workMode: 'Hybrid',
          experienceLevel: 'Senior Level',
          salaryMin: 1400000,
          salaryMax: 2200000,
          salaryCurrency: 'INR',
          salaryPeriod: 'Per Year',
          description: 'Lead enterprise cloud architecture and migration pipelines on AWS and Azure cloud platforms.',
          responsibilities: [
            'Architect scalable, highly available microservices infrastructure',
            'Implement CI/CD deployment pipelines with Docker and Kubernetes',
            'Optimize cloud resource allocation and security controls',
          ],
          requirements: [
            '5+ years cloud architecture experience',
            'AWS or Azure certified solutions architect',
            'Proficiency in Docker, Kubernetes, and Terraform',
          ],
          skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Microservices'],
          status: 'Active',
        },
        {
          recruiterId: recruiter._id,
          companyId: msftComp ? msftComp._id : null,
          companyName: 'Microsoft',
          companyLogo: '',
          title: 'Software Development Engineer - Cloud & AI',
          category: 'Software Development',
          industry: 'Product Companies',
          location: 'Hyderabad, India',
          jobType: 'Full Time',
          workMode: 'Hybrid',
          experienceLevel: 'Mid Level',
          salaryMin: 1600000,
          salaryMax: 2600000,
          salaryCurrency: 'INR',
          salaryPeriod: 'Per Year',
          description: 'Build enterprise-scale cloud computing and artificial intelligence services for global developers.',
          responsibilities: [
            'Design, develop, and operate high-scale distributed backend systems',
            'Incorporate machine learning models and cognitive APIs into production services',
            'Ensure low latency, fault tolerance, and automated test coverage',
          ],
          requirements: [
            'Bachelor or Master degree in Computer Science or equivalent',
            'Proficiency in C#, Java, Python, or Go with strong computer science fundamentals',
            'Deep understanding of data structures, algorithms, and system design',
          ],
          skills: ['C#', 'Python', 'Cloud Services', 'System Design', 'Algorithms'],
          status: 'Active',
        },
      ]);

      console.log('[Auto-Init] Default accounts and initial jobs initialized successfully.');
    }
  } catch (error) {
    console.error('[Auto-Init] Error during database verification/seeding:', error.message);
  }
};

module.exports = {
  initDatabase,
  ensureUploadsDirs,
};
