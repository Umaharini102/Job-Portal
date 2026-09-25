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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-display">Saved Jobs</h1>
        <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
          Positions you have bookmarked to review or simulate later
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-40 bg-[#FDFBF7] rounded-2xl border border-[#E8DFC8] animate-pulse p-6"></div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-[#FDFBF7] rounded-2xl p-12 text-center border border-[#E8DFC8]/80 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-[#F5EFE6] rounded-full flex items-center justify-center mx-auto text-charcoal-400">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-charcoal-900 text-lg font-display">No saved jobs yet</h3>
          <p className="text-sm text-charcoal-500 max-w-sm mx-auto">
            Bookmark opportunities you are interested in while exploring so you can easily return and apply.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 bg-brand-500 text-white text-xs font-bold rounded-xl hover:bg-brand-600 transition-colors cursor-pointer"
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
                className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#E8DFC8]/80 hover:border-brand-300 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-charcoal-900 border border-brand-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {job.companyLogo ? (
                          <img
                            src={getMediaUrl(job.companyLogo)}
                            alt={job.companyName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Briefcase className="w-6 h-6 text-brand-400" />
                        )}
                      </div>
                      <div>
                        <Link
                          to={`/job/${job._id}`}
                          className="font-bold text-charcoal-900 hover:text-brand-600 text-base line-clamp-1 transition-colors font-display"
                        >
                          {job.title}
                        </Link>
                        <p className="text-xs font-medium text-charcoal-600">{job.companyName}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(job._id)}
                      className="p-1.5 text-charcoal-400 hover:text-coral-600 rounded-lg hover:bg-coral-50 transition-colors cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-charcoal-500 font-medium">
                    <span className="flex items-center gap-1 bg-[#F5EFE6] px-2.5 py-0.5 rounded-md border border-[#E8DFC8]/60">
                      <MapPin className="w-3 h-3 text-brand-500" />
                      {job.location} ({job.workMode})
                    </span>
                    <span className="bg-[#F5EFE6] px-2.5 py-0.5 rounded-md border border-[#E8DFC8]/60 text-charcoal-700">
                      {job.jobType}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-600 mt-2 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="border-t border-[#E8DFC8]/60 mt-4 pt-3 flex items-center justify-between">
                  <span className="text-xs text-charcoal-400">
                    Saved on {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/job/${job._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
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
