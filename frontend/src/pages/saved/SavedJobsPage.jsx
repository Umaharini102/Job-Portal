import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API, { getMediaUrl } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Bookmark, Briefcase, MapPin, Trash2, ArrowRight } from 'lucide-react';

const SavedJobsPage = () => {
  const toast = useToast();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get('/saved-jobs');
      if (res.data.success) {
        setSavedJobs(res.data.savedJobs);
      }
    } catch (err) {
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      const res = await API.delete(`/saved-jobs/${jobId}`);
      if (res.data.success) {
        toast.info('Job removed from bookmarks');
        setSavedJobs(savedJobs.filter((item) => item.jobId?._id !== jobId));
      }
    } catch (err) {
      toast.error('Failed to remove saved job');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Saved Jobs</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Positions you have bookmarked to review or apply to later
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"></div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No saved jobs yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Bookmark jobs you are interested in while browsing so you can easily return and apply.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Browse Open Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((item) => {
            const job = item.jobId;
            if (!job) return null;
            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-brand-300 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {job.companyLogo ? (
                          <img
                            src={getMediaUrl(job.companyLogo)}
                            alt={job.companyName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Briefcase className="w-6 h-6 text-brand-600" />
                        )}
                      </div>
                      <div>
                        <Link
                          to={`/job/${job._id}`}
                          className="font-bold text-slate-900 hover:text-brand-600 text-base line-clamp-1 transition-colors"
                        >
                          {job.title}
                        </Link>
                        <p className="text-xs font-medium text-slate-600">{job.companyName}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(job._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3" />
                      {job.location} ({job.workMode})
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                      {job.jobType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Saved on {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/job/${job._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
