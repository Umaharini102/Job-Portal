import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Save,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

const PostJobPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { profile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    companyId: profile?.companyId || '',
    companyName: profile?.companyName || '',
    location: profile?.location || '',
    jobType: 'Full Time',
    experienceLevel: 'Mid Level',
    workMode: 'Hybrid',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
    description: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    benefits: '',
    status: 'Active',
  });

  // Fetch companies list for company selection
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
    if (isEditMode) {
      const fetchJob = async () => {
        setLoading(true);
        try {
          const res = await API.get(`/jobs/${id}`);
          if (res.data.success) {
            const j = res.data.job;
            const cId = j.companyId?._id || (typeof j.companyId === 'string' ? j.companyId : '');
            setFormData({
              title: j.title || '',
              companyId: cId || '',
              companyName: j.companyName || '',
              location: j.location || '',
              jobType: j.jobType || 'Full Time',
              experienceLevel: j.experienceLevel || 'Mid Level',
              workMode: j.workMode || 'Hybrid',
              salaryMin: j.salaryMin || '',
              salaryMax: j.salaryMax || '',
              deadline: j.deadline ? new Date(j.deadline).toISOString().split('T')[0] : '',
              description: j.description || '',
              responsibilities: j.responsibilities?.join('\n') || '',
              requirements: j.requirements?.join('\n') || '',
              skills: j.skills?.join(', ') || '',
              benefits: j.benefits?.join('\n') || '',
              status: j.status || 'Active',
            });
          }
        } catch (err) {
          toast.error('Failed to load job for editing');
          navigate('/recruiter/jobs');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    } else if (profile?.companyName) {
      setFormData((prev) => ({
        ...prev,
        companyId: profile.companyId || '',
        companyName: profile.companyName,
        location: profile.location || '',
      }));
    }
  }, [id, isEditMode, profile, navigate, toast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompanySelect = (compId) => {
    const selected = availableCompanies.find((c) => c._id === compId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        companyId: selected._id,
        companyName: selected.name,
      }));
    }
  };

  const handleLocationPreset = (loc) => {
    setFormData((prev) => ({ ...prev, location: loc }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.companyName || !formData.location || !formData.description) {
      toast.warning('Please fill in all required fields (Title, Company, Location, Description)');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        const res = await API.put(`/jobs/${id}`, formData);
        if (res.data.success) {
          toast.success('Job posting updated successfully!');
          navigate('/recruiter/jobs');
        }
      } else {
        const res = await API.post('/jobs', formData);
        if (res.data.success) {
          toast.success('Job posted successfully! Candidates can now apply.');
          navigate('/recruiter/jobs');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job posting');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div>
        <Link
          to="/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Manage Jobs</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isEditMode ? 'Edit Job Posting' : 'Post a New Job Opportunity'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Reach thousands of qualified developers, designers, and tech professionals
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Core Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Senior Full Stack Engineer"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Company <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.companyId || ''}
              onChange={(e) => handleCompanySelect(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              {formData.companyName && !formData.companyId && (
                <option value="">{formData.companyName} (Custom Employer)</option>
              )}
              {availableCompanies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.category === 'Indian Company' ? 'Indian' : 'MNC'})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Posting on behalf of verified employer profile in database
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. Bengaluru, Hyderabad, Pune, Remote - India"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
            />
            {/* Indian Location Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 font-bold">Quick Select:</span>
              {['Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Mumbai', 'Noida', 'Gurugram', 'Remote - India'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleLocationPreset(`${city}, India`)}
                  className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded-md border border-slate-200 text-slate-600 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Job Type
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Workplace Mode
            </label>
            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Lead / Manager">Lead / Manager</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Listing Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              <option value="Active">Active (Accepting Applications)</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Minimum Salary (USD / yr)
            </label>
            <input
              type="number"
              name="salaryMin"
              placeholder="e.g. 110000"
              value={formData.salaryMin}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Maximum Salary (USD / yr)
            </label>
            <input
              type="number"
              name="salaryMax"
              placeholder="e.g. 150000"
              value={formData.salaryMax}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Text descriptions */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Job Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="5"
              name="description"
              required
              placeholder="Provide a comprehensive description of the role, mission, team structure, and impact..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Key Responsibilities (One per line)
            </label>
            <textarea
              rows="4"
              name="responsibilities"
              placeholder="Architect core frontend modules&#10;Collaborate with product designers&#10;Conduct code reviews"
              value={formData.responsibilities}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-mono text-xs"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Requirements & Qualifications (One per line)
            </label>
            <textarea
              rows="4"
              name="requirements"
              placeholder="3+ years React and JavaScript experience&#10;Familiarity with REST APIs and state management&#10;BS in Computer Science or equivalent"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-mono text-xs"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Required Skills (Comma separated)
            </label>
            <input
              type="text"
              name="skills"
              placeholder="React, TypeScript, Node.js, Tailwind CSS, Redux"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Benefits & Perks (One per line)
            </label>
            <textarea
              rows="3"
              name="benefits"
              placeholder="Comprehensive Health & Dental&#10;Flexible Remote Policy&#10;Annual Learning Budget"
              value={formData.benefits}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-mono text-xs"
            ></textarea>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/recruiter/jobs"
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-7 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isEditMode ? 'Update Job Listing' : 'Publish Job Listing'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;
