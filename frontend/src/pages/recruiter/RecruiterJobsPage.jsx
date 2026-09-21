import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import Badge from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import {
  Briefcase,
  PlusCircle,
  Users,
  Edit3,
  Trash2,
  Power,
  MapPin,
  Calendar,
  Eye,
} from 'lucide-react';

const RecruiterJobsPage = () => {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get('/jobs/recruiter/my-jobs');
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      toast.error('Failed to load your posted jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const res = await API.put(`/jobs/${id}/toggle-status`);
      if (res.data.success) {
        toast.success(`Job is now ${res.data.status}`);
        setJobs((prev) =>
          prev.map((j) => (j._id === id ? { ...j, status: res.data.status } : j))
        );
      }
    } catch (err) {
      toast.error('Failed to update job status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job and its applications?')) {
      return;
    }

    try {
      const res = await API.delete(`/jobs/${id}`);
      if (res.data.success) {
        toast.info('Job posting deleted');
        setJobs(jobs.filter((j) => j._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Manage Job Postings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track, edit, and review applicants across your published openings
          </p>
        </div>

        <Link
          to="/recruiter/post-job"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a New Job</span>
        </Link>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse p-4"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No jobs posted yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven’t created any job postings yet. Publish an opening to begin receiving candidate applications.
          </p>
          <Link
            to="/recruiter/post-job"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4">Date Posted</th>
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
                      <div className="space-y-0.5">
                        <span className="inline-block">{job.location} ({job.workMode})</span>
                        <p className="text-slate-400">{job.jobType} • {job.experienceLevel}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(job._id)}
                        className="cursor-pointer focus:outline-none"
                        title="Click to toggle Active / Closed"
                      >
                        <Badge variant={job.status}>{job.status}</Badge>
                      </button>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-800">
                      <Link
                        to={`/recruiter/applicants?jobId=${job._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantCount || 0} applicants</span>
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/job/${job._id}`}
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Public Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/recruiter/jobs/${job._id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Job"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(job._id)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title={job.status === 'Active' ? 'Close Job' : 'Reactivate Job'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Job"
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
        </div>
      )}
    </div>
  );
};

export default RecruiterJobsPage;
