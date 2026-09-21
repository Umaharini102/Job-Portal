import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Badge from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { Flag, CheckCircle2, XCircle, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminReportsPage = () => {
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const url = filterStatus === 'all' ? '/admin/reports' : `/admin/reports?status=${filterStatus}`;
      const res = await API.get(url);
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const handleResolve = async (id, deleteJob = false) => {
    try {
      const res = await API.put(`/admin/reports/${id}`, {
        status: 'Resolved',
        deleteJob,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setReports((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'Resolved' } : r))
        );
      }
    } catch (err) {
      toast.error('Failed to resolve report');
    }
  };

  const handleDismiss = async (id) => {
    try {
      const res = await API.put(`/admin/reports/${id}`, {
        status: 'Dismissed',
      });

      if (res.data.success) {
        toast.info('Report marked as dismissed');
        setReports((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'Dismissed' } : r))
        );
      }
    } catch (err) {
      toast.error('Failed to dismiss report');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Content Moderation & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review flagged listings submitted by users and take protective action
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-brand-500 outline-none"
          >
            <option value="all">All Reports</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse p-4"></div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Flag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No reports found</h3>
          <p className="text-xs text-slate-500">The platform moderation queue is currently clear.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      {report.reason}
                    </span>
                    <Badge variant={report.status === 'Pending' ? 'danger' : 'default'}>
                      {report.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Reported by: <span className="font-semibold text-slate-700">{report.reportedBy?.name || 'User'}</span> ({report.reportedBy?.email})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {report.jobId && (
                    <Link
                      to={`/job/${report.jobId._id}`}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors inline-flex items-center gap-1"
                    >
                      <span>View Job</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}

                  {report.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleResolve(report._id, false)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors"
                      >
                        Resolve
                      </button>

                      <button
                        onClick={() => handleResolve(report._id, true)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Job</span>
                      </button>

                      <button
                        onClick={() => handleDismiss(report._id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>

              {report.jobId && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">Job Details:</p>
                  <p>{report.jobId.title} at {report.jobId.companyName}</p>
                </div>
              )}

              {report.description && (
                <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-xs text-slate-700">
                  <p className="font-bold text-rose-900">Reporter's Note:</p>
                  <p className="mt-0.5 leading-relaxed">{report.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;
