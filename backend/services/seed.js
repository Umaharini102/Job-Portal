const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Company = require('../models/Company');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const Notification = require('../models/Notification');
const Report = require('../models/Report');

const { allCompanies } = require('./companySeedData');

// Ensure upload folders exist
const ensureUploadsDirs = () => {
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
};

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobconnect';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    ensureUploadsDirs();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Company.deleteMany({});
    await JobSeekerProfile.deleteMany({});
    await RecruiterProfile.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await SavedJob.deleteMany({});
    await Notification.deleteMany({});
    await Report.deleteMany({});

    console.log(`[Seed] Inserting ${allCompanies.length} Indian Companies and MNCs...`);
    const insertedCompanies = await Company.insertMany(allCompanies);
    console.log(`[Seed] Successfully inserted ${insertedCompanies.length} company records.`);

    // Map company name to company record for quick lookup
    const companyMap = new Map();
    insertedCompanies.forEach((c) => companyMap.set(c.name, c));

    console.log('[Seed] Creating Generic Test Accounts (Admin & Recruiter only)...');

    // 1. Generic Admin Account
    const admin = await User.create({
      name: 'Platform Administrator',
      email: 'admin@jobconnect.com',
      password: 'Admin@123',
      role: 'Admin',
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
    });

    // 2. Generic Recruiter Account associated with an Indian Company (Infosys)
    const infosysComp = companyMap.get('Infosys');
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

    console.log('[Seed] Creating Realistic Job Postings connected to Companies across Indian locations...');

    // Helper to get company details
    const getComp = (name) => companyMap.get(name) || { _id: null, name, logo: '' };

    const jobsData = [
      {
        compName: 'Infosys',
        title: 'Frontend Developer',
        skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Redux', 'REST API'],
        location: 'Hyderabad, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        experienceLevel: 'Mid Level',
        salaryMin: 900000,
        salaryMax: 1400000,
        description: 'Design and build responsive modern web applications using React, TypeScript, and micro-frontend architecture for global banking clients.',
        responsibilities: [
          'Develop modular, accessible, and high-performance user interface components',
          'Collaborate with UI/UX designers and backend API engineers in cross-functional agile pods',
          'Ensure code quality through unit testing, code reviews, and automated CI/CD pipelines',
        ],
        requirements: [
          '3-5 years experience developing production web applications using modern JavaScript / React',
          'Strong understanding of asynchronous request handling, partial page updates, and REST APIs',
          'Proficiency with Git version control and modern build tools',
        ],
        benefits: ['Comprehensive Health Insurance', 'Hybrid Work Flexibility', 'Learning Stipend & Certifications', 'Provident Fund (PF)'],
      },
      {
        compName: 'Tata Consultancy Services (TCS)',
        title: 'Java Developer',
        skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'PostgreSQL', 'Docker'],
        location: 'Pune, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        experienceLevel: 'Senior Level',
        salaryMin: 1200000,
        salaryMax: 1800000,
        description: 'Seeking an experienced Java Developer to architect and deliver scalable cloud-native microservices for high-volume enterprise transactions.',
        responsibilities: [
          'Architect and code robust RESTful microservices using Spring Boot and Hibernate',
          'Implement event-driven streaming pipelines with Apache Kafka and RabbitMQ',
          'Optimize database queries and ensure 99.99% backend uptime',
        ],
        requirements: [
          '5+ years experience in core Java (Java 17/21) and Spring ecosystem',
          'Solid grasp of relational databases, caching with Redis, and containerization with Docker',
          'Experience in banking, finance, or retail domains preferred',
        ],
        benefits: ['Health & Wellness Coverage', 'Annual Performance Bonus', 'Retirement Gratuity', 'Skill Enhancement Programs'],
      },
      {
        compName: 'Wipro',
        title: 'Python Developer',
        skills: ['Python', 'Django', 'FastAPI', 'AWS', 'Docker', 'PostgreSQL'],
        location: 'Bengaluru, India',
        jobType: 'Full Time',
        workMode: 'Remote',
        experienceLevel: 'Mid Level',
        salaryMin: 850000,
        salaryMax: 1350000,
        description: 'Build high-performance REST and GraphQL services using Python, FastAPI, and AWS serverless architecture.',
        responsibilities: [
          'Develop clean, maintainable, and well-tested backend services using Python and FastAPI',
          'Integrate third-party APIs, webhooks, and asynchronous message queues with Celery',
          'Deploy and monitor serverless microservices on AWS Lambda and ECS',
        ],
        requirements: [
          '3+ years professional Python engineering experience',
          'Knowledge of ORM libraries, relational database design, and REST principles',
          'Familiarity with cloud platforms (AWS/Azure/GCP)',
        ],
        benefits: ['100% Remote Work Option', 'Health & Term Insurance', 'Home Office Allowance', 'Flexible Paid Time Off'],
      },
      {
        compName: 'Microsoft',
        title: 'Full Stack Developer',
        skills: ['React', 'TypeScript', 'Node.js', 'C#', '.NET Core', 'Azure'],
        location: 'Bengaluru, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        experienceLevel: 'Senior Level',
        salaryMin: 2200000,
        salaryMax: 3500000,
        description: 'Join the Azure Developer Experiences team to engineer cloud tools, scalable web consoles, and developer SDKs used by millions worldwide.',
        responsibilities: [
          'Design end-to-end architectures spanning modern TypeScript web frontends and distributed .NET/Node.js backend services',
          'Partner with product management to define feature roadmaps and telemetry metrics',
          'Mentor junior engineers and uphold world-class code quality standards',
        ],
        requirements: [
          '6+ years developing web and cloud software at scale',
          'Deep expertise with React, TypeScript, and modern backend frameworks',
          'Strong CS fundamentals in data structures, algorithms, and system design',
        ],
        benefits: ['Comprehensive Medical & Dental Coverage', 'Stock Options / RSUs', 'Annual Wellness Reimbursement', 'Parental Leave'],
      },
      {
        compName: 'Amazon',
        title: 'Data Analyst',
        skills: ['SQL', 'Python', 'Tableau', 'Power BI', 'AWS Redshift', 'ETL'],
        location: 'Hyderabad, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        experienceLevel: 'Mid Level',
        salaryMin: 1100000,
        salaryMax: 1700000,
        description: 'Analyze multi-terabyte transactional datasets to unlock customer behavior insights and optimize supply chain delivery velocity.',
        responsibilities: [
          'Author complex SQL queries and ETL data pipelines in AWS Redshift and S3',
          'Build executive dashboards and automated KPI reporting in Tableau and QuickSight',
          'Perform statistical deep-dives to diagnose funnel drop-offs and operational anomalies',
        ],
        requirements: [
          '3+ years experience in business intelligence or data analytics role',
          'Advanced proficiency with SQL and relational database schemas',
          'Hands-on experience with Python or R for statistical data processing',
        ],
        benefits: ['Employee Discount on Amazon.in', 'Health Insurance', 'Transportation Allowance', 'Relocation Support'],
      },
      {
        compName: 'Google',
        title: 'Software Engineer',
        skills: ['C++', 'Java', 'Python', 'Go', 'Distributed Systems', 'Kubernetes'],
        location: 'Bengaluru, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        experienceLevel: 'Mid Level',
        salaryMin: 2400000,
        salaryMax: 3800000,
        description: 'Engineer globally distributed systems, low-latency search services, and cloud infrastructure powering products for billions of users.',
        responsibilities: [
          'Write robust, fault-tolerant, and performant code in C++, Go, or Java',
          'Collaborate across time zones with international engineering teams to build new features',
          'Debug complex production issues in distributed infrastructure',
        ],
        requirements: [
          'Bachelor or Master degree in Computer Science or related technical discipline',
          '3+ years experience with data structures, algorithm design, and software engineering',
          'Experience building distributed or multi-threaded server systems',
        ],
        benefits: ['Top-tier Healthcare Coverage', 'GSU Equity Compensation', 'Onsite Gourmet Meals & Snacks', 'Tuition Reimbursement'],
      },
      {
        compName: 'Accenture',
        title: 'Cloud Solutions Architect',
        skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'DevOps', 'Microservices'],
        location: 'Gurugram, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        experienceLevel: 'Lead / Manager',
        salaryMin: 1800000,
        salaryMax: 2600000,
        description: 'Lead enterprise cloud migration initiatives, define landing zone architectures, and guide Fortune 500 digital transformations.',
        responsibilities: [
          'Architect multi-cloud hybrid solutions complying with security and regulatory standards',
          'Formulate Infrastructure-as-Code (IaC) blueprints using Terraform and Ansible',
          'Present strategic technology roadmaps to client CTOs and technical decision-makers',
        ],
        requirements: [
          '8+ years in IT infrastructure or software development with 4+ years dedicated to cloud architecture',
          'Active AWS Solutions Architect Professional or Azure Solutions Architect Expert certification',
          'Proven leadership in guiding multi-disciplinary engineering pods',
        ],
        benefits: ['Flexible Benefits Plan', 'Life & Medical Insurance', 'Performance Incentives', 'Professional Certification Sponsorship'],
      },
      {
        compName: 'Cognizant',
        title: 'DevOps & Cloud Engineer',
        skills: ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'Linux'],
        location: 'Chennai, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        experienceLevel: 'Mid Level',
        salaryMin: 800000,
        salaryMax: 1300000,
        description: 'Automate build and deployment pipelines, maintain container clusters, and enhance telemetry across multi-cloud environments.',
        responsibilities: [
          'Build and maintain CI/CD pipelines using GitHub Actions, GitLab CI, and Jenkins',
          'Manage Kubernetes deployments, Helm charts, and cluster networking',
          'Implement observability stacks using Prometheus, Grafana, and ELK',
        ],
        requirements: [
          '3-6 years hands-on experience in DevOps and site reliability engineering',
          'Expertise in Linux system administration, shell scripting, and Docker containerization',
          'Familiarity with cloud security benchmarks and automated testing',
        ],
        benefits: ['Comprehensive Medical Cover for Family', 'Annual Retention Bonus', 'Higher Education Assistance'],
      },
      {
        compName: 'Zoho',
        title: 'Product Engineer (Full Stack)',
        skills: ['Java', 'JavaScript', 'HTML5', 'CSS3', 'MySQL', 'REST API'],
        location: 'Chennai, India',
        jobType: 'Full Time',
        workMode: 'On-site',
        experienceLevel: 'Entry Level',
        salaryMin: 650000,
        salaryMax: 1000000,
        description: 'Opportunity for passionate problem solvers to build scalable SaaS applications from scratch inside Zoho product suites.',
        responsibilities: [
          'Implement core product features across web frontend and relational backend',
          'Optimize database queries for low-latency multi-tenant environments',
          'Write unit tests, automated integration tests, and technical documentation',
        ],
        requirements: [
          'Strong command over Java and modern JavaScript',
          'Solid understanding of Object-Oriented Programming (OOP) and algorithms',
          'Passion for building user-centric software products',
        ],
        benefits: ['Wholesome Meals Provided', 'Free Transportation Facilities', 'Supportive Campus Culture', 'Medical Coverage'],
      },
      {
        compName: 'NVIDIA',
        title: 'Deep Learning Software Engineer',
        skills: ['Python', 'C++', 'PyTorch', 'CUDA', 'Deep Learning', 'TensorRT'],
        location: 'Pune, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        experienceLevel: 'Senior Level',
        salaryMin: 2500000,
        salaryMax: 4000000,
        description: 'Accelerate artificial intelligence models and inference runtimes on GPU architectures using CUDA and TensorRT.',
        responsibilities: [
          'Optimize transformer and computer vision deep neural networks for real-time edge and datacenter inference',
          'Profile GPU memory bandwidth, compute efficiency, and pipeline bottlenecks',
          'Contribute to open-source AI frameworks and NVIDIA software development kits',
        ],
        requirements: [
          '5+ years programming in C++ and Python with deep knowledge of modern GPU computing',
          'Experience with PyTorch, ONNX, and TensorRT runtime optimization',
          'Strong background in linear algebra, parallel algorithms, and neural networks',
        ],
        benefits: ['Generous Equity / ESPP Program', 'Top Health Insurance', 'Annual Wellness Allowance', 'Flexible Working Setup'],
      },
      {
        compName: 'Deloitte',
        title: 'Technology Consultant - Enterprise ERP',
        skills: ['SAP S/4HANA', 'ERP Implementation', 'Business Analysis', 'SQL', 'Agile'],
        location: 'Mumbai, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        experienceLevel: 'Mid Level',
        salaryMin: 1000000,
        salaryMax: 1600000,
        description: 'Work closely with market-leading retail and manufacturing clients to modernize ERP landscapes and streamline supply chains.',
        responsibilities: [
          'Conduct business requirement gathering workshops and map processes to ERP solutions',
          'Configure system parameters, test user workflows, and execute cutover data migration',
          'Provide post-go-live hypercare support and functional guidance to client leadership',
        ],
        requirements: [
          '3-6 years consulting or implementation experience in SAP or Oracle ERP modules',
          'Excellent client communication, analytical, and presentation skills',
          'B.Tech, MBA, or equivalent qualification',
        ],
        benefits: ['Competitive Medical Insurance', 'Performance Bonus', 'Dedicated Mentorship Program', 'Flexible Work Options'],
      },
      {
        compName: 'HCLTech',
        title: 'Cybersecurity Analyst',
        skills: ['SIEM', 'SOC', 'Splunk', 'Incident Response', 'Network Security', 'Firewalls'],
        location: 'Noida, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        experienceLevel: 'Mid Level',
        salaryMin: 750000,
        salaryMax: 1200000,
        description: 'Monitor enterprise security operations centers (SOC), analyze threat telemetry, and coordinate rapid incident containment.',
        responsibilities: [
          'Monitor SIEM alerts and correlate log events across firewalls, endpoints, and cloud assets',
          'Triage suspicious activity, malware detections, and phishing indicators',
          'Draft incident reports and recommend defense enhancements to system administrators',
        ],
        requirements: [
          '2-4 years experience in Security Operations Center (SOC) or security analysis',
          'Familiarity with Splunk, Microsoft Sentinel, or QRadar',
          'Certifications like CEH, CompTIA Security+, or CySA+ are preferred',
        ],
        benefits: ['Shift Allowance', 'Health Insurance', 'Overtime Benefits', 'Continuous Learning Portal'],
      },
    ];

    const jobsToCreate = jobsData.map((item) => {
      const comp = getComp(item.compName);
      return {
        recruiterId: recruiter._id,
        companyId: comp._id,
        companyName: comp.name,
        companyLogo: comp.logo || '',
        title: item.title,
        description: item.description,
        responsibilities: item.responsibilities,
        requirements: item.requirements,
        skills: item.skills,
        location: item.location,
        jobType: item.jobType,
        experienceLevel: item.experienceLevel,
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        workMode: item.workMode,
        benefits: item.benefits,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'Active',
      };
    });

    await Job.create(jobsToCreate);
    console.log(`[Seed] Successfully created ${jobsToCreate.length} live job postings linked to companies!`);

    console.log('--------------------------------------------------');
    console.log('SEED COMPLETE: 46 INDIAN COMPANIES & MNCs + LIVE JOBS');
    console.log('Zero fake personal accounts. Users register independently at /register');
    console.log('Credentials:');
    console.log('1. Admin:     admin@jobconnect.com     / Admin@123');
    console.log('2. Recruiter: recruiter@jobconnect.com / Recruiter@123');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
