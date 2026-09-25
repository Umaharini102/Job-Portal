import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, ArrowRight, CheckCircle2, Briefcase, Sparkles } from 'lucide-react';
import CompanyLogo from '../common/CompanyLogo';

const CompanyCard = ({ company, className = '' }) => {
  const jobsCount = company.openJobsCount || 0;
  const locationDisplay =
    company.headquarters ||
    (company.indiaLocations && company.indiaLocations.length > 0
      ? company.indiaLocations.slice(0, 2).join(', ')
      : company.location) ||
    'India';

  const isMNC = company.category === 'MNC / Global Company';

  return (
    <div
      className={`bg-[#FDFBF7] rounded-2xl p-6 border border-[#E8DFC9] hover:border-brand-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${className}`}
    >
      {/* Editorial orange accent line */}
      <div className="absolute top-0 left-0 w-1.5 h-0 bg-brand-500 rounded-r-sm group-hover:h-full transition-all duration-300" />

      {/* Top Section */}
      <div>
        {/* Header row: Logo & Category Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <CompanyLogo
            name={company.name}
            logo={company.logo || company.companyLogo}
            size="lg"
          />

          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
              isMNC
                ? 'bg-lavender-50 text-lavender-700 border-lavender-200'
                : 'bg-brand-50 text-brand-700 border-brand-200'
            }`}
          >
            {company.category || 'Indian Enterprise'}
          </span>
        </div>

        {/* Company Name & Verification */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              to={`/company/${company._id}`}
              className="font-extrabold text-charcoal-950 text-lg group-hover:text-brand-600 transition-colors line-clamp-1 tracking-tight"
            >
              {company.name}
            </Link>
            {company.isVerified && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-coral-50 text-coral-700 border border-coral-200"
                title="Verified Company"
              >
                <CheckCircle2 className="w-3 h-3 text-coral-600" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Industry */}
          <p className="text-xs font-bold text-brand-600 uppercase tracking-wider font-mono">
            {company.industry || 'IT & Software'}
          </p>
        </div>

        {/* Description Snippet */}
        {company.description && (
          <p className="text-xs text-charcoal-600 mt-3 line-clamp-2 leading-relaxed">
            {company.description}
          </p>
        )}

        {/* Meta Info: Location & Company Size */}
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 mt-4 text-xs text-charcoal-500 font-medium">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-coral-500 flex-shrink-0" />
            <span className="line-clamp-1">{locationDisplay}</span>
          </span>

          {company.companySize && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
              <span>{company.companySize}</span>
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row: Dynamic Jobs count & View Company Link */}
      <div className="border-t border-[#E8DFC9]/80 mt-5 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-charcoal-400" />
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
              jobsCount > 0
                ? 'text-brand-800 bg-brand-50 border-brand-200'
                : 'text-charcoal-500 bg-charcoal-100 border-charcoal-200'
            }`}
          >
            {jobsCount} {jobsCount === 1 ? 'Open Role' : 'Open Roles'}
          </span>
        </div>

        <Link
          to={`/company/${company._id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-charcoal-900 group-hover:text-brand-600 transition-colors"
        >
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-brand-500" />
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;

