import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import API, { getMediaUrl } from '../../services/api';
import { Building, Upload, Globe, MapPin, Users, Save, Loader2 } from 'lucide-react';

const RecruiterProfilePage = () => {
  const { user, profile: authProfile, updateUserState } = useAuth();
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState([]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    companyId: authProfile?.companyId || '',
    companyName: authProfile?.companyName || '',
    companyDescription: authProfile?.companyDescription || '',
    website: authProfile?.website || '',
    industry: authProfile?.industry || 'IT & Software',
    location: authProfile?.location || '',
    companySize: authProfile?.companySize || '51-200',
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await API.get('/companies?limit=100');
        if (res.data.success && res.data.companies) {
          setAvailableCompanies(res.data.companies);
        }
      } catch (err) {
        console.error('Failed to load companies:', err);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (user && authProfile) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        companyId: authProfile.companyId || '',
        companyName: authProfile.companyName || '',
        companyDescription: authProfile.companyDescription || '',
        website: authProfile.website || '',
        industry: authProfile.industry || 'IT & Software',
        location: authProfile.location || '',
        companySize: authProfile.companySize || '51-200',
      });
    }
  }, [user, authProfile]);

  const handleSelectCompanyFromList = (compId) => {
    const matched = availableCompanies.find((c) => c._id === compId);
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        companyId: matched._id,
        companyName: matched.name,
        companyDescription: matched.description || prev.companyDescription,
        website: matched.website || prev.website,
        industry: matched.industry || prev.industry,
        location: matched.headquarters || prev.location,
        companySize: matched.companySize || prev.companySize,
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/profiles/recruiter', formData);
      if (res.data.success) {
        updateUserState(res.data.user, res.data.profile);
        toast.success('Company profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update company profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('companyLogo', file);

    setUploadingLogo(true);
    try {
      const res = await API.post('/profiles/upload/logo', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        updateUserState(null, res.data.profile);
        toast.success('Company logo updated!');
      }
    } catch (err) {
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Company & Recruiter Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update branding, organizational details, and verified company information
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Logo Upload Section */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
            {authProfile?.companyLogo ? (
              <img
                src={getMediaUrl(authProfile.companyLogo)}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Building className="w-8 h-8 text-brand-600" />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">Company Logo</h3>
            <label className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5">
              {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={uploadingLogo}
              />
            </label>
            <p className="text-[11px] text-slate-400">Recommended 400x400px (PNG or SVG)</p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Recruiter Contact Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Recruiter Contact Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Link to Registered Company (Indian Enterprise / MNC)
              </label>
              <select
                value={formData.companyId || ''}
                onChange={(e) => handleSelectCompanyFromList(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-brand-500 outline-none"
              >
                <option value="">-- Or enter custom company name below --</option>
                {availableCompanies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.category === 'Indian Company' ? 'Indian' : 'MNC'})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                Selecting an existing company automatically fills headquarters, industry, and verification association.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Headquarters Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Bengaluru, India"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                placeholder="e.g. Artificial Intelligence, Cloud Services"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Company Size
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Website URL
              </label>
              <input
                type="text"
                name="website"
                placeholder="https://mycompany.com"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Company Overview / Description
              </label>
              <textarea
                rows="4"
                name="companyDescription"
                placeholder="Describe your company culture, technology stack, and engineering mission..."
                value={formData.companyDescription}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Company Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterProfilePage;
