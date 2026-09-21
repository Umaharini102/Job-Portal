import React, { useState } from 'react';
import { getMediaUrl } from '../../services/api';

// Curated modern gradient palettes for initials badges
const GRADIENT_PALETTES = [
  'from-blue-600 to-indigo-700 text-white',
  'from-indigo-600 to-violet-700 text-white',
  'from-sky-500 to-blue-600 text-white',
  'from-emerald-600 to-teal-700 text-white',
  'from-teal-600 to-cyan-700 text-white',
  'from-purple-600 to-fuchsia-700 text-white',
  'from-rose-600 to-pink-700 text-white',
  'from-amber-600 to-orange-700 text-white',
  'from-slate-700 to-slate-900 text-white',
  'from-cyan-600 to-blue-700 text-white',
];

// Generate consistent initials from company name (e.g. TCS, Infosys -> INF, Microsoft -> MSFT)
export const getCompanyInitials = (name = '') => {
  if (!name) return 'CO';

  // Check common recognized abbreviations in brackets e.g. "Tata Consultancy Services (TCS)"
  const bracketMatch = name.match(/\(([^)]+)\)/);
  if (bracketMatch && bracketMatch[1]) {
    return bracketMatch[1].trim().toUpperCase();
  }

  const clean = name.trim();

  // Known company abbreviations
  const knownShorts = {
    'Tata Consultancy Services': 'TCS',
    'Infosys': 'INF',
    'Wipro': 'WIP',
    'HCLTech': 'HCL',
    'Tech Mahindra': 'TM',
    'LTIMindtree': 'LTIM',
    'Persistent Systems': 'PS',
    'Mphasis': 'MPH',
    'Coforge': 'COF',
    'Zoho': 'ZOHO',
    'Freshworks': 'FW',
    'Tata Technologies': 'TTL',
    'Tata Elxsi': 'TELX',
    'L&T Technology Services': 'LTTS',
    'Cyient': 'CYT',
    'KPIT Technologies': 'KPIT',
    'Mastek': 'MSTK',
    'Hexaware Technologies': 'HEX',
    'Birlasoft': 'BSFT',
    'Nagarro India': 'NAG',
    'Accenture': 'ACN',
    'IBM': 'IBM',
    'Microsoft': 'MSFT',
    'Google': 'GOOG',
    'Amazon': 'AMZN',
    'Oracle': 'ORCL',
    'Adobe': 'ADBE',
    'Deloitte': 'DTT',
    'EY': 'EY',
    'KPMG': 'KPMG',
    'PwC': 'PWC',
    'Capgemini': 'CAP',
    'Cognizant': 'CTSH',
    'SAP': 'SAP',
    'Salesforce': 'CRM',
    'Cisco': 'CSCO',
    'Intel': 'INTC',
    'Dell Technologies': 'DELL',
    'JPMorgan Chase': 'JPMC',
    'Goldman Sachs': 'GS',
    'Morgan Stanley': 'MS',
    'Wells Fargo': 'WFC',
    'Siemens': 'SIEM',
    'Honeywell': 'HON',
    'NVIDIA': 'NVDA',
    'Qualcomm': 'QCOM',
  };

  if (knownShorts[clean]) {
    return knownShorts[clean];
  }

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return clean.slice(0, 3).toUpperCase();
  }
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

// Deterministic color palette selector based on string hash
const getGradientByName = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[idx];
};

const CompanyLogo = ({
  name = '',
  logo = '',
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px] rounded-lg',
    sm: 'w-10 h-10 text-xs rounded-xl',
    md: 'w-12 h-12 text-xs sm:text-sm rounded-xl',
    lg: 'w-14 h-14 text-sm sm:text-base rounded-2xl',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-base sm:text-xl rounded-2xl',
    '2xl': 'w-20 h-20 sm:w-24 sm:h-24 text-xl sm:text-2xl rounded-3xl',
  };

  const initials = getCompanyInitials(name);
  const gradient = getGradientByName(name);
  const containerClass = sizeClasses[size] || sizeClasses.md;

  if (logo && !imgError) {
    return (
      <div
        className={`${containerClass} bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm ${className}`}
      >
        <img
          src={getMediaUrl(logo)}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${containerClass} bg-gradient-to-br ${gradient} font-extrabold tracking-wider flex items-center justify-center flex-shrink-0 shadow-sm border border-black/10 select-none ${className}`}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
};

export default CompanyLogo;
