import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API, { getMediaUrl } from '../../services/api';
import JobCard from '../../components/cards/JobCard';
import Badge from '../../components/common/Badge';
import {
  Briefcase,
  MapPin,
  Bookmark,
  FileText,
  Search,
  Sparkles,
  TrendingUp,
  User,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const SeekerHome = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          API.get('/jobs?limit=6'),
          API.get('/applications/my-applications'),
        ]);

        if (jobsRes.data.success) {
          setRecommendedJobs(jobsRes.data.jobs);
        }
        if (appsRes.data.success) {
          setRecentApplications(appsRes.data.applications.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching seeker home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Snapshot Card (3 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Cover Banner */}
            <div className="h-20 bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 relative"></div>

            {/* Avatar & Info */}
            <div className="px-5 pb-5 pt-0 -mt-10 text-center relative space-y-3">
              <div className="w-20 h-20 rounded-2xl bg-white p-1 mx-auto shadow-md">
                <div className="w-full h-full rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
                  {user?.profileImage ? (
                    <img
                      src={getMediaUrl(user.profileImage)}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-2xl text-brand-600">
                      {user?.name?.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-snug">{user?.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {profile?.headline || 'Job Seeker on JobConnect'}
                </p>
                {user?.location && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {user.location}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-around text-center">
                <Link to="/applications" className="hover:text-brand-600 transition-colors">
                  <p className="text-base font-extrabold text-slate-900">
                    {recentApplications.length}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">Applications</p>
                </Link>
                <div className="w-px h-8 bg-slate-100" />
                <Link to="/saved-jobs" className="hover:text-brand-600 transition-colors">
                  <p className="text-base font-extrabold text-slate-900">
                    {profile?.skills?.length || 0}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">Skills Listed</p>
                </Link>
              </div>

              <div className="pt-2">
                <Link
                  to="/profile"
                  className="block w-full py-2 bg-slate-50 hover:bg-slate-100 text-brand-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2 text-xs font-semibold text-slate-700">
            <Link
              to="/applications"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>My Job Applications</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              to="/saved-jobs"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-purple-600" />
                <span>Saved Jobs / Bookmarks</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              to="/profile/edit"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Edit Profile & Resume</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Center / Main Column: Feed & Recommendations (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Dynamic Welcome Greeting Banner */}
          <div className="bg-gradient-to-r from-white via-brand-50/30 to-indigo-50/30 rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome, {user?.name || 'Job Seeker'}
                </h1>
                <p className="text-xs text-slate-500">
                  Find new career opportunities, track your submissions, and connect with top recruiters.
                </p>
              </div>
              {(!profile?.skills?.length || !profile?.resume) && (
                <Link
                  to="/profile/edit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto flex-shrink-0"
                >
                  <span>Complete your profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Search Banner Prompt */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Looking for something new?</h4>
                <p className="text-xs text-slate-500">Discover roles matching your experience and desired salary</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex-shrink-0"
            >
              Explore Jobs
            </button>
          </div>

          {/* Recent Applications Tracker Preview */}
          {recentApplications.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Recent Applications</span>
                </h3>
                <Link to="/applications" className="text-xs font-bold text-brand-600 hover:underline">
                  View All ({recentApplications.length})
                </Link>
              </div>

              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{app.jobId?.title || 'Job Posting'}</h4>
                      <p className="text-xs text-slate-500">{app.jobId?.companyName} • Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={app.status}>
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Jobs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Recommended for You</span>
                </h3>
                <p className="text-xs text-slate-500">Based on your skills, experience, and profile details</p>
              </div>
              <Link to="/jobs" className="text-xs font-bold text-brand-600 hover:underline">
                See all jobs
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-56 bg-white rounded-2xl border border-slate-200 p-5 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedJobs.map((job) => (
                  <JobCard key={job._id} job={job} isSaved={job.isSaved} hasApplied={job.hasApplied} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerHome;
