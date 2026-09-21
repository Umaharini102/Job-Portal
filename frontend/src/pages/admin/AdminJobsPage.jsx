import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API, { getMediaUrl } from '../../services/api';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';
import { Briefcase, Search, Power, Trash2, Eye, MapPin } from 'lucide-react';

const AdminJobsPage = () => {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', currentPage);
      params.append('limit', '10');

      const res = await API.get(`/admin/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.jobs);
        setTotalJobs(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await API.put(`/jobs/${id}/toggle-status`);
      if (res.data.success) {
        toast.success(`Job status changed to ${res.data.status}`);
        setJobs((prev) =>
          prev.map((j) => (j._id === id ? { ...j, status: res.data.status } : j))
        );
      }
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job posting immediately?')) {
      return;
    }

    try {
      const res = await API.delete(`/jobs/${id}`);
      if (res.data.success) {
        toast.info('Job removed');
        setJobs(jobs.filter((j) => j._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Job Moderation & Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review all job listings published across the platform and enforce safety standards
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search job title or company..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-white rounded-2xl border border-slate-200 animate-pulse p-4"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No jobs found</h3>
          <p className="text-xs text-slate-500">No job listings match your current filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Title & Company</th>
                  <th className="px-6 py-4">Recruiter</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Posted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        to={`/job/${job._id}`}
                        className="font-bold text-slate-900 hover:text-brand-600 transition-colors text-sm"
                      >
                        {job.title}
                      </Link>
                      <p className="text-slate-400 mt-0.5">{job.companyName}</p>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <p className="font-bold text-slate-800">{job.recruiterId?.name || 'Recruiter'}</p>
                      <p className="text-slate-400">{job.recruiterId?.email}</p>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <p>{job.location} ({job.workMode})</p>
                      <p className="text-slate-400">{job.jobType} • {job.experienceLevel}</p>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={job.status}>{job.status}</Badge>
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/job/${job._id}`}
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(job._id)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Toggle Active/Closed"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Inappropriate Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

export default AdminJobsPage;
