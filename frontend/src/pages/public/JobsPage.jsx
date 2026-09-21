import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import JobCard from '../../components/cards/JobCard';
import Pagination from '../../components/common/Pagination';
import {
  Search,
  MapPin,
  Filter,
  X,
  RotateCcw,
  Briefcase,
  DollarSign,
  Calendar,
  Layers,
  SlidersHorizontal,
  Building2,
} from 'lucide-react';

const INDIAN_LOCATIONS = [
  'All',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Mumbai',
  'Delhi',
  'Noida',
  'Gurugram',
  'Kolkata',
  'Ahmedabad',
  'Coimbatore',
  'Kochi',
  'Jaipur',
  'Visakhapatnam',
  'Vijayawada',
  'Remote - India',
];

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState([]);

  // Filter states initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [company, setCompany] = useState(searchParams.get('company') || searchParams.get('companyId') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'All');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || 'All');
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || 'All');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [datePosted, setDatePosted] = useState(searchParams.get('datePosted') || 'any');
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');

  // Load companies for the dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await API.get('/companies?limit=100');
        if (res.data.success) {
          setAvailableCompanies(res.data.companies);
        }
      } catch (err) {
        console.error('Error fetching companies list:', err);
      }
    };
    fetchCompanies();
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (company && company !== 'All') params.append('company', company);
      if (location && location !== 'All') params.append('location', location);
      if (jobType && jobType !== 'All') params.append('jobType', jobType);
      if (experienceLevel && experienceLevel !== 'All') params.append('experienceLevel', experienceLevel);
      if (workMode && workMode !== 'All') params.append('workMode', workMode);
      if (minSalary) params.append('minSalary', minSalary);
      if (datePosted && datePosted !== 'any') params.append('datePosted', datePosted);
      if (sort) params.append('sort', sort);
      params.append('page', currentPage);
      params.append('limit', '9');

      const res = await API.get(`/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.jobs);
        setTotalJobs(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [search, company, location, jobType, experienceLevel, workMode, minSalary, datePosted, sort, currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCompany('All');
    setLocation('All');
    setJobType('All');
    setExperienceLevel('All');
    setWorkMode('All');
    setMinSalary('');
    setDatePosted('any');
    setSort('latest');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Toggle Save Job
  const handleToggleSave = async (jobId) => {
    if (!user) {
      toast.warning('Please log in as a Job Seeker to save jobs');
      return;
    }
    if (user.role !== 'Job Seeker') {
      toast.info('Only Job Seekers can bookmark jobs');
      return;
    }

    try {
      const targetJob = jobs.find((j) => j._id === jobId);
      if (targetJob?.isSaved) {
        await API.delete(`/saved-jobs/${jobId}`);
        toast.info('Job removed from bookmarks');
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, isSaved: false } : j))
        );
      } else {
        await API.post('/saved-jobs', { jobId });
        toast.success('Job saved to your bookmarks!');
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, isSaved: true } : j))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update saved job');
    }
  };

  const activeFiltersCount = [
    company !== 'All',
    location !== 'All',
    jobType !== 'All',
    experienceLevel !== 'All',
    workMode !== 'All',
    minSalary !== '',
    datePosted !== 'any',
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <form onSubmit={handleApplyFilters} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Job title, skill (e.g. React, Python, Java)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            />
          </div>

          <div className="md:col-span-4 relative">
            <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <select
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              <option value="All">All Companies (Indian & MNCs)</option>
              {availableCompanies.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name} ({c.category === 'Indian Company' ? 'Indian' : 'MNC'})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Jobs</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2.5 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Main Content Layout: Sidebar Filters + Job Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filter Sidebar */}
        <div
          className={`lg:block bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 ${
            mobileFilterOpen
              ? 'fixed inset-4 z-50 overflow-y-auto bg-white shadow-2xl'
              : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-600" />
              <span>Job Filters</span>
            </h3>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-brand-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
              {mobileFilterOpen && (
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Company Filter Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Company
            </label>
            <select
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              <option value="All">All Companies</option>
              {availableCompanies.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Indian Location Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Location in India
            </label>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              {INDIAN_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Indian Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Job Type
            </label>
            <select
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              <option value="All">All Job Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Work Mode
            </label>
            <div className="space-y-1.5">
              {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
                <label
                  key={mode}
                  className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-slate-900"
                >
                  <input
                    type="radio"
                    name="workMode"
                    value={mode}
                    checked={workMode === mode}
                    onChange={(e) => {
                      setWorkMode(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                  />
                  <span>{mode === 'All' ? 'Any Work Mode' : mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => {
                setExperienceLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              <option value="All">All Experience Levels</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Lead / Manager">Lead / Manager</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          {/* Date Posted */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Date Posted
            </label>
            <select
              value={datePosted}
              onChange={(e) => {
                setDatePosted(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              <option value="any">Any Time</option>
              <option value="24h">Past 24 Hours</option>
              <option value="7d">Past Week</option>
              <option value="14d">Past 2 Weeks</option>
              <option value="30d">Past Month</option>
            </select>
          </div>
        </div>

        {/* Right Job Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header Bar with Sort */}
          <div className="flex items-center justify-between bg-white p-3.5 px-5 rounded-2xl border border-slate-200 shadow-sm text-sm">
            <span className="font-bold text-slate-700">
              {totalJobs} {totalJobs === 1 ? 'Job' : 'Jobs'} Found
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:border-brand-500 outline-none font-semibold text-slate-700"
              >
                <option value="latest">Latest Posted</option>
                <option value="oldest">Oldest Posted</option>
                <option value="salary_high">Salary: High to Low</option>
                <option value="salary_low">Salary: Low to High</option>
              </select>
            </div>
          </div>

          {/* Job Cards */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-44 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No matching jobs found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your location or search terms, or resetting your company filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  isSaved={job.isSaved}
                  hasApplied={job.hasApplied}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
