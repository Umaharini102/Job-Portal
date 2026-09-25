import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import CompanyLogo from '../../components/common/CompanyLogo';
import JobCard from '../../components/cards/JobCard';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Calendar,
  CheckCircle2,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  Info,
} from 'lucide-react';

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  const fetchCompanyData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(`/companies/${id}`);
      if (res.data.success) {
        setCompany(res.data.company);
      }
    } catch (err) {
      toast.error('Company not found or invalid ID');
      navigate('/companies');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  const fetchCompanyJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const res = await API.get(`/companies/${id}/jobs`);
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Error fetching jobs for company:', err);
    } finally {
      setJobsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCompanyData();
    fetchCompanyJobs();
  }, [fetchCompanyData, fetchCompanyJobs]);

  const handleToggleSave = async (jobId) => {
    if (!user) {
      toast.warning('Please sign in to bookmark jobs');
      navigate('/login');
      return;
    }
    if (user.role !== 'Job Seeker') {
      toast.info('Only Job Seekers can save jobs');
      return;
    }

    try {
      const jobItem = jobs.find((j) => j._id === jobId);
      if (jobItem?.isSaved) {
        await API.delete(`/saved-jobs/${jobId}`);
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, isSaved: false } : j))
        );
        toast.info('Job removed from bookmarks');
      } else {
        await API.post('/saved-jobs', { jobId });
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, isSaved: true } : j))
        );
        toast.success('Job saved to bookmarks!');
      }
    } catch (err) {
      toast.error('Failed to update saved job');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse p-8" />
        <div className="h-96 bg-white rounded-3xl border border-slate-200 animate-pulse p-8" />
      </div>
    );
  }

  if (!company) return null;

  const isMNC = company.category === 'MNC / Global Company';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to directory */}
      <Link
        to="/companies"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Companies Directory</span>
      </Link>

      {/* Hero Header Card */}
      <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-10 border border-[#E8DFC8]/80 shadow-sm relative overflow-hidden before:absolute before:top-0 before:left-0 before:h-1.5 before:w-28 before:bg-brand-500">
        {/* Subtle decorative background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-500/10 via-lavender-500/5 to-transparent rounded-full pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <CompanyLogo
              name={company.name}
              logo={company.logo}
              size="2xl"
              className="shadow-md"
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900 tracking-tight font-display">
                  {company.name}
                </h1>

                {company.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>✓ Verified Organization</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5EFE6] text-charcoal-600 border border-[#E8DFC8]">
                    <span>Reference Directory</span>
                  </span>
                )}
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span
                  className={`font-bold px-3 py-1 rounded-lg border ${
                    isMNC
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {company.category || 'Indian Company'}
                </span>

                <span className="font-semibold bg-[#F5EFE6] text-charcoal-700 px-3 py-1 rounded-lg border border-[#E8DFC8]">
                  {company.industry || 'IT & Software'}
                </span>

                {company.foundedYear && (
                  <span className="flex items-center gap-1 text-charcoal-600 bg-white px-2.5 py-1 rounded-lg border border-[#E8DFC8]">
                    <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                    Founded {company.foundedYear}
                  </span>
                )}

                {company.companySize && (
                  <span className="flex items-center gap-1 text-charcoal-600 bg-white px-2.5 py-1 rounded-lg border border-[#E8DFC8]">
                    <Users className="w-3.5 h-3.5 text-charcoal-400" />
                    {company.companySize} employees
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto self-stretch md:self-auto justify-end">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-white border border-[#E8DFC8] hover:border-brand-500 hover:text-brand-600 text-charcoal-700 font-bold text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-brand-500" />
                <span>Visit Website</span>
                <ExternalLink className="w-3 h-3 text-charcoal-400" />
              </a>
            )}

            <a
              href="#jobs-section"
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>
                View Jobs ({company.openJobsCount || jobs.length || 0})
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left Details & Right Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: About & India Locations */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-[#E8DFC8]/80 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-charcoal-900 border-b border-[#E8DFC8]/60 pb-3 flex items-center gap-2 font-display">
              <Building2 className="w-5 h-5 text-brand-500" />
              <span>About {company.name}</span>
            </h2>

            <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-normal">
              {company.description ||
                `${company.name} is a premier organization in ${company.industry} operating extensively across India.`}
            </p>
          </div>

          {/* India Locations Section */}
          <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-[#E8DFC8]/80 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-charcoal-900 border-b border-[#E8DFC8]/60 pb-3 flex items-center gap-2 font-display">
              <MapPin className="w-5 h-5 text-brand-500" />
              <span>Key Operating & Recruitment Locations in India</span>
            </h2>

            {company.indiaLocations && company.indiaLocations.length > 0 ? (
              <div className="flex flex-wrap gap-2.5 pt-1">
                {company.indiaLocations.map((loc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F5EFE6] border border-[#E8DFC8] text-xs font-semibold text-charcoal-800 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    <span>{loc}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-500">
                Operating location: {company.headquarters || 'Pan-India'}
              </p>
            )}
          </div>

          {/* Jobs at this Company Section */}
          <div id="jobs-section" className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-charcoal-900 flex items-center gap-2 font-display">
                  <Briefcase className="w-6 h-6 text-brand-500" />
                  <span>Jobs at {company.name}</span>
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5">
                  Real job postings independently submitted by platform recruiters representing or hiring for {company.name}.
                </p>
              </div>

              <span className="px-3.5 py-1.5 bg-brand-50 text-brand-700 font-bold text-xs rounded-xl border border-brand-200">
                {jobs.length} Active {jobs.length === 1 ? 'Opening' : 'Openings'}
              </span>
            </div>

            {jobsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="h-48 bg-[#FDFBF7] rounded-2xl border border-[#E8DFC8] animate-pulse p-6"
                  />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-[#FDFBF7] rounded-3xl p-10 text-center border border-[#E8DFC8]/80 shadow-sm space-y-3">
                <Briefcase className="w-12 h-12 text-charcoal-300 mx-auto" />
                <h3 className="font-extrabold text-charcoal-900 text-base font-display">
                  No active job postings currently listed for {company.name}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-500 max-w-md mx-auto">
                  Only jobs independently posted by registered recruiters appear here. New openings are posted regularly.
                </p>
                <div className="pt-3">
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5EFE6] hover:bg-brand-50 hover:text-brand-700 text-charcoal-700 font-bold text-xs rounded-xl border border-[#E8DFC8] transition-colors"
                  >
                    <span>Browse All Platform Jobs</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          </div>
        </div>

        {/* Right Column: Company Quick Facts & Trust Note */}
        <div className="space-y-6">
          <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-7 border border-[#E8DFC8]/80 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-charcoal-900 border-b border-[#E8DFC8]/60 pb-3 font-display">
              Company Overview
            </h3>

            <div className="space-y-3.5 text-xs text-charcoal-700">
              <div className="flex items-start justify-between gap-2">
                <span className="text-charcoal-400 font-medium">Headquarters</span>
                <span className="font-bold text-charcoal-900 text-right">
                  {company.headquarters || 'Undisclosed'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-charcoal-400 font-medium">Category</span>
                <span className="font-bold text-charcoal-900">
                  {company.category}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-charcoal-400 font-medium">Industry</span>
                <span className="font-bold text-brand-600">
                  {company.industry}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-charcoal-400 font-medium">Company Size</span>
                <span className="font-bold text-charcoal-900">
                  {company.companySize || '10,000+'}
                </span>
              </div>

              {company.foundedYear && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-charcoal-400 font-medium">Founded</span>
                  <span className="font-bold text-charcoal-900">
                    {company.foundedYear}
                  </span>
                </div>
              )}

              {company.website && (
                <div className="flex items-start justify-between gap-2 pt-2 border-t border-[#E8DFC8]/60">
                  <span className="text-charcoal-400 font-medium">Website</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Directory Disclaimer Notice */}
          <div className="bg-gradient-to-br from-[#FFF9F2] to-[#FAF6ED] border border-[#E8DFC8] rounded-3xl p-5 space-y-2.5 text-xs text-charcoal-600 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-charcoal-900">
              <Info className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span>Platform Reference Notice</span>
            </div>
            <p>
              This company record is provided as reference information for Indian and global employment discovery. Job listings are created independently by recruiters registered on Career Simulation Engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
