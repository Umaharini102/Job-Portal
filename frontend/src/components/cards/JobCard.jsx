import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Badge from '../common/Badge';
import CompanyLogo from '../common/CompanyLogo';

const JobCard = ({
  job,
  isSaved = false,
  onToggleSave,
  hasApplied = false,
  bgVariant = 'cream', // 'cream' | 'beige' | 'lavender'
  className = '',
}) => {
  const companyId = job.companyId?._id || (typeof job.companyId === 'string' ? job.companyId : null);
  const companyName = job.companyId?.name || job.companyName;
  const companyLogo = job.companyId?.logo || job.companyLogo;
  const isVerified = Boolean(job.isVerified || job.companyId?.isVerified);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary Undisclosed';
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

  // Alternating warm editorial card backgrounds: Cream, Warm Beige, Very Light Lavender (NO BLUE)
  const variantStyles = {
    cream: 'bg-[#FDFBF7] hover:bg-[#FFFDF9] border-[#E8DFC9]',
    beige: 'bg-[#F6F0E6] hover:bg-[#F9F4EB] border-[#DFD3BE]',
    lavender: 'bg-[#F9F7FD] hover:bg-[#FCFAFF] border-[#E5DCF5]',
  };

  const cardBg = variantStyles[bgVariant] || variantStyles.cream;

  return (
    <div
      className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 flex flex-col justify-between group relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-brand-400 ${cardBg} ${className}`}
    >
      {/* Editorial orange accent indicator bar */}
      <div className="absolute top-0 left-0 w-1.5 h-0 bg-brand-500 rounded-r-sm group-hover:h-full transition-all duration-300" />

      <div>
        {/* Top bar: Company Logo, Title, Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <Link to={companyLink} title={`View ${companyName}`} className="flex-shrink-0">
              <CompanyLogo name={companyName} logo={companyLogo} size="md" />
            </Link>

            <div className="space-y-0.5">
              <Link
                to={`/job/${job._id}`}
                className="font-extrabold text-charcoal-950 group-hover:text-brand-600 transition-colors line-clamp-1 text-base sm:text-lg tracking-tight"
              >
                {job.title}
              </Link>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  to={companyLink}
                  className="text-xs sm:text-sm font-semibold text-charcoal-700 hover:text-brand-600 transition-colors line-clamp-1"
                >
                  {companyName}
                </Link>
                {isVerified && (
                  <span
                    className="inline-flex items-center text-[10px] font-bold text-coral-600 bg-coral-50 border border-coral-200 px-1.5 py-0.2 rounded-md"
                    title="Verified Company"
                  >
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {onToggleSave ? (
            <button
              onClick={() => onToggleSave(job._id)}
              className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                isSaved
                  ? 'text-brand-600 bg-brand-100 hover:bg-brand-200'
                  : 'text-charcoal-400 hover:text-brand-600 hover:bg-white/80'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 fill-brand-600 text-brand-600" /> : <Bookmark className="w-5 h-5" />}
            </button>
          ) : (
            <span className="p-2 text-charcoal-300 opacity-60">
              <Sparkles className="w-4 h-4 text-brand-400" />
            </span>
          )}
        </div>

        {/* Highlighted Salary & Work Mode Row */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-charcoal-900 text-white font-mono text-xs font-bold shadow-sm">
            <DollarSign className="w-3.5 h-3.5 text-brand-400" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 border border-charcoal-200 text-charcoal-700 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5 text-brand-500" />
            {job.jobType || 'Full Time'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 border border-charcoal-200 text-charcoal-700 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-coral-500" />
            {job.location}
          </span>
        </div>

        {/* Snippet Description */}
        <p className="text-xs sm:text-sm text-charcoal-700/80 mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Chips */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-bold px-2.5 py-1 bg-white/90 border border-charcoal-200/90 text-charcoal-800 rounded-lg shadow-2xs"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[11px] text-charcoal-500 font-semibold px-2 py-1">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer / CTA Row */}
      <div className="border-t border-charcoal-200/60 mt-5 pt-4 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11px] text-charcoal-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
          {formatDate(job.createdAt)}
        </span>

        <div className="flex items-center gap-2">
          {hasApplied ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-coral-700 bg-coral-50 px-3 py-1.5 rounded-xl border border-coral-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-coral-600" />
              Applied
            </span>
          ) : (
            <Link
              to={`/job/${job._id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-charcoal-900 text-white rounded-xl hover:bg-brand-600 shadow-sm transition-all duration-200 group-hover:bg-brand-600"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;

