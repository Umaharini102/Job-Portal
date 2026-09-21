import React, { useState, useEffect, useCallback } from 'react';
import API, { getMediaUrl } from '../../services/api';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';
import {
  Building,
  Search,
  Trash2,
  Power,
  Mail,
  MapPin,
  Briefcase,
  ExternalLink,
  Globe,
  Loader2,
} from 'lucide-react';

const AdminRecruitersPage = () => {
  const toast = useToast();
  const [recruiters, setRecruiters] = useState([]);
  const [totalRecruiters, setTotalRecruiters] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchRecruiters = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', currentPage);
      params.append('limit', '10');

      const res = await API.get(`/admin/recruiters?${params.toString()}`);
      if (res.data.success) {
        setRecruiters(res.data.recruiters);
        setTotalRecruiters(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load recruiters');
    } finally {
      setLoading(false);
    }
  }, [search, currentPage, toast]);

  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await API.put(`/users/${id}/toggle-status`);
      if (res.data.success) {
        toast.success(res.data.message);
        setRecruiters((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isActive: res.data.isActive } : r))
        );
      }
    } catch (err) {
      toast.error('Failed to toggle recruiter status');
    }
  };

  const handleDeleteRecruiter = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recruiter account? All associated jobs and company data will be removed.')) {
      return;
    }

    try {
      const res = await API.delete(`/users/${id}`);
      if (res.data.success) {
        toast.info('Recruiter account removed');
        setRecruiters(recruiters.filter((r) => r._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete recruiter');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Recruiter Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor registered recruiters, verify company details, and manage publishing privileges
          </p>
        </div>
        <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 self-start sm:self-auto">
          {totalRecruiters} Total Recruiters
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by recruiter name, email, or company..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">Recruiter</th>
                <th className="py-3.5 px-5">Company</th>
                <th className="py-3.5 px-5">Contact</th>
                <th className="py-3.5 px-5">Job Postings</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
                    Loading recruiters...
                  </td>
                </tr>
              ) : recruiters.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No recruiters found matching your search.
                  </td>
                </tr>
              ) : (
                recruiters.map((rec) => (
                  <tr key={rec._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Recruiter */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {rec.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{rec.name}</p>
                          <p className="text-[11px] text-slate-400">
                            Joined {new Date(rec.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-5">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rec.companyName}</span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {rec.industry} • {rec.companySize}
                        </p>
                        {rec.website && (
                          <a
                            href={rec.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-brand-600 hover:underline flex items-center gap-0.5"
                          >
                            <Globe className="w-2.5 h-2.5" />
                            <span>{rec.website}</span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-5 space-y-1">
                      <p className="text-slate-600 flex items-center gap-1.5 text-xs font-medium">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{rec.email}</span>
                      </p>
                      {rec.phone && (
                        <p className="text-[11px] text-slate-400">
                          Phone: {rec.phone}
                        </p>
                      )}
                      {rec.location && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{rec.location}</span>
                        </p>
                      )}
                    </td>

                    {/* Job Postings */}
                    <td className="py-3.5 px-5">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 text-xs">
                          {rec.jobsCount} Total
                        </span>
                        <p className="text-[11px] text-emerald-600 font-medium">
                          {rec.activeJobsCount} Active
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          rec.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {rec.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => handleToggleStatus(rec._id)}
                          title={rec.isActive ? 'Disable Recruiter' : 'Enable Recruiter'}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            rec.isActive
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 border-slate-200'
                              : 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteRecruiter(rec._id)}
                          title="Delete Recruiter Account"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminRecruitersPage;
