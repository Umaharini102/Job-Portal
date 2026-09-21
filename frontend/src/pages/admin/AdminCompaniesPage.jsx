import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import CompanyLogo from '../../components/common/CompanyLogo';
import {
  Building2,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Briefcase,
  ExternalLink,
  MapPin,
  Globe,
  Loader2,
  Filter,
  X,
  Eye,
  Calendar,
  Users,
  ShieldCheck,
} from 'lucide-react';

const CATEGORIES = ['All', 'Indian Company', 'MNC / Global Company'];
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
  'Product Technology',
  'Other',
];

const INITIAL_FORM = {
  name: '',
  category: 'Indian Company',
  industry: 'IT & Software',
  headquarters: '',
  indiaLocations: '',
  website: '',
  companySize: '10,000+',
  foundedYear: '',
  logo: '',
  description: '',
  isVerified: false,
};

const AdminCompaniesPage = () => {
  const toast = useToast();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [verifiedFilter, setVerifiedFilter] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteConfirmCompany, setDeleteConfirmCompany] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // View Jobs Drawer/Modal
  const [selectedCompanyJobs, setSelectedCompanyJobs] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/companies');
      if (res.data.success) {
        setCompanies(res.data.companies || []);
      }
    } catch (err) {
      toast.error('Failed to load companies directory');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Derived metrics
  const totalCount = companies.length;
  const indianCount = companies.filter((c) => c.category === 'Indian Company').length;
  const mncCount = companies.filter((c) => c.category === 'MNC / Global Company').length;
  const verifiedCount = companies.filter((c) => c.isVerified).length;

  // Filtered companies
  const filteredCompanies = companies.filter((c) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.headquarters?.toLowerCase().includes(q) ||
      c.industry?.toLowerCase().includes(q);

    const matchesCategory =
      categoryFilter === 'All' || c.category === categoryFilter;

    const matchesIndustry =
      industryFilter === 'All' || c.industry === industryFilter;

    const matchesVerified =
      verifiedFilter === 'All' ||
      (verifiedFilter === 'Verified' && c.isVerified) ||
      (verifiedFilter === 'Unverified' && !c.isVerified);

    return matchesSearch && matchesCategory && matchesIndustry && matchesVerified;
  });

  // Toggle Verification Handler
  const handleToggleVerify = async (company) => {
    try {
      const res = await API.put(`/companies/${company._id}/verify`);
      if (res.data.success) {
        toast.success(
          `${company.name} is now marked as ${res.data.company.isVerified ? 'Verified ✓' : 'Unverified'}`
        );
        // Update local state
        setCompanies((prev) =>
          prev.map((item) =>
            item._id === company._id
              ? { ...item, isVerified: res.data.company.isVerified }
              : item
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle verification');
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (c) => {
    setModalMode('edit');
    setEditingId(c._id);
    setFormData({
      name: c.name || '',
      category: c.category || 'Indian Company',
      industry: c.industry || 'IT & Software',
      headquarters: c.headquarters || '',
      indiaLocations: Array.isArray(c.indiaLocations)
        ? c.indiaLocations.join(', ')
        : c.indiaLocations || '',
      website: c.website || '',
      companySize: c.companySize || '10,000+',
      foundedYear: c.foundedYear ? String(c.foundedYear) : '',
      logo: c.logo || '',
      description: c.description || '',
      isVerified: Boolean(c.isVerified),
    });
    setIsModalOpen(true);
  };

  // Submit Create / Edit
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.headquarters.trim()) {
      toast.error('Company Name and Headquarters are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        industry: formData.industry,
        headquarters: formData.headquarters.trim(),
        indiaLocations: formData.indiaLocations
          ? formData.indiaLocations.split(',').map((l) => l.trim()).filter(Boolean)
          : [],
        website: formData.website.trim(),
        companySize: formData.companySize,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear, 10) : undefined,
        logo: formData.logo.trim(),
        description: formData.description.trim(),
        isVerified: formData.isVerified,
      };

      if (modalMode === 'create') {
        const res = await API.post('/companies', payload);
        if (res.data.success) {
          toast.success(`Company "${payload.name}" added successfully`);
          setIsModalOpen(false);
          fetchCompanies();
        }
      } else {
        const res = await API.put(`/companies/${editingId}`, payload);
        if (res.data.success) {
          toast.success(`Company "${payload.name}" updated successfully`);
          setIsModalOpen(false);
          fetchCompanies();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving company');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Company Handler
  const handleDeleteCompany = async () => {
    if (!deleteConfirmCompany) return;
    setDeleting(true);
    try {
      const res = await API.delete(`/companies/${deleteConfirmCompany._id}`);
      if (res.data.success) {
        toast.success(`Company "${deleteConfirmCompany.name}" deleted successfully`);
        setCompanies((prev) => prev.filter((c) => c._id !== deleteConfirmCompany._id));
        setDeleteConfirmCompany(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete company');
    } finally {
      setDeleting(false);
    }
  };

  // View Associated Jobs Handler
  const handleViewJobs = async (company) => {
    setSelectedCompanyJobs({ company, jobs: [] });
    setLoadingJobs(true);
    try {
      const res = await API.get(`/companies/${company._id}/jobs`);
      if (res.data.success) {
        setSelectedCompanyJobs({ company, jobs: res.data.jobs || [] });
      }
    } catch (err) {
      toast.error('Failed to load jobs for this company');
    } finally {
      setLoadingJobs(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Company Management
            </h1>
            <span className="px-2.5 py-0.5 bg-brand-100 text-brand-800 text-xs font-bold rounded-full">
              Admin Console
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage Indian enterprises and multinational corporations (MNCs) operating in India
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Companies</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Indian Companies</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{indianCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            🇮🇳
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">MNCs / Global</p>
            <p className="text-2xl font-black text-purple-600 mt-0.5">{mncCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            🌐
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Verified Badges</p>
            <p className="text-2xl font-black text-indigo-600 mt-0.5">{verifiedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search company or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none text-slate-700"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Industry Filter */}
          <div>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none text-slate-700"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === 'All' ? 'All Industries' : ind}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Status Filter */}
          <div>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none text-slate-700"
            >
              <option value="All">All Verification States</option>
              <option value="Verified">✓ Verified Only</option>
              <option value="Unverified">Unverified Only</option>
            </select>
          </div>
        </div>

        {/* Results summary & clear */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-900">{filteredCompanies.length}</strong> of{' '}
            {totalCount} companies
          </span>
          {(search || categoryFilter !== 'All' || industryFilter !== 'All' || verifiedFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setIndustryFilter('All');
                setVerifiedFilter('All');
              }}
              className="text-brand-600 hover:text-brand-700 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Companies List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"></div>
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          <Building2 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <p className="text-base font-semibold text-slate-700">No companies found</p>
          <p className="text-xs text-slate-400 mt-1">Try modifying your search or filter options</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Card Top */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CompanyLogo logo={c.logo} name={c.name} size="md" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                          {c.name}
                        </h3>
                        {c.isVerified && (
                          <span
                            title="Verified Company"
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800"
                          >
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-brand-600 mt-0.5">{c.industry}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex-shrink-0 ${
                      c.category === 'Indian Company'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {c.category === 'Indian Company' ? 'Indian' : 'MNC'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{c.headquarters}</span>
                  </div>

                  {Array.isArray(c.indiaLocations) && c.indiaLocations.length > 0 && (
                    <div className="flex items-start gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 flex-shrink-0">Hubs:</span>
                      <span className="text-[11px] text-slate-600 truncate">
                        {c.indiaLocations.slice(0, 3).join(', ')}
                        {c.indiaLocations.length > 3 ? ` +${c.indiaLocations.length - 3}` : ''}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                    <span>Size: {c.companySize || 'Enterprise'}</span>
                    {c.foundedYear && <span>Est. {c.foundedYear}</span>}
                  </div>
                </div>

                {/* Jobs count badge */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleViewJobs(c)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{c.jobsCount || 0} Openings Listed</span>
                  </button>

                  <Link
                    to={`/company/${c._id}`}
                    target="_blank"
                    className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-0.5 font-medium"
                    title="View public profile"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                {/* 1-Click Verification Toggle */}
                <button
                  onClick={() => handleToggleVerify(c)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                    c.isVerified
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-200 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                  }`}
                  title={c.isVerified ? 'Click to unverify' : 'Click to verify'}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{c.isVerified ? 'Verified' : 'Verify'}</span>
                </button>

                {/* Edit & Delete */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
                    title="Edit Company"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmCompany(c)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                    title="Delete Company"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {modalMode === 'create' ? 'Add New Company' : `Edit ${formData.name}`}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Infosys, Microsoft"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  >
                    <option value="Indian Company">Indian Company</option>
                    <option value="MNC / Global Company">MNC / Global Company</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  >
                    {INDUSTRIES.filter((i) => i !== 'All').map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Headquarters <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.headquarters}
                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    placeholder="e.g. Bengaluru, India or Redmond, WA, USA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  India Operating Locations (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.indiaLocations}
                  onChange={(e) => setFormData({ ...formData, indiaLocations: e.target.value })}
                  placeholder="e.g. Bengaluru, Hyderabad, Pune, Chennai, Mumbai, Noida"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Size</label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  >
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1,000</option>
                    <option value="1000-5000">1,000-5,000</option>
                    <option value="5000-10000">5,000-10,000</option>
                    <option value="10,000+">10,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Founded Year</label>
                  <input
                    type="number"
                    min="1800"
                    max="2030"
                    value={formData.foundedYear}
                    onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                    placeholder="e.g. 1981"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Logo URL (Optional)</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="Leave empty to use automatic company initials badge"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">About / Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of company focus, services, and presence..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                ></textarea>
              </div>

              {/* Verification status checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isVerifiedCheckbox"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                />
                <label htmlFor="isVerifiedCheckbox" className="font-bold text-slate-700 cursor-pointer">
                  Mark as Verified Company (✓ Verified badge visible to all users)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{modalMode === 'create' ? 'Create Company' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">Delete Company?</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Are you sure you want to remove <strong>{deleteConfirmCompany.name}</strong> from the
                platform directory? Associated jobs will retain their records.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmCompany(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold text-xs sm:text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCompany}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Associated Jobs Modal / Drawer */}
      {selectedCompanyJobs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CompanyLogo
                  logo={selectedCompanyJobs.company.logo}
                  name={selectedCompanyJobs.company.name}
                  size="md"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Jobs at {selectedCompanyJobs.company.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live postings linked to this company profile in MongoDB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompanyJobs(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Jobs List Body */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {loadingJobs ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                  <p className="text-xs">Fetching active jobs...</p>
                </div>
              ) : selectedCompanyJobs.jobs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Briefcase className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">No active job postings</p>
                  <p className="text-xs">Platform recruiters haven't published jobs for this company yet.</p>
                </div>
              ) : (
                selectedCompanyJobs.jobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-brand-200 bg-slate-50 hover:bg-white transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span>{job.jobType}</span>
                          <span>•</span>
                          <span>{job.workMode}</span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          job.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500">
                        {job.salary?.min && job.salary?.max
                          ? `₹${job.salary.min} - ₹${job.salary.max} LPA`
                          : 'Salary Undisclosed'}
                      </span>
                      <Link
                        to={`/jobs/${job._id}`}
                        target="_blank"
                        className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Total: <strong>{selectedCompanyJobs.jobs.length}</strong> jobs
              </span>
              <button
                onClick={() => setSelectedCompanyJobs(null)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 font-bold rounded-xl text-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompaniesPage;
