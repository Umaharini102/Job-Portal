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
  Check,
  Flame,
  BarChart3,
  Bookmark,
  Share2,
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  // Data states (Real backend data)
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [popularCompanies, setPopularCompanies] = useState([]);
  const [realStats, setRealStats] = useState({ totalJobs: null, totalCompanies: null });
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Interactive Career Simulation Timeline state
  const [activeSimulationStep, setActiveSimulationStep] = useState(2); // default Opportunities

  useEffect(() => {
    const fetchLandingData = async () => {
      // 1. Fetch real jobs from backend
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

      // 2. Fetch real companies from backend
      try {
        const companiesRes = await API.get('/companies?limit=6').catch(() =>
          API.get('/companies/popular')
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

  // Section 12: Job Categories (Pill-style / editorial blocks)
  const categories = [
    { title: 'Software Development', icon: Code2, count: '140+ roles' },
    { title: 'AI & Machine Learning', icon: Sparkles, count: '85+ roles' },
    { title: 'Data & Analytics', icon: Database, count: '60+ roles' },
    { title: 'Cybersecurity', icon: Lock, count: '45+ roles' },
    { title: 'Cloud & DevOps', icon: Cloud, count: '90+ roles' },
    { title: 'UI/UX Design', icon: Laptop, count: '35+ roles' },
    { title: 'Business', icon: Briefcase, count: '70+ roles' },
    { title: 'Marketing', icon: TrendingUp, count: '50+ roles' },
  ];

  // Section 9: Career Simulation Timeline stages
  const simulationStages = [
    {
      id: 0,
      title: 'Profile',
      tag: 'Step 01',
      desc: 'Build an ATS-optimized digital candidate identity with verified credentials.',
      icon: Users,
      metric: 'Identity Verified',
    },
    {
      id: 1,
      title: 'Skills',
      tag: 'Step 02',
      desc: 'Calibrate your competencies against real employer tech stacks & skill benchmarks.',
      icon: Target,
      metric: 'Skills Endorsed',
    },
    {
      id: 2,
      title: 'Opportunities',
      tag: 'Step 03',
      desc: 'Simulate high-probability job matches filtered by experience, tech stack, and salary.',
      icon: Compass,
      metric: '98% Compatibility',
    },
    {
      id: 3,
      title: 'Applications',
      tag: 'Step 04',
      desc: 'Submit direct applications without intermediary spam or third-party agencies.',
      icon: Send,
      metric: 'Direct Recruiter Line',
    },
    {
      id: 4,
      title: 'Interviews',
      tag: 'Step 05',
      desc: 'Prepare with role-specific interview rubrics and live schedule coordination.',
      icon: Clock,
      metric: 'Stage Feedback',
    },
    {
      id: 5,
      title: 'Career',
      tag: 'Step 06',
      desc: 'Unlock competitive packages, offer negotiations, and continuous executive progression.',
      icon: TrendingUp,
      metric: 'Trajectory Unlocked',
    },
  ];

  return (
    <div className="min-h-screen bg-charcoal-950 text-cream-100 flex flex-col relative overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* Ambient background with warm burnt orange and lavender glows */}
      <JobPortalBackground />

      {/* =========================================================================
          1. HERO SECTION (Section 2, 3, 5: Unique Hero, 3D Visual, Search Bar)
         ========================================================================= */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            {/* Small Warm Editorial Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-charcoal-900/90 border border-brand-500/30 shadow-lg mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-cream-200 uppercase">
                Autonomous Career Simulation
              </span>
            </div>

            {/* Main Heading as specified:
                Find Work That Moves You Forward.
                With bold editorial styling and orange/coral highlight */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-6">
              Find Work <br />
              That Moves You <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-coral-400 to-brand-400">
                Forward.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-cream-200/80 font-normal leading-relaxed max-w-2xl mb-8">
              Discover opportunities, connect with companies, and build the career you want.
            </p>

            {/* Section 5: Large Rounded Search Container in Dark Charcoal with Orange Button */}
            <form
              onSubmit={handleHeroSearch}
              className="bg-charcoal-900/95 backdrop-blur-md p-2 rounded-2xl sm:rounded-full shadow-2xl border border-charcoal-700/90 flex flex-col sm:flex-row items-center gap-2 text-left w-full max-w-2xl mb-6 hover:border-brand-500/50 transition-colors"
            >
              <div className="flex items-center gap-3 px-4 py-3 flex-1 w-full border-b sm:border-b-0 sm:border-r border-charcoal-700">
                <Search className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search jobs, skills or companies"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent outline-none text-white placeholder:text-charcoal-400"
                />
              </div>

              <div className="flex items-center gap-3 px-4 py-3 flex-1 w-full">
                <MapPin className="w-4 h-4 text-coral-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location (e.g. Remote, Bengaluru)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent outline-none text-white placeholder:text-charcoal-400"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs sm:text-sm rounded-xl sm:rounded-full shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2 flex-shrink-0 hover:scale-[1.02]"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Action Buttons: Search Jobs & Explore Opportunities */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 w-full sm:w-auto">
              <Link
                to="/jobs"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-xl shadow-brand-600/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Search Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#opportunities"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold text-cream-200 bg-charcoal-900/90 hover:bg-charcoal-800 border border-charcoal-700 hover:border-brand-500/50 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Compass className="w-4 h-4 text-brand-400" />
                <span>Explore Opportunities</span>
              </a>
            </div>

            {/* Trending Keywords */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-charcoal-400 mb-8">
              <span className="text-cream-300 font-semibold">Popular Searches:</span>
              {['Full-Stack Engineer', 'AI & Python', 'Cloud DevOps', 'System Architect', 'UI/UX Designer', 'Remote India'].map(
                (tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                    className="px-3 py-1 rounded-full bg-charcoal-900/80 hover:bg-charcoal-800 border border-charcoal-700/80 text-cream-300 hover:text-brand-400 transition-colors"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-charcoal-800/80 w-full grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0" />
                <span className="text-xs text-cream-300 font-medium">Verified Employers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-cream-300 font-medium">Direct Hiring</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-lavender-400 shrink-0" />
                <span className="text-xs text-cream-300 font-medium">Live Tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-coral-400 shrink-0" />
                <span className="text-xs text-cream-300 font-medium">Private & Secure</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Career Workspace Visual (Section 3) */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            {/* Ambient Warm Halo */}
            <div className="absolute inset-0 -m-6 bg-gradient-to-tr from-brand-600/20 via-coral-500/15 to-lavender-600/20 rounded-3xl blur-2xl -z-10 pointer-events-none" />

            {/* 3D Visual Frame in Charcoal + Burnt Orange + Purple */}
            <div className="w-full h-[440px] sm:h-[500px] lg:h-[540px] rounded-3xl bg-gradient-to-b from-charcoal-900/90 via-charcoal-900/70 to-charcoal-950/90 border border-brand-500/25 shadow-2xl backdrop-blur-xl overflow-hidden relative group">
              <Career3DVisual className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CAREER INSIGHTS SECTION (Section 11: Your Career Snapshot)
         ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-xs font-mono font-bold text-brand-400 mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-brand-500" />
            <span>Telemetry & Momentum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Your Career Snapshot
          </h2>
          <p className="text-sm text-cream-300/80 mt-2">
            Real-time metric indicators simulating your market readiness, pipeline engagement, and opportunity velocity.
          </p>
        </div>

        {/* 4 Analytics Cards in Charcoal, Burnt Orange, Purple (NO BLUE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Applications */}
          <div className="bg-charcoal-900/90 rounded-2xl p-6 border border-charcoal-700/80 hover:border-brand-500/40 transition-all shadow-xl group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-400">
                Applications
              </span>
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-black text-white font-mono tracking-tight">
              24
            </div>
            <p className="text-xs text-cream-400/80 mt-1">Direct recruiter submissions</p>
            {/* Minimalist Sparkline graph */}
            <div className="mt-4 pt-3 border-t border-charcoal-800 flex items-center justify-between text-[11px] text-brand-400 font-semibold">
              <span>+6 this week</span>
              <span className="text-emerald-400 font-mono">↑ 33%</span>
            </div>
          </div>

          {/* Card 2: Interviews */}
          <div className="bg-charcoal-900/90 rounded-2xl p-6 border border-charcoal-700/80 hover:border-lavender-500/40 transition-all shadow-xl group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-400">
                Interviews
              </span>
              <div className="w-8 h-8 rounded-lg bg-lavender-500/20 text-lavender-400 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-black text-white font-mono tracking-tight">
              6
            </div>
            <p className="text-xs text-cream-400/80 mt-1">Hiring manager loops active</p>
            <div className="mt-4 pt-3 border-t border-charcoal-800 flex items-center justify-between text-[11px] text-lavender-400 font-semibold">
              <span>2 technical • 4 executive</span>
              <span className="text-lavender-300 font-mono">Stage 3</span>
            </div>
          </div>

          {/* Card 3: Saved Jobs */}
          <div className="bg-charcoal-900/90 rounded-2xl p-6 border border-charcoal-700/80 hover:border-coral-500/40 transition-all shadow-xl group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-400">
                Saved Jobs
              </span>
              <div className="w-8 h-8 rounded-lg bg-coral-500/20 text-coral-400 flex items-center justify-center font-bold">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-black text-white font-mono tracking-tight">
              18
            </div>
            <p className="text-xs text-cream-400/80 mt-1">High-match bookmarked roles</p>
            <div className="mt-4 pt-3 border-t border-charcoal-800 flex items-center justify-between text-[11px] text-coral-400 font-semibold">
              <span>Avg ₹28.5 LPA</span>
              <span className="text-coral-300 font-mono">92% Match</span>
            </div>
          </div>

          {/* Card 4: Profile Completeness */}
          <div className="bg-charcoal-900/90 rounded-2xl p-6 border border-charcoal-700/80 hover:border-brand-500/40 transition-all shadow-xl group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-400">
                Profile
              </span>
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-black text-brand-400 font-mono tracking-tight">
              78%
            </div>
            <p className="text-xs text-cream-400/80 mt-1">Calibrated for algorithm search</p>
            {/* Progress bar */}
            <div className="w-full bg-charcoal-800 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-600 to-coral-500 h-2 rounded-full w-[78%]" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED JOBS SECTION (Section 6 & 7: Opportunities Worth Exploring)
             Alternating card backgrounds: Cream, Warm Beige, Light Lavender.
         ========================================================================= */}
      <section
        id="opportunities"
        className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-xs font-mono font-bold text-brand-400 mb-2">
              <Briefcase className="w-3.5 h-3.5 text-brand-500" />
              <span>Verified Openings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Opportunities Worth Exploring
            </h2>
            <p className="text-sm text-cream-300/80 mt-1">
              Editorial selection of high-impact opportunities with transparent compensation.
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 bg-charcoal-900/60 rounded-2xl animate-pulse border border-charcoal-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job, idx) => {
                // Alternating card backgrounds: Cream, Warm Beige, Very Light Lavender (NO BLUE)
                const variants = ['cream', 'beige', 'lavender'];
                const cardVariant = variants[idx % variants.length];
                return (
                  <JobCard
                    key={job._id || idx}
                    job={job}
                    bgVariant={cardVariant}
                    isSaved={job.isSaved}
                    hasApplied={job.hasApplied}
                  />
                );
              })
            ) : (
              <div className="col-span-full p-14 rounded-3xl bg-charcoal-900/80 border border-charcoal-800 text-center text-cream-300">
                <Briefcase className="w-12 h-12 mx-auto text-charcoal-500 mb-3" />
                <h4 className="text-lg font-bold text-white mb-1">Discover Active Roles</h4>
                <p className="text-xs text-cream-400 max-w-md mx-auto mb-5 leading-relaxed">
                  Explore verified career opportunities across engineering, product design, and executive leadership.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Browse Job Directory <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      {/* =========================================================================
          4. JOB CATEGORIES (Section 12: Pill-style or editorial blocks)
         ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-charcoal-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-500/10 border border-lavender-500/25 text-xs font-mono font-bold text-lavender-300 mb-2">
              <Layers className="w-3.5 h-3.5 text-lavender-400" />
              <span>Discipline Taxonomy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              In-Demand Disciplines
            </h2>
            <p className="text-sm text-cream-300/80 mt-1">
              Explore specialized opportunities curated by domain expertise
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Editorial Blocks with Simple Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.title)}
                className="bg-charcoal-900/80 hover:bg-charcoal-850 p-5 rounded-2xl border border-charcoal-800 hover:border-brand-500/40 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-brand-600/20 group-hover:text-brand-300 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-white group-hover:text-brand-400 transition-colors text-sm sm:text-base leading-snug">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-charcoal-400 mt-1 font-mono">{cat.count}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-charcoal-800 flex items-center justify-between text-[11px] font-bold text-charcoal-400 group-hover:text-cream-200 transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 text-brand-500 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. CAREER SIMULATION SECTION (Section 9: Your Career, Simulated.)
             Interactive timeline: Profile → Skills → Opportunities → Applications → Interviews → Career
         ========================================================================= */}
      <section
        id="career-simulation"
        className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-charcoal-800/80"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-xs font-mono font-bold text-brand-400 mb-3">
            <Zap className="w-3.5 h-3.5 text-brand-500" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Your Career, Simulated.
          </h2>
          <p className="text-sm sm:text-base text-cream-300/80 mt-3 max-w-2xl mx-auto leading-relaxed">
            Experience an end-to-end simulation of your professional journey. See how every milestone connects directly to your long-term earnings and growth.
          </p>
        </div>

        {/* Visual interactive timeline navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {simulationStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeSimulationStep === idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveSimulationStep(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-charcoal-850 border-brand-500 shadow-xl shadow-brand-500/15 scale-[1.03]'
                    : 'bg-charcoal-900/70 border-charcoal-800 hover:border-charcoal-700 hover:bg-charcoal-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-charcoal-400">
                      {stage.tag}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-brand-500 text-white' : 'bg-charcoal-800 text-cream-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className={`font-black text-sm ${isSelected ? 'text-brand-400' : 'text-white'}`}>
                    {stage.title}
                  </h4>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-charcoal-400">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-brand-500' : 'bg-charcoal-600'
                    }`}
                  />
                  <span className="truncate">{stage.metric}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Interactive Spotlight Box */}
        <div className="bg-charcoal-900/90 rounded-3xl p-8 sm:p-10 border border-charcoal-700/80 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 text-brand-400 text-xs font-mono font-bold">
                <span>Phase 0{activeSimulationStep + 1} Activated</span>
                <span>•</span>
                <span>{simulationStages[activeSimulationStep].title}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Simulating {simulationStages[activeSimulationStep].title} Optimization
              </h3>
              <p className="text-sm sm:text-base text-cream-300 leading-relaxed max-w-2xl">
                {simulationStages[activeSimulationStep].desc} Every simulated candidate profile receives automated telemetry to minimize drop-off and maximize interview conversion rates.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/jobs"
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>Simulate Next Match</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={user ? '/profile' : '/register'}
                  className="px-6 py-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 text-cream-200 font-bold text-xs transition-all"
                >
                  {user ? 'View Full Profile' : 'Create Free Account'}
                </Link>
              </div>
            </div>

            {/* Right Mini Telemetry Metric Display */}
            <div className="lg:col-span-4 bg-charcoal-950/80 rounded-2xl p-6 border border-charcoal-800 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-charcoal-400 font-bold block">
                Simulation Status
              </span>
              <div className="flex items-center justify-between text-xs text-cream-300 py-1 border-b border-charcoal-800">
                <span>Target Readiness</span>
                <strong className="text-brand-400 font-mono">98.4%</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-cream-300 py-1 border-b border-charcoal-800">
                <span>Direct Pipeline Confidence</span>
                <strong className="text-emerald-400 font-mono">High</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-cream-300 py-1 border-b border-charcoal-800">
                <span>Estimated Response Time</span>
                <strong className="text-lavender-400 font-mono">&lt; 48 Hours</strong>
              </div>
              <div className="pt-2 text-[11px] text-charcoal-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Synchronized with active backend data</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. PROFILE COMPLETION DASHBOARD CARD (Section 10)
         ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-charcoal-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-xs font-mono font-bold text-brand-400">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Smart Profile Optimizer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Build Your Career Profile
            </h2>
            <p className="text-sm sm:text-base text-cream-300/90 leading-relaxed">
              Recruiters prioritize verified, high-completeness candidate profiles. Highlight your skills, credentials, and career expectations in one polished digital portfolio.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-cream-200">
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Direct ATS parsing with automated skill extraction</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-cream-200">
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Verified endorsements from peer engineers & hiring managers</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-cream-200">
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Full privacy controls over who views your active status</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to={user ? '/profile/edit' : '/register'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all hover:scale-[1.02]"
              >
                <span>{user ? 'Complete Profile →' : 'Build Your Profile →'}</span>
              </Link>
            </div>
          </div>

          {/* Right Dashboard Card (Section 10 specification):
              Build Your Career Profile, 78% Complete, Checklist, Circular progress indicator */}
          <div className="lg:col-span-6 relative">
            <div className="bg-charcoal-900 rounded-3xl p-8 border border-charcoal-700/90 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-charcoal-800">
                <div>
                  <h3 className="font-extrabold text-xl text-white">Build Your Career Profile</h3>
                  <p className="text-xs text-charcoal-400 mt-0.5">High-impact profile health score</p>
                </div>

                {/* Circular Progress Indicator with Orange Accent */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                      className="text-charcoal-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Orange Progress Arc 78% */}
                    <path
                      className="text-brand-500"
                      strokeDasharray="78, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-bold text-white">78%</span>
                </div>
              </div>

              {/* Checklist from Section 10 */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-850 border border-charcoal-800">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">Skills</span>
                  </div>
                  <span className="text-[11px] font-mono text-brand-400">8 Endorsed</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-850 border border-charcoal-800">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">Education</span>
                  </div>
                  <span className="text-[11px] font-mono text-brand-400">Verified</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-850 border border-charcoal-800">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">Experience</span>
                  </div>
                  <span className="text-[11px] font-mono text-brand-400">4+ Years Logged</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-850/60 border border-charcoal-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border border-charcoal-600 text-charcoal-400 flex items-center justify-center text-xs font-mono">
                      ○
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-cream-300">Career Goals</span>
                  </div>
                  <span className="text-[11px] font-mono text-charcoal-400">Pending</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-850/60 border border-charcoal-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border border-charcoal-600 text-charcoal-400 flex items-center justify-center text-xs font-mono">
                      ○
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-cream-300">Resume</span>
                  </div>
                  <span className="text-[11px] font-mono text-charcoal-400">Upload PDF</span>
                </div>
              </div>

              {/* Complete Profile CTA Link */}
              <div className="pt-2 flex items-center justify-between">
                <Link
                  to={user ? '/profile/edit' : '/login'}
                  className="text-xs sm:text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Complete Profile →</span>
                </Link>
                <span className="text-[11px] text-charcoal-400 font-mono">2 items left</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. COMPANY SECTION (Section 8: Meet the Companies Behind the Opportunities)
             Connects to real backend data!
         ========================================================================= */}
      {popularCompanies.length > 0 && (
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 border-t border-charcoal-800/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-xs font-mono font-bold text-brand-400 mb-2">
                <Building2 className="w-3.5 h-3.5 text-brand-500" />
                <span>Employer Network</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Meet the Companies Behind the Opportunities
              </h2>
              <p className="text-sm text-cream-300/80 mt-1">
                Verified enterprises and innovative scale-ups actively recruiting qualified talent.
              </p>
            </div>
            <Link
              to="/companies"
              className="text-sm font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 self-start sm:self-auto transition-colors"
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

      {/* =========================================================================
          8. UNIQUE SECTION — CAREER QUOTE (Section 13)
             "Your next opportunity could change everything."
             Below: "Start exploring." with small orange arrow animation.
         ========================================================================= */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-charcoal-800/80 bg-charcoal-950/70 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <blockquote className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            &ldquo;Your next opportunity could change everything.&rdquo;
          </blockquote>

          <div className="pt-2">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-brand-400 hover:text-brand-300 transition-colors group"
            >
              <span>Start exploring</span>
              <ArrowRight className="w-4 h-4 text-brand-500 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
