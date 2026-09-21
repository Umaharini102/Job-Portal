import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import CompanyCard from '../../components/cards/CompanyCard';
import Pagination from '../../components/common/Pagination';
import {
  Search,
  Building2,
  Filter,
  X,
  RotateCcw,
  MapPin,
  Briefcase,
  Globe2,
  Sparkles,
  SlidersHorizontal,
  Info,
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

const INDUSTRIES = [
  'All',
  'IT & Software',
  'Consulting',
  'Banking & Finance',
  'E-commerce',
  'Telecommunications',
  'Automotive',
  'Healthcare',
  'Manufacturing',
  'Product Companies',
  'Other',
];

const COMPANY_SIZES = [
  'All',
  '1-50',
  '51-200',
  '201-500',
  '501-1000',
  '1,000-5,000',
  '5,000-10,000',
  '10,000+',
];

const CompaniesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [companies, setCompanies] = useState([]);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [industry, setIndustry] = useState(searchParams.get('industry') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [companySize, setCompanySize] = useState(searchParams.get('companySize') || 'All');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true');

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (category && category !== 'All') params.append('category', category);
      if (industry && industry !== 'All') params.append('industry', industry);
      if (location && location !== 'All') params.append('location', location);
      if (companySize && companySize !== 'All') params.append('companySize', companySize);
      if (verifiedOnly) params.append('isVerified', 'true');
      params.append('page', currentPage);
      params.append('limit', '12');

      const res = await API.get(`/companies?${params.toString()}`);
      if (res.data.success) {
        setCompanies(res.data.companies);
        setTotalCompanies(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error loading companies directory:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, industry, location, companySize, verifiedOnly, currentPage]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    fetchCompanies();
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setIndustry('All');
    setLocation('All');
    setCompanySize('All');
    setVerifiedOnly(false);
    setCurrentPage(1);
    setSearchParams({});
  };

  const activeFiltersCount = [
    category !== 'All',
    industry !== 'All',
    location !== 'All',
    companySize !== 'All',
    verifiedOnly,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
          <Globe2 className="w-3.5 h-3.5 text-brand-600" />
          <span>India Tech & Corporate Enterprise Directory</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Explore Indian Companies & Global MNCs
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Discover established Indian technology leaders, consulting giants, and multinational enterprises operating and recruiting in India.
        </p>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by company name (e.g. TCS, Infosys, Microsoft, Google)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-28 py-3.5 text-sm bg-white border border-slate-200 rounded-2xl shadow-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Segmented Tabs */}
        <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
          {[
            { label: 'All Companies', value: 'All' },
            { label: 'Indian Companies', value: 'Indian Company' },
            { label: 'MNCs / Global Companies', value: 'MNC / Global Company' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleCategoryChange(tab.value)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                category === tab.value
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar & Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Dropdown Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            {/* Industry Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-medium"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Indian Location Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                India Location
              </label>
              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-medium"
              >
                {INDIAN_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Company Size
              </label>
              <select
                value={companySize}
                onChange={(e) => {
                  setCompanySize(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-medium"
              >
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Verification status toggle */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Verification
              </label>
              <label className="flex items-center gap-2 h-[38px] px-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => {
                    setVerifiedOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="text-xs font-medium text-slate-700">Verified Only</span>
              </label>
            </div>
          </div>

          {/* Reset Filters button */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all self-end md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ({activeFiltersCount})</span>
            </button>
          )}
        </div>

        {/* Results Counter Bar */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
          <p>
            Showing <span className="font-bold text-slate-800">{companies.length}</span> of{' '}
            <span className="font-bold text-slate-800">{totalCompanies}</span> companies
          </p>

          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Dynamic open job counts refreshed in real-time</span>
          </div>
        </div>
      </div>

      {/* Directory Disclaimer Banner */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-800">Demo & Reference Directory:</strong> Company information is provided for employment discovery in India. Official openings on this platform are posted independently by registered recruiters.
        </p>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-56 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"
            />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/90 shadow-sm max-w-lg mx-auto space-y-4">
          <Building2 className="w-14 h-14 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-900 text-lg">No companies matched your criteria</h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Try adjusting your search query, clearing filters, or switching company categories.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-700 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company._id} company={company} />
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
  );
};

export default CompaniesPage;
