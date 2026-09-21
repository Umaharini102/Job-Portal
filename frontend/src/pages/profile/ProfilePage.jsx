import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API, { getMediaUrl } from '../../services/api';
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  FileText,
  Download,
  Edit3,
  Target,
  ExternalLink,
  Calendar,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState(authProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/profiles/${user._id}`);
        if (res.data.success) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchProfile();
  }, [user]);

  if (loading && !profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Header Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-800 relative"></div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white p-1.5 shadow-lg border border-slate-100 flex-shrink-0">
              <div className="w-full h-full rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
                {user?.profileImage ? (
                  <img
                    src={getMediaUrl(user.profileImage)}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-extrabold text-brand-600">
                    {user?.name?.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            <Link
              to="/profile/edit"
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                {user?.role}
              </span>
            </div>

            <p className="text-base text-slate-700 font-medium max-w-2xl leading-snug">
              {profile?.headline || 'Job Seeker on JobConnect'}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 font-medium pt-2">
              {user?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {user.location}
                </span>
              )}
              {user?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
              )}
              {user?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Your Profile Checklist Banner (if profile is incomplete) */}
      {(!profile?.headline || !profile?.skills?.length || !profile?.education?.length || !profile?.resume) && (
        <div className="bg-gradient-to-r from-brand-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-brand-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-brand-900 flex items-center gap-2">
                <span>Complete your profile</span>
              </h2>
              <p className="text-xs text-brand-700">
                A completed profile gets up to 5x more views and opportunities from hiring recruiters.
              </p>
            </div>
            <Link
              to="/profile/edit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all text-center self-start sm:self-auto"
            >
              Complete Profile Now
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <Link
              to="/profile/edit"
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                profile?.headline
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-white border-brand-200 text-brand-800 hover:border-brand-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${profile?.headline ? 'bg-emerald-500' : 'bg-brand-400'}`} />
              <span>{profile?.headline ? 'Headline Added' : 'Enter your headline'}</span>
            </Link>

            <Link
              to="/profile/edit"
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                profile?.skills?.length
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-white border-brand-200 text-brand-800 hover:border-brand-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${profile?.skills?.length ? 'bg-emerald-500' : 'bg-brand-400'}`} />
              <span>{profile?.skills?.length ? `${profile.skills.length} Skills Added` : 'Add your skills'}</span>
            </Link>

            <Link
              to="/profile/edit"
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                profile?.education?.length
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-white border-brand-200 text-brand-800 hover:border-brand-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${profile?.education?.length ? 'bg-emerald-500' : 'bg-brand-400'}`} />
              <span>{profile?.education?.length ? 'Education Added' : 'Add your education'}</span>
            </Link>

            <Link
              to="/profile/edit"
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                profile?.resume
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-white border-brand-200 text-brand-800 hover:border-brand-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${profile?.resume ? 'bg-emerald-500' : 'bg-brand-400'}`} />
              <span>{profile?.resume ? 'Resume Attached' : 'Upload your resume'}</span>
            </Link>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">About</h2>
          <Link to="/profile/edit" className="text-xs font-bold text-brand-600 hover:underline">
            {profile?.about ? 'Edit' : '+ Add About'}
          </Link>
        </div>
        {profile?.about ? (
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {profile.about}
          </p>
        ) : (
          <div className="py-4 text-center space-y-2">
            <p className="text-xs text-slate-500 italic">No summary added yet.</p>
            <p className="text-xs text-slate-700 font-medium">
              Complete your profile by introducing your background and expertise.
            </p>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            Skills & Competencies
          </h2>
          <Link to="/profile/edit" className="text-xs font-bold text-brand-600 hover:underline">
            {profile?.skills && profile.skills.length > 0 ? 'Edit' : '+ Add your skills'}
          </Link>
        </div>
        {profile?.skills && profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-800">Add your skills</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Showcase your technical capabilities to get recommended for top matching jobs.
            </p>
            <Link
              to="/profile/edit"
              className="inline-block mt-2 px-4 py-1.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg border border-brand-200 hover:bg-brand-100 transition-colors"
            >
              Add your skills
            </Link>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-600" />
            <span>Experience</span>
          </h2>
          <Link to="/profile/edit" className="text-xs font-bold text-brand-600 hover:underline">
            {profile?.experience && profile.experience.length > 0 ? 'Edit' : '+ Add Experience'}
          </Link>
        </div>

        {profile?.experience && profile.experience.length > 0 ? (
          <div className="space-y-6">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold text-slate-900 text-base">{exp.title}</h3>
                  <p className="text-xs font-semibold text-slate-700">{exp.company} • {exp.location}</p>
                  <p className="text-xs text-slate-400">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-800">Add your experience</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add past roles, internships, or freelance work to highlight your journey.
            </p>
            <Link
              to="/profile/edit"
              className="inline-block mt-2 px-4 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              + Add Experience
            </Link>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            <span>Education</span>
          </h2>
          <Link to="/profile/edit" className="text-xs font-bold text-brand-600 hover:underline">
            {profile?.education && profile.education.length > 0 ? 'Edit' : '+ Add your education'}
          </Link>
        </div>

        {profile?.education && profile.education.length > 0 ? (
          <div className="space-y-6">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold text-slate-900 text-base">{edu.school}</h3>
                  <p className="text-xs font-semibold text-slate-700">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </p>
                  <p className="text-xs text-slate-400">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-800">Add your education</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Share your degrees, university background, or high school qualifications.
            </p>
            <Link
              to="/profile/edit"
              className="inline-block mt-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              Add your education
            </Link>
          </div>
        )}
      </div>

      {/* Projects Section */}
      {profile?.projects && profile.projects.length > 0 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-brand-600" />
            <span>Key Projects</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.projects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                <div className="flex items-center gap-3 pt-1 text-xs">
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile?.certifications && profile.certifications.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-600" />
              <span>Certifications</span>
            </h2>
            <div className="space-y-3">
              {profile.certifications.map((cert, idx) => (
                <div key={idx} className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-xs">{cert.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {cert.issuingOrganization} • Issued {cert.issueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile?.careerGoals && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-600" />
              <span>Career Goals</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">{profile.careerGoals}</p>
          </div>
        )}
      </div>

      {/* Resume Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Resume / Curriculum Vitae</h3>
            <p className="text-xs text-slate-500">
              {profile?.resumeOriginalName || 'Upload your resume for 1-click job applications'}
            </p>
          </div>
        </div>

        {profile?.resume ? (
          <a
            href={getMediaUrl(profile.resume)}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors inline-flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Resume</span>
          </a>
        ) : (
          <Link
            to="/profile/edit"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors text-center inline-flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Upload your resume</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
