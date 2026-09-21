import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, ArrowRight, CheckCircle2, Briefcase } from 'lucide-react';
import CompanyLogo from '../common/CompanyLogo';

const CompanyCard = ({ company }) => {
  const jobsCount = company.openJobsCount || 0;
  const locationDisplay =
    company.headquarters ||
    (company.indiaLocations && company.indiaLocations.length > 0
      ? company.indiaLocations.slice(0, 2).join(', ')
      : company.location) ||
    'India';

  const isMNC = company.category === 'MNC / Global Company';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-brand-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
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
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {company.category || 'Indian Company'}
          </span>
        </div>

        {/* Company Name & Verification */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              to={`/company/${company._id}`}
              className="font-extrabold text-slate-900 text-lg group-hover:text-brand-600 transition-colors line-clamp-1"
            >
              {company.name}
            </Link>
            {company.isVerified && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800"
                title="Verified Company"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Industry */}
          <p className="text-xs font-semibold text-brand-600">
            {company.industry || 'IT & Software'}
          </p>
        </div>

        {/* Description Snippet */}
        {company.description && (
          <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
            {company.description}
          </p>
        )}

        {/* Meta Info: Location & Company Size */}
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 mt-3.5 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="line-clamp-1">{locationDisplay}</span>
          </span>

          {company.companySize && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{company.companySize}</span>
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row: Dynamic Jobs count & View Company Link */}
      <div className="border-t border-slate-100 mt-5 pt-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span
            className={`text-xs font-bold ${
              jobsCount > 0 ? 'text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md' : 'text-slate-500'
            }`}
          >
            {jobsCount} {jobsCount === 1 ? 'Job' : 'Jobs'}
          </span>
        </div>

        <Link
          to={`/company/${company._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
        >
          <span>View Company</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
