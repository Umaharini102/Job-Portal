import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/cards/JobCard';
import CompanyCard from '../../components/cards/CompanyCard';
import Career3DVisual from '../../components/visuals/Career3DVisual';
import JobPortalBackground from '../../components/visuals/JobPortalBackground';
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Compass,
  Layers,
  Award,
  Clock,
  Database,
  FileText,
  ChevronRight,
  Globe,
  Cloud,
  Code2,
  Lock,
  Target,
  Send,
  Star,
  Laptop,
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  // Data states
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [popularCompanies, setPopularCompanies] = useState([]);
  const [realStats, setRealStats] = useState({ totalJobs: null, totalCompanies: null });
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Video fallback state
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const fetchLandingData = async () => {
      // 1. Fetch real jobs from existing backend
      try {
        const jobsRes = await API.get('/jobs?limit=6');
        if (jobsRes.data && jobsRes.data.success) {
          setFeaturedJobs(jobsRes.data.jobs || []);
          if (typeof jobsRes.data.total === 'number') {
            setRealStats((prev) => ({ ...prev, totalJobs: jobsRes.data.total }));
          }
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoadingJobs(false);
      }

      // 2. Fetch real companies from existing backend
      try {
        const companiesRes = await API.get('/companies/popular').catch(() =>
          API.get('/jobs/companies/popular').catch(() => API.get('/companies?limit=6'))
        );
        if (companiesRes.data && companiesRes.data.success) {
          const comps = companiesRes.data.companies || [];
          setPopularCompanies(comps);
          if (typeof companiesRes.data.total === 'number') {
            setRealStats((prev) => ({ ...prev, totalCompanies: companiesRes.data.total }));
          } else if (comps.length > 0) {
            setRealStats((prev) => ({ ...prev, totalCompanies: comps.length }));
          }
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchLandingData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('search', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/jobs?search=${encodeURIComponent(categoryTitle)}`);
  };

  const categories = [
    { title: 'Software Development', icon: Code2, desc: 'Frontend, Backend, Full Stack' },
    { title: 'Web Development', icon: Globe, desc: 'React, Node, Next.js, API Design' },
    { title: 'Data Science & AI', icon: Sparkles, desc: 'Machine Learning, NLP, Big Data' },
    { title: 'Cybersecurity', icon: Lock, desc: 'SecOps, Penetration Testing, IAM' },
    { title: 'Cloud & DevOps', icon: Cloud, desc: 'AWS, Azure, Docker, Kubernetes' },
    { title: 'UI/UX Design', icon: Laptop, desc: 'Design Systems, Figma, Prototyping' },
    { title: 'Testing & QA', icon: CheckCircle2, desc: 'Automation, CI/CD, Selenium, Cypress' },
    { title: 'Business & Management', icon: Briefcase, desc: 'Product, Agile Scrum, Operations' },
    { title: 'Sales & Marketing', icon: TrendingUp, desc: 'Growth, Enterprise Sales, SEO' },
    { title: 'Finance & Analytics', icon: Building2, desc: 'Financial Analysis, Risk, FinTech' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Your Profile',
      desc: 'Build your professional profile with verified skills, education, and career goals.',
      icon: Users,
    },
    {
      num: '02',
      title: 'Discover Jobs',
      desc: 'Find curated opportunities matching your interests, experience level, and desired compensation.',
      icon: Search,
    },
    {
      num: '03',
      title: 'Apply Direct',
      desc: 'Apply directly to hiring decision-makers with seamless one-click resume submission.',
      icon: Send,
    },
    {
      num: '04',
      title: 'Track Applications',
      desc: 'Monitor review stages, interview schedules, and job offers transparently in real time.',
      icon: CheckCircle2,
    },
  ];

  const careerPath = [
    { step: 'Discover', desc: 'Identify high-growth roles', icon: Compass },
    { step: 'Learn', desc: 'Target in-demand skills', icon: Target },
    { step: 'Apply', desc: 'Direct recruiter pipeline', icon: Send },
    { step: 'Interview', desc: 'Showcase your expertise', icon: Users },
    { step: 'Grow', desc: 'Advance your professional trajectory', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-brand-600 selection:text-white">
      {/* Sophisticated Animated Background */}
      <JobPortalBackground />

      {/* 1. HERO SECTION — MOST IMPORTANT */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            {/* Small Professional Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-800/80 border border-brand-500/30 shadow-lg shadow-brand-500/10 mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide text-cyan-300 uppercase">
                Discover • Apply • Grow
              </span>
            </div>

            {/* Large Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
              Find the Right Job.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-brand-400 to-indigo-300">
                Build Your Future.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mb-8">
              Discover opportunities, connect with companies, and take the next step in your career.
            </p>

            {/* Powerful Job Search Interface */}
            <form
              onSubmit={handleHeroSearch}
              className="bg-slate-800/90 backdrop-blur-md p-2.5 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center gap-2 text-left w-full max-w-2xl mb-4"
            >
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 flex-1 w-full border-b sm:border-b-0 sm:border-r border-slate-700">
                <Search className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search job title, skills or keywords"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent outline-none text-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2.5 px-3.5 py-2.5 flex-1 w-full">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location (e.g. Remote, Bengaluru)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent outline-none text-white placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 flex-shrink-0 hover:scale-[1.02]"
              >
                <span>Search Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Trending Keywords */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-400 mb-8">
              <span className="text-slate-400 font-semibold">Popular:</span>
              {['React Developer', 'Cloud Architect', 'Python AI', 'DevOps', 'UI/UX Designer', 'Remote'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Two Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 w-full sm:w-auto">
              <Link
                to="/jobs"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-brand-500/50 transition-all flex items-center justify-center gap-2.5 shadow-lg group"
              >
                <Briefcase className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Explore Jobs</span>
              </Link>

              <Link
                to={user ? '/profile' : '/register'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-brand-600/30 hover:shadow-cyan-500/40 hover:scale-[1.02]"
              >
                <span>{user ? 'View Your Profile' : 'Create Your Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-800/80 w-full grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Verified Employers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Direct Hiring</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Live Tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Private & Secure</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Career Visualization */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            {/* Ambient Halo Backdrop */}
            <div className="absolute inset-0 -m-6 bg-gradient-to-tr from-brand-600/20 via-cyan-500/20 to-indigo-600/20 rounded-3xl blur-2xl -z-10 pointer-events-none" />

            {/* 3D Visual Frame */}
            <div className="w-full h-[420px] sm:h-[480px] lg:h-[520px] rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-cyan-500/20 shadow-2xl shadow-blue-900/40 backdrop-blur-xl overflow-hidden relative group">
              <Career3DVisual className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPTIONAL VIDEO / MODERN WORKPLACE AMBIENT HIGHLIGHT */}
      <section className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950/60 backdrop-blur-md">
          {!videoError ? (
            <div className="relative h-44 sm:h-52 md:h-60 w-full overflow-hidden">
              <video
                autoPlay
                muted
                loop
                playsInline
                onError={() => setVideoError(true)}
                className="w-full h-full object-cover opacity-35"
                poster="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
              >
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-large.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent flex items-center px-6 sm:px-10">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-cyan-400 mb-2">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Empowering Modern Careers
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Where Talent Meets World-Class Engineering & Leadership
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Designed for candidates seeking growth and companies seeking excellence. Explore verified career openings with competitive compensation packages.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-950 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Connect Directly with Hiring Teams</h3>
                <p className="text-xs text-slate-400 mt-1">Accelerate your professional trajectory with verified employer networks.</p>
              </div>
              <Link to="/jobs" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                <span>Browse Roles</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. QUICK PLATFORM SECTION — REAL DATA ONLY (NO FAKE NUMBERS) */}
      <section className="relative z-10 py-10 bg-slate-950/70 border-y border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Real metric 1 or feature card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center md:text-left">
              {realStats.totalJobs !== null ? (
                <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  {realStats.totalJobs}
                </div>
              ) : (
                <div className="text-2xl font-bold text-cyan-400 flex items-center justify-center md:justify-start gap-1.5">
                  <Briefcase className="w-5 h-5 text-cyan-400" /> Active
                </div>
              )}
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                Available Opportunities
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time indexed openings</p>
            </div>

            {/* Real metric 2 or feature card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center md:text-left">
              {realStats.totalCompanies !== null ? (
                <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-300">
                  {realStats.totalCompanies}
                </div>
              ) : (
                <div className="text-2xl font-bold text-emerald-400 flex items-center justify-center md:justify-start gap-1.5">
                  <Building2 className="w-5 h-5 text-emerald-400" /> Verified
                </div>
              )}
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                Hiring Companies
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Vetted employer partners</p>
            </div>

            {/* Feature card 3 */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center md:text-left">
              <div className="text-2xl font-bold text-indigo-400 flex items-center justify-center md:justify-start gap-1.5">
                <Clock className="w-5 h-5 text-indigo-400" /> Real-Time
              </div>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                Application Tracking
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Direct candidate feedback</p>
            </div>

            {/* Feature card 4 */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center md:text-left">
              <div className="text-2xl font-bold text-brand-400 flex items-center justify-center md:justify-start gap-1.5">
                <ShieldCheck className="w-5 h-5 text-brand-400" /> Direct
              </div>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                Recruiter Access
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Zero intermediary friction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED JOBS SECTION (REAL DATA) */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-cyan-300 mb-2">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              Verified Opportunities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Job Opportunities</h2>
            <p className="text-sm text-slate-400 mt-1">Hand-picked openings from premier organizations hiring right now</p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-56 bg-slate-800/60 rounded-2xl animate-pulse border border-slate-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} isSaved={job.isSaved} hasApplied={job.hasApplied} />
              ))
            ) : (
              <div className="col-span-full p-12 rounded-3xl bg-slate-800/40 border border-slate-800 text-center text-slate-400">
                <Briefcase className="w-12 h-12 mx-auto text-slate-500 mb-3" />
                <h4 className="text-lg font-bold text-white mb-1">Discover Active Roles</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  Explore thousands of verified career opportunities across engineering, product, and leadership.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md"
                >
                  Browse Job Directory <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. EXPLORE JOBS BY CATEGORY */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Domain Taxonomy
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Explore Jobs by Category</h2>
            <p className="text-sm text-slate-400 mt-1">Discover in-demand roles across premier technology and management disciplines</p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.title)}
                className="bg-slate-800/60 hover:bg-slate-800 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-brand-600/10 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-brand-600/15 border border-brand-500/25 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-600/30 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{cat.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <span>Explore Roles</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. HOW IT WORKS (4 STEPS WITH VISUAL CONNECTION) */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider">
            Streamlined Career Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            A frictionless, intelligent hiring pipeline from initial discovery to final offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="relative rounded-3xl bg-slate-800/60 border border-slate-800 p-6 flex flex-col justify-between backdrop-blur-md group hover:border-brand-400/50 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black text-brand-400 font-mono">{st.num}</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-700/60 text-cyan-300 flex items-center justify-center border border-slate-700 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Step {i + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. PROFILE / RESUME SECTION */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-cyan-300">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Dynamic Candidate Identity
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Build a Profile That Gets Noticed
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Stand out to elite recruiters with a unified career profile. Highlight your projects, certifications, verified skill proficiencies, and career expectations in one polished digital portfolio.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span className="text-xs sm:text-sm text-slate-300">
                  <strong className="text-white">Direct ATS-Friendly Resume Parsing:</strong> Upload your existing CV or generate an interactive profile instantly.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span className="text-xs sm:text-sm text-slate-300">
                  <strong className="text-white">Smart Skill Endorsements:</strong> Showcase proficiencies in React, Python, Cloud infrastructure, and System Design.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span className="text-xs sm:text-sm text-slate-300">
                  <strong className="text-white">Privacy Controls:</strong> Maintain complete control over who views your contact information and active job status.
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to={user ? '/profile' : '/register'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all hover:scale-[1.02]"
              >
                <span>{user ? 'Manage Your Profile' : 'Create Your Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right 3D-Style Interactive Resume Card */}
          <div className="lg:col-span-6 relative">
            <div className="p-7 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-brand-500/40 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

              {/* Profile Card Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-700/80">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-brand-600/30">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'JD'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-xl text-white">
                      {user?.name || 'Alex Morgan'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Senior Full-Stack & Cloud Engineer  •  8+ Years Exp
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />
                    <span>Bengaluru / Remote</span>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="py-5 border-b border-slate-700/80">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2.5 font-semibold">
                  Core Skills & Technologies
                </span>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'Next.js', 'AWS Cloud', 'Docker', 'GraphQL', 'TailwindCSS'].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-slate-700/60 border border-slate-600 text-xs font-medium text-slate-200"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Experience & Education */}
              <div className="py-5 border-b border-slate-700/80 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Latest Experience
                  </span>
                  <p className="text-xs font-bold text-white">Lead Engineer @ Tech Innovators</p>
                  <p className="text-[11px] text-slate-400">Microservices, Event Streaming</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Education & Credentials
                  </span>
                  <p className="text-xs font-bold text-white">B.Tech Computer Science</p>
                  <p className="text-[11px] text-slate-400">AWS Certified Solutions Architect</p>
                </div>
              </div>

              {/* Career Match Pill */}
              <div className="pt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Profile Completeness: <strong className="text-white">100%</strong>
                </span>
                <span className="text-cyan-400 font-semibold font-mono">Ready for Interviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPANIES SECTION (REAL DATA) */}
      {popularCompanies.length > 0 && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-300 mb-2">
                <Building2 className="w-3.5 h-3.5 text-brand-400" />
                Featured Employers
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Explore Opportunities From Top Companies
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Verified enterprises and innovative scale-ups recruiting active candidates
              </p>
            </div>
            <Link
              to="/companies"
              className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto transition-colors"
            >
              <span>View All Companies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCompanies.slice(0, 6).map((comp, idx) => (
              <CompanyCard key={comp._id || idx} company={comp} />
            ))}
          </div>
        </section>
      )}

      {/* 9. CAREER GROWTH PROGRESSION VISUAL */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider">
            Career Velocity Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
            Discover → Learn → Apply → Interview → Grow
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every step of your career trajectory mapped out with precision and transparency.
          </p>
        </div>

        {/* Animated Pathway Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {careerPath.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-800/60 border border-slate-800 text-center flex flex-col items-center justify-between hover:border-brand-400/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-600/15 border border-brand-500/25 text-cyan-300 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-brand-600/30 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                    {item.step}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </div>
                <div className="w-full mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400">
                  Phase 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION BANNER */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 z-10 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-brand-900/70 via-indigo-900/50 to-slate-900/90 border border-brand-500/30 p-10 sm:p-14 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Find the Right Job. Build Your Career.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of ambitious professionals accelerating their careers with verified job opportunities and direct recruiter pipelines.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-xl shadow-brand-600/30 transition-all flex items-center gap-2 hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              Explore All Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
