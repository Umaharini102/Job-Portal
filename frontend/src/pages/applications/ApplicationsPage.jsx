import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API, { getMediaUrl } from '../../services/api';
import Badge from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  Briefcase,
  MapPin,
  Calendar,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const ApplicationsPage = () => {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [expandedNotes, setExpandedNotes] = useState({});

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const url = selectedStatus === 'All' ? '/applications/my-applications' : `/applications/my-applications?status=${selectedStatus}`;
      const res = await API.get(url);
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      toast.error('Failed to load your applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      const res = await API.delete(`/applications/${id}`);
      if (res.data.success) {
        toast.info('Application withdrawn');
        setApplications(applications.filter((a) => a._id !== id));
      }
    } catch (err) {
      toast.error('Failed to withdraw application');
    }
  };

  const statuses = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  const toggleNote = (id) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          My Applications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track the progress and status of your active job applications
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-200">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedStatus === status
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No applications found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven’t applied for any roles matching this filter yet. Browse open jobs to submit your first application.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Explore Open Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = app.jobId;
            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-brand-200 shadow-sm transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {job?.companyLogo ? (
                        <img
                          src={getMediaUrl(job.companyLogo)}
                          alt={job.companyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Briefcase className="w-6 h-6 text-brand-600" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {job ? (
                          <Link
                            to={`/job/${job._id}`}
                            className="font-bold text-slate-900 hover:text-brand-600 text-base transition-colors"
                          >
                            {job.title}
                          </Link>
                        ) : (
                          <span className="font-bold text-slate-900 text-base">Job Listing No Longer Available</span>
                        )}
                        <Badge variant={app.status}>{app.status}</Badge>
                      </div>

                      <p className="text-xs font-semibold text-slate-700">{job?.companyName}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        {job?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location} ({job.workMode})
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {app.coverLetter && (
                      <button
                        onClick={() => toggleNote(app._id)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                      >
                        <span>Cover Letter</span>
                        {expandedNotes[app._id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}

                    <button
                      onClick={() => handleWithdraw(app._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Withdraw application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Collapsible Cover Letter */}
                {expandedNotes[app._id] && app.coverLetter && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1 animate-in fade-in">
                    <p className="font-bold text-slate-900">Submitted Cover Note:</p>
                    <p className="leading-relaxed whitespace-pre-line">{app.coverLetter}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
