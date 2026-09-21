import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API, { getMediaUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import CompanyLogo from '../../components/common/CompanyLogo';
import ApplyModal from '../../components/modals/ApplyModal';
import ReportModal from '../../components/modals/ReportModal';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Building2,
  Globe,
  Users,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Share2,
  Flag,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Check,
} from 'lucide-react';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/jobs/${id}`);
      if (res.data.success) {
        setJob(res.data.job);
        setIsSaved(res.data.job.isSaved);
        setHasApplied(res.data.job.hasApplied);
        setApplicationStatus(res.data.job.applicationStatus);
      }
    } catch (err) {
      toast.error('Job not found or has been removed');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      toast.warning('Please sign in to save jobs');
      navigate('/login');
      return;
    }
    if (user.role !== 'Job Seeker') {
      toast.info('Only Job Seekers can bookmark jobs');
      return;
    }

    try {
      if (isSaved) {
        await API.delete(`/saved-jobs/${job._id}`);
        setIsSaved(false);
        toast.info('Job removed from saved jobs');
      } else {
        await API.post('/saved-jobs', { jobId: job._id });
        setIsSaved(true);
        toast.success('Job saved to your bookmarks!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update saved job');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Job link copied to clipboard!');
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary Undisclosed';
    if ((min && min >= 100000) || (max && max >= 100000)) {
      const fmtLPA = (n) => `₹${(n / 100000).toFixed(1).replace(/\.0$/, '')} LPA`;
      if (min && max) return `${fmtLPA(min)} - ${fmtLPA(max)}`;
      if (min) return `From ${fmtLPA(min)}`;
      return `Up to ${fmtLPA(max)}`;
    }
    const fmt = (n) => `$${(n / 1000).toFixed(0)}k`;
    if (min && max) return `${fmt(min)} - ${fmt(max)} / yr`;
    if (min) return `From ${fmt(min)} / yr`;
    return `Up to ${fmt(max)} / yr`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <div className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"></div>
        <div className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"></div>
      </div>
    );
  }

  if (!job) return null;

  const companyId = job.companyId?._id || (typeof job.companyId === 'string' ? job.companyId : null);
  const companyName = job.companyId?.name || job.companyName;
  const companyLogo = job.companyId?.logo || job.companyLogo;
  const isVerified = Boolean(job.isVerified || job.companyId?.isVerified);
  const companyCategory = job.companyCategory || job.companyId?.category;
  const companyLink = companyId ? `/company/${companyId}` : `/companies?search=${encodeURIComponent(companyName)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Jobs</span>
      </Link>

      {/* Top Job Hero Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Link to={companyLink} title={`View ${companyName}`}>
              <CompanyLogo
                name={companyName}
                logo={companyLogo}
                size="xl"
                className="shadow-sm"
              />
            </Link>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{job.title}</h1>
                <Badge variant={job.status === 'Active' ? 'success' : 'Closed'}>
                  {job.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={companyLink}
                  className="text-base font-bold text-brand-600 hover:underline"
                >
                  {companyName}
                </Link>

                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Company</span>
                  </span>
                )}

                {companyCategory && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    {companyCategory}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location} ({job.workMode})
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {job.jobType} • {job.experienceLevel}
                </span>
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {hasApplied ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Applied ({applicationStatus || 'Under Review'})</span>
              </div>
            ) : job.status === 'Closed' ? (
              <div className="px-5 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold text-sm">
                Job Posting Closed
              </div>
            ) : user?.role === 'Recruiter' || user?.role === 'Admin' ? (
              <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-4 py-2.5 rounded-xl">
                Logged in as {user.role}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                  } else {
                    setIsApplyModalOpen(true);
                  }
                }}
                className="flex-1 md:flex-initial px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Apply Now</span>
              </button>
            )}

            <button
              onClick={handleToggleSave}
              className={`p-3 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-brand-50 border-brand-200 text-brand-700'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
              title={isSaved ? 'Saved' : 'Save Job'}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 fill-brand-600 text-brand-600" /> : <Bookmark className="w-5 h-5" />}
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Share job"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-3 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors"
              title="Report listing"
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Company Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Job Description & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* About the Role */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              About the Role
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Key Responsibilities
              </h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <Check className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Qualifications */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Requirements & Qualifications
              </h2>
              <ul className="space-y-2.5">
                {job.requirements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <Check className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits & Perks */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Company & Recruiter Profile */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              About the Company
            </h3>

            <div className="flex items-center gap-3">
              <Link to={companyLink}>
                <CompanyLogo
                  name={companyName}
                  logo={companyLogo}
                  size="md"
                />
              </Link>
              <div>
                <Link
                  to={companyLink}
                  className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors"
                >
                  {companyName}
                </Link>
                <p className="text-xs text-slate-500">
                  {job.companyIndustry || job.recruiterProfile?.industry || 'Technology Solutions'}
                </p>
              </div>
            </div>

            {(job.companyId?.description || job.recruiterProfile?.companyDescription) && (
              <p className="text-xs text-slate-600 leading-relaxed">
                {job.companyId?.description || job.recruiterProfile?.companyDescription}
              </p>
            )}

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              {(job.companyId?.headquarters || job.recruiterProfile?.location) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{job.companyId?.headquarters || job.recruiterProfile?.location}</span>
                </div>
              )}
              {(job.companyId?.companySize || job.recruiterProfile?.companySize) && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{job.companyId?.companySize || job.recruiterProfile?.companySize} employees</span>
                </div>
              )}
              {(job.companyId?.website || job.recruiterProfile?.website) && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a
                    href={job.companyId?.website || job.recruiterProfile?.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to={companyLink}
                className="w-full py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl border border-brand-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Company Profile & All Openings →</span>
              </Link>
            </div>
          </div>

          {/* Trust & Safety notice */}
          <div className="bg-gradient-to-br from-brand-50 to-slate-50 p-5 rounded-2xl border border-brand-100 space-y-2">
            <div className="flex items-center gap-2 text-brand-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>JobConnect Verification Guarantee</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This employer has completed identity verification. Never send money or banking details during an application process.
            </p>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        onApplicationSubmitted={() => {
          setHasApplied(true);
          setApplicationStatus('Applied');
        }}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        jobId={job._id}
        jobTitle={job.title}
      />
    </div>
  );
};

export default JobDetailsPage;
