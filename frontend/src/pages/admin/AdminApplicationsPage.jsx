import React, { useState, useEffect, useCallback } from 'react';
import API, { getMediaUrl } from '../../services/api';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  Filter,
  Building,
  User,
  Calendar,
  ExternalLink,
  Download,
  Loader2,
  Briefcase,
} from 'lucide-react';

const AdminApplicationsPage = () => {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);
      params.append('page', currentPage);
      params.append('limit', '12');

      const res = await API.get(`/admin/applications?${params.toString()}`);
      if (res.data.success) {
        setApplications(res.data.applications);
        setTotalApplications(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage, toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const statuses = [
    'All',
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Selected',
    'Rejected',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Application Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit and monitor candidate job applications, recruitment pipeline stages, and submissions
          </p>
        </div>
        <span className="px-3.5 py-1.5 bg-brand-50 text-brand-700 font-bold text-xs rounded-xl border border-brand-200 self-start sm:self-auto">
          {totalApplications} Total Submissions
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-400 ml-2 mr-1 flex-shrink-0" />
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => {
              setStatusFilter(st);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === st
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Applications Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">Job Post</th>
                <th className="py-3.5 px-5">Applicant</th>
                <th className="py-3.5 px-5">Recruiter</th>
                <th className="py-3.5 px-5">Applied Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
                    Loading platform applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No applications found for the selected status.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Job Post */}
                    <td className="py-3.5 px-5">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 text-sm">
                          {app.jobId?.title || 'Job Unavailable'}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{app.jobId?.companyName} • {app.jobId?.location}</span>
                        </p>
                      </div>
                    </td>

                    {/* Applicant */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {app.applicantId?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">
                            {app.applicantId?.name || 'Unknown User'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {app.applicantId?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Recruiter */}
                    <td className="py-3.5 px-5">
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-800 text-xs">
                          {app.recruiterId?.name || 'Assigned Recruiter'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {app.recruiterId?.email}
                        </p>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="py-3.5 px-5">
                      <span className="text-slate-600 font-medium text-xs flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5">
                      <Badge variant={app.status}>
                        {app.status}
                      </Badge>
                    </td>

                    {/* Resume */}
                    <td className="py-3.5 px-5 text-right">
                      {app.resume ? (
                        <a
                          href={getMediaUrl(app.resume)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-brand-600 hover:text-brand-700 font-bold text-xs rounded-lg border border-slate-200 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>CV</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No CV</span>
                      )}
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

export default AdminApplicationsPage;
