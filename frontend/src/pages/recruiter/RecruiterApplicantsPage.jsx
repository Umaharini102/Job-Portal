import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API, { getMediaUrl } from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Filter,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  CheckCircle2,
} from 'lucide-react';

const RecruiterApplicantsPage = () => {
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [applications, setApplications] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedJobId, setSelectedJobId] = useState(searchParams.get('jobId') || '');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Cover letter modal
  const [activeCoverLetter, setActiveCoverLetter] = useState(null);

  // Candidate full profile modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedJobId) params.append('jobId', selectedJobId);
      if (selectedStatus && selectedStatus !== 'All') params.append('status', selectedStatus);
      if (searchKeyword) params.append('search', searchKeyword);

      const res = await API.get(`/applications/recruiter?${params.toString()}`);
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load recruiter jobs for dropdown
    const loadJobs = async () => {
      try {
        const res = await API.get('/jobs/recruiter/my-jobs');
        if (res.data.success) {
          setRecruiterJobs(res.data.jobs);
        }
      } catch (err) {
        // ignore
      }
    };
    loadJobs();
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [selectedJobId, selectedStatus, searchKeyword]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const res = await API.put(`/applications/${applicationId}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(`Candidate moved to ${newStatus}. Notification sent!`);
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (err) {
      toast.error('Failed to update candidate status');
    }
  };

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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Candidate Pipeline & Applicants
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review candidate profiles, download resumes, and advance applicants through the hiring stages
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search candidate or skill..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          />
        </div>

        {/* Filter by Job */}
        <div>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          >
            <option value="">All Job Postings</option>
            {recruiterJobs.map((j) => (
              <option key={j._id} value={j._id}>
                {j.title} ({j.location})
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Application Statuses' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applicants List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No applicants found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No candidate applications match your current filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const applicant = app.applicantId;
            const profile = app.seekerProfile;
            const job = app.jobId;

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-brand-200 shadow-sm transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Candidate Overview */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {applicant?.profileImage ? (
                        <img
                          src={getMediaUrl(applicant.profileImage)}
                          alt={applicant?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-xl text-brand-600">
                          {applicant?.name?.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">
                          {applicant?.name}
                        </h3>
                        <Badge variant={app.status}>{app.status}</Badge>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        Applied for: <span className="text-brand-600 font-bold">{job?.title}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        {applicant?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {applicant.location}
                          </span>
                        )}
                        {applicant?.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {applicant.email}
                          </span>
                        )}
                        {applicant?.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {applicant.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                    {/* Status Changer */}
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold">
                      <span className="text-slate-500">Stage:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="bg-transparent font-bold text-brand-700 outline-none cursor-pointer"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {/* Resume Download */}
                    {app.resume && (
                      <a
                        href={getMediaUrl(app.resume)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </a>
                    )}

                    {/* Cover Note View */}
                    {app.coverLetter && (
                      <button
                        onClick={() => setActiveCoverLetter({ candidate: applicant?.name, text: app.coverLetter })}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Cover Letter</span>
                      </button>
                    )}

                    {/* Full Profile preview */}
                    <button
                      onClick={() => setSelectedCandidate({ applicant, profile, app })}
                      className="px-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Profile</span>
                    </button>
                  </div>
                </div>

                {/* Candidate Skills Pills */}
                {profile?.skills && profile.skills.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">Skills:</span>
                    {profile.skills.slice(0, 6).map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md">
                        {sk}
                      </span>
                    ))}
                    {profile.skills.length > 6 && (
                      <span className="text-[10px] text-slate-400">+{profile.skills.length - 6} more</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cover Letter Modal */}
      <Modal
        isOpen={Boolean(activeCoverLetter)}
        onClose={() => setActiveCoverLetter(null)}
        title={`Cover Letter from ${activeCoverLetter?.candidate}`}
      >
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {activeCoverLetter?.text}
        </div>
      </Modal>

      {/* Full Candidate Profile Modal */}
      <Modal
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        title={`Candidate: ${selectedCandidate?.applicant?.name}`}
        maxWidth="max-w-2xl"
      >
        {selectedCandidate && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                {selectedCandidate.applicant?.profileImage ? (
                  <img src={getMediaUrl(selectedCandidate.applicant.profileImage)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-8 h-8 text-brand-600" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{selectedCandidate.applicant?.name}</h3>
                <p className="text-xs text-slate-500">{selectedCandidate.profile?.headline}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedCandidate.applicant?.location}</p>
              </div>
            </div>

            {selectedCandidate.profile?.about && (
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">About</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedCandidate.profile.about}</p>
              </div>
            )}

            {selectedCandidate.profile?.experience?.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Experience</h4>
                <div className="space-y-2 text-xs">
                  {selectedCandidate.profile.experience.map((exp, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="font-bold text-slate-900">{exp.title} at {exp.company}</p>
                      <p className="text-slate-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCandidate.app?.resume && (
              <div className="pt-2 border-t border-slate-100">
                <a
                  href={getMediaUrl(selectedCandidate.app.resume)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Candidate Resume</span>
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecruiterApplicantsPage;
