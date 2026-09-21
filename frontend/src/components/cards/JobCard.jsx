import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Bookmark, BookmarkCheck, Calendar, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge';
import CompanyLogo from '../common/CompanyLogo';

const JobCard = ({ job, isSaved = false, onToggleSave, hasApplied = false }) => {
  const companyId = job.companyId?._id || (typeof job.companyId === 'string' ? job.companyId : null);
  const companyName = job.companyId?.name || job.companyName;
  const companyLogo = job.companyId?.logo || job.companyLogo;
  const isVerified = Boolean(job.isVerified || job.companyId?.isVerified);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary Undisclosed';
    // If >= 100,000, format in Lakhs per annum (LPA)
    if ((min && min >= 100000) || (max && max >= 100000)) {
      const fmtLPA = (n) => `₹${(n / 100000).toFixed(1).replace(/\.0$/, '')} LPA`;
      if (min && max) return `${fmtLPA(min)} - ${fmtLPA(max)}`;
      if (min) return `From ${fmtLPA(min)}`;
      return `Up to ${fmtLPA(max)}`;
    }
    const fmt = (n) => `$${(n / 1000).toFixed(0)}k`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const diff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    return `${Math.floor(diff / 7)}w ago`;
  };

  const companyLink = companyId ? `/company/${companyId}` : `/companies?search=${encodeURIComponent(companyName)}`;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top bar: Company Logo, Title, Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <Link to={companyLink} title={`View ${companyName}`}>
              <CompanyLogo
                name={companyName}
                logo={companyLogo}
                size="md"
              />
            </Link>

            <div>
              <Link
                to={`/job/${job._id}`}
                className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 text-base sm:text-lg"
              >
                {job.title}
              </Link>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  to={companyLink}
                  className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors line-clamp-1"
                >
                  {companyName}
                </Link>
                {isVerified && (
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 flex-shrink-0"
                    title="Verified Company"
                  />
                )}
              </div>
            </div>
          </div>

          {onToggleSave && (
            <button
              onClick={() => onToggleSave(job._id)}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                isSaved
                  ? 'text-brand-600 bg-brand-50 hover:bg-brand-100'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 fill-brand-600" /> : <Bookmark className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Metadata pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {job.jobType}
          </span>
          <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
          <Badge variant={job.workMode === 'Remote' ? 'success' : job.workMode === 'Hybrid' ? 'primary' : 'default'} size="xs">
            {job.workMode}
          </Badge>
        </div>

        {/* Snippet Description */}
        <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Chips */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[11px] text-slate-400 font-medium px-1.5 py-0.5">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer / CTA */}
      <div className="border-t border-slate-100 mt-4 pt-3.5 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(job.createdAt)}
        </span>

        <div className="flex items-center gap-2">
          {hasApplied ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Applied
            </span>
          ) : (
            <Link
              to={`/job/${job._id}`}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              View Details →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
