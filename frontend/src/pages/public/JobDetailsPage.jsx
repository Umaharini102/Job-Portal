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
      <div className="bg-[#FDFBF7] rounded-2xl p-6 sm:p-8 border border-[#E8DFC8]/80 shadow-sm relative overflow-hidden before:absolute before:top-0 before:left-0 before:h-1.5 before:w-28 before:bg-brand-500">
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
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-display">{job.title}</h1>
                <Badge variant={job.status === 'Active' ? 'success' : 'Closed'}>
                  {job.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={companyLink}
                  className="text-base font-bold text-brand-600 hover:text-brand-700 hover:underline"
                >
                  {companyName}
                </Link>

                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Organization</span>
                  </span>
                )}

                {companyCategory && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#F5EFE6] text-charcoal-700 border border-[#E8DFC8]/60">
                    {companyCategory}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-500 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  {job.location} ({job.workMode})
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-charcoal-400" />
                  {job.jobType} • {job.experienceLevel}
                </span>
                <span className="flex items-center gap-1 font-bold text-charcoal-900">
                  <DollarSign className="w-3.5 h-3.5 text-brand-500" />
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-charcoal-400" />
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
              <div className="px-5 py-3 rounded-xl bg-charcoal-100 text-charcoal-500 font-bold text-sm">
                Job Posting Closed
              </div>
            ) : user?.role === 'Recruiter' || user?.role === 'Admin' ? (
              <div className="text-xs font-semibold text-charcoal-600 bg-[#F5EFE6] px-4 py-2.5 rounded-xl border border-[#E8DFC8]/60">
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
                className="flex-1 md:flex-initial px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply Now</span>
              </button>
            )}

            <button
              onClick={handleToggleSave}
              className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-brand-50 border-brand-300 text-brand-600'
                  : 'border-[#E8DFC8] hover:bg-[#F6F0E6] text-charcoal-600'
              }`}
              title={isSaved ? 'Saved' : 'Save Job'}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 fill-brand-500 text-brand-500" /> : <Bookmark className="w-5 h-5" />}
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-xl border border-[#E8DFC8] hover:bg-[#F6F0E6] text-charcoal-600 transition-colors cursor-pointer"
              title="Share job"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-3 rounded-xl border border-[#E8DFC8] hover:bg-coral-50 hover:text-coral-600 text-charcoal-400 transition-colors cursor-pointer"
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
          <div className="bg-[#FDFBF7] rounded-2xl p-6 sm:p-8 border border-[#E8DFC8]/70 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-charcoal-900 border-b border-[#E8DFC8]/60 pb-3 font-display">
              About the Role
            </h2>
            <p className="text-sm text-charcoal-700 leading-relaxed whitespace-pre-line font-normal">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-[#FDFBF7] rounded-2xl p-6 sm:p-8 border border-[#E8DFC8]/70 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-charcoal-900 border-b border-[#E8DFC8]/60 pb-3 font-display">
                Key Responsibilities
              </h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-charcoal-700 leading-relaxed">
                    <Check className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Qualifications */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-[#FDFBF7] rounded-2xl p-6 sm:p-8 border border-[#E8DFC8]/70 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-charcoal-900 border-b border-[#E8DFC8]/60 pb-3 font-display">
                Requirements & Qualifications
              </h2>
              <ul className="space-y-2.5">
                {job.requirements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-charcoal-700 leading-relaxed">
                    <Check className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-[#FDFBF7] rounded-2xl p-6 sm:p-8 border border-[#E8DFC8]/70 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-charcoal-900 border-b border-[#E8DFC8]/60 pb-3 font-display">
                Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-[#F5EFE6] text-charcoal-800 rounded-lg text-xs font-semibold border border-[#E8DFC8]/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits & Perks */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-[#FDFBF7] rounded-2xl p-6 sm:p-8 border border-[#E8DFC8]/70 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-charcoal-900 border-b border-[#E8DFC8]/60 pb-3 font-display">
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F8F4EC] border border-[#E8DFC8]/50 text-xs font-semibold text-charcoal-800">
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
          <div className="bg-[#FDFBF7] rounded-2xl p-6 border border-[#E8DFC8]/70 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-charcoal-900 border-b border-[#E8DFC8]/60 pb-3 font-display">
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
                  className="font-bold text-charcoal-900 text-sm hover:text-brand-600 transition-colors"
                >
                  {companyName}
                </Link>
                <p className="text-xs text-charcoal-500">
                  {job.companyIndustry || job.recruiterProfile?.industry || 'Technology Solutions'}
                </p>
              </div>
            </div>

            {(job.companyId?.description || job.recruiterProfile?.companyDescription) && (
              <p className="text-xs text-charcoal-600 leading-relaxed">
                {job.companyId?.description || job.recruiterProfile?.companyDescription}
              </p>
            )}

            <div className="space-y-2 text-xs text-charcoal-600 pt-2 border-t border-[#E8DFC8]/60">
              {(job.companyId?.headquarters || job.recruiterProfile?.location) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span>{job.companyId?.headquarters || job.recruiterProfile?.location}</span>
                </div>
              )}
              {(job.companyId?.companySize || job.recruiterProfile?.companySize) && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-charcoal-400 flex-shrink-0" />
                  <span>{job.companyId?.companySize || job.recruiterProfile?.companySize} employees</span>
                </div>
              )}
              {(job.companyId?.website || job.recruiterProfile?.website) && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-charcoal-400 flex-shrink-0" />
                  <a
                    href={job.companyId?.website || job.recruiterProfile?.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E8DFC8]/60 space-y-2">
              <Link
                to={companyLink}
                className="w-full py-2.5 bg-[#F5EFE6] hover:bg-brand-50 text-brand-700 text-xs font-bold rounded-xl border border-[#E8DFC8] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Company Profile & All Openings →</span>
              </Link>
            </div>
          </div>

          {/* Trust & Safety notice */}
          <div className="bg-gradient-to-br from-[#FFF9F2] to-[#FAF6ED] p-5 rounded-2xl border border-[#E8DFC8] space-y-2">
            <div className="flex items-center gap-2 text-charcoal-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>Career Simulation Engine Verified</span>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed">
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
