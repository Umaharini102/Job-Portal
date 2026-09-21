import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import {
  Briefcase,
  Building,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Loader2,
  Globe,
  FileText,
  CheckCircle2,
} from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('Job Seeker');
  const [companyOption, setCompanyOption] = useState('existing'); // 'existing' | 'new'
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    companyName: '',
    companyCategory: 'Indian Company',
    industry: 'IT & Software',
    companyEmail: '',
    companyLocation: '',
    companyWebsite: '',
    companyDescription: '',
    companySize: '51-200',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch companies list for recruiter association
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await API.get('/companies?limit=100');
        if (res.data.success && res.data.companies) {
          setAvailableCompanies(res.data.companies);
          if (res.data.companies.length > 0) {
            setSelectedCompanyId(res.data.companies[0]._id);
            setFormData((prev) => ({
              ...prev,
              companyName: res.data.companies[0].name,
              companyLocation: res.data.companies[0].headquarters || '',
              companyWebsite: res.data.companies[0].website || '',
              industry: res.data.companies[0].industry || 'IT & Software',
              companyCategory: res.data.companies[0].category || 'Indian Company',
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching companies list:', err);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectExistingCompany = (comp) => {
    setSelectedCompanyId(comp._id);
    setFormData({
      ...formData,
      companyName: comp.name,
      companyCategory: comp.category || 'Indian Company',
      industry: comp.industry || 'IT & Software',
      companyLocation: comp.headquarters || '',
      companyWebsite: comp.website || '',
      companyDescription: comp.description || '',
      companySize: comp.companySize || '51-200',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (role === 'Recruiter') {
      if (companyOption === 'existing' && !selectedCompanyId) {
        setErrorMessage('Please select a company from the list');
        return;
      }
      if (companyOption === 'new' && !formData.companyName.trim()) {
        setErrorMessage('Company Name is required for registration');
        return;
      }
    }

    setLoading(true);
    const payload = {
      ...formData,
      role: role === 'Recruiter' ? 'Recruiter' : 'Job Seeker',
      companyId: role === 'Recruiter' && companyOption === 'existing' ? selectedCompanyId : null,
    };

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      if (role === 'Recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/home');
      }
    } else {
      setErrorMessage(result.message);
    }
  };

  const selectedCompObj = availableCompanies.find((c) => c._id === selectedCompanyId);

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Job<span className="text-brand-600">Connect</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Join the professional career & employer network
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Account Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                  role === 'Job Seeker'
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="accountType"
                  value="Job Seeker"
                  checked={role === 'Job Seeker'}
                  onChange={() => setRole('Job Seeker')}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <p className="text-sm font-bold">User / Job Seeker</p>
                  <p className="text-xs text-slate-500 mt-0.5">Discover jobs & apply</p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                  role === 'Recruiter'
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="accountType"
                  value="Recruiter"
                  checked={role === 'Recruiter'}
                  onChange={() => setRole('Recruiter')}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <p className="text-sm font-bold">Recruiter</p>
                  <p className="text-xs text-slate-500 mt-0.5">Post jobs & hire talent</p>
                </div>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {role === 'Recruiter' ? 'Recruiter Full Name' : 'Full Name'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* If Job Seeker: Location */}
            {role === 'Job Seeker' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your City / Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Bengaluru, Hyderabad, Pune, Mumbai"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* If Recruiter: Company Association Section */}
            {role === 'Recruiter' && (
              <div className="pt-2 border-t border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Company Association <span className="text-rose-500">*</span>
                  </label>

                  {/* Option selector: Existing Company vs New Company */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCompanyOption('existing')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        companyOption === 'existing'
                          ? 'bg-white text-brand-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Select Existing Company
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompanyOption('new')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        companyOption === 'new'
                          ? 'bg-white text-brand-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Create New Company
                    </button>
                  </div>
                </div>

                {/* Option 1: Select Existing Company */}
                {companyOption === 'existing' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Choose Company from Platform Directory
                      </label>
                      <select
                        value={selectedCompanyId}
                        onChange={(e) => {
                          const found = availableCompanies.find((c) => c._id === e.target.value);
                          if (found) handleSelectExistingCompany(found);
                        }}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                      >
                        {availableCompanies.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name} ({c.category === 'Indian Company' ? 'Indian' : 'MNC'} • {c.industry})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preview of Selected Company */}
                    {selectedCompObj && (
                      <div className="p-3.5 bg-brand-50/60 border border-brand-200 rounded-xl text-xs space-y-1 text-slate-700">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{selectedCompObj.name}</span>
                          <span className="text-brand-700">{selectedCompObj.category}</span>
                        </div>
                        <p className="text-slate-500">Industry: {selectedCompObj.industry}</p>
                        <p className="text-slate-500">Location: {selectedCompObj.headquarters || 'Pan-India'}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Option 2: Create New Company */
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        New Company Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required={companyOption === 'new'}
                        placeholder="Enter full company name"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Category
                        </label>
                        <select
                          name="companyCategory"
                          value={formData.companyCategory}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                        >
                          <option value="Indian Company">Indian Company</option>
                          <option value="MNC / Global Company">MNC / Global Company</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Industry
                        </label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                        >
                          <option value="IT & Software">IT & Software</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Banking & Finance">Banking & Finance</option>
                          <option value="E-commerce">E-commerce</option>
                          <option value="Telecommunications">Telecommunications</option>
                          <option value="Automotive">Automotive</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Product Companies">Product Companies</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Headquarters / City
                        </label>
                        <input
                          type="text"
                          name="companyLocation"
                          placeholder="e.g. Bengaluru, India"
                          value={formData.companyLocation}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          name="companyWebsite"
                          placeholder="https://example.com"
                          value={formData.companyWebsite}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company Description
                      </label>
                      <textarea
                        name="companyDescription"
                        rows="2"
                        placeholder="Brief overview of the organization..."
                        value={formData.companyDescription}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-brand-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
