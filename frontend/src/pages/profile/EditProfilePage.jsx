import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import API, { getMediaUrl } from '../../services/api';
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  FileText,
  Upload,
  Plus,
  Trash2,
  Save,
  Loader2,
  ArrowLeft,
  X,
  Check,
} from 'lucide-react';

const EditProfilePage = () => {
  const { user, profile: authProfile, refreshUser, updateUserState } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    headline: authProfile?.headline || '',
    about: authProfile?.about || '',
    careerGoals: authProfile?.careerGoals || '',
  });

  const [skills, setSkills] = useState(authProfile?.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [experience, setExperience] = useState(authProfile?.experience || []);
  const [education, setEducation] = useState(authProfile?.education || []);
  const [projects, setProjects] = useState(authProfile?.projects || []);

  // New experience temp state
  const [newExp, setNewExp] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  // New education temp state
  const [newEdu, setNewEdu] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  // New project temp state
  const [newProj, setNewProj] = useState({
    title: '',
    description: '',
    link: '',
    github: '',
  });

  useEffect(() => {
    if (user && authProfile) {
      setBasicInfo({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        headline: authProfile.headline || '',
        about: authProfile.about || '',
        careerGoals: authProfile.careerGoals || '',
      });
      setSkills(authProfile.skills || []);
      setExperience(authProfile.experience || []);
      setEducation(authProfile.education || []);
      setProjects(authProfile.projects || []);
    }
  }, [user, authProfile]);

  // Handle Save
  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/profiles/seeker', {
        ...basicInfo,
        skills,
        experience,
        education,
        projects,
      });

      if (res.data.success) {
        updateUserState(res.data.user, res.data.profile);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    setUploadingAvatar(true);
    try {
      const res = await API.post('/profiles/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        updateUserState(res.data.user);
        toast.success('Profile picture updated!');
      }
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Resume upload
  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploadingResume(true);
    try {
      const res = await API.post('/profiles/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        updateUserState(null, res.data.profile);
        toast.success('Resume updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to upload resume document');
    } finally {
      setUploadingResume(false);
    }
  };

  // Skill Add / Remove
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Add Experience
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExp.title || !newExp.company) {
      toast.warning('Title and Company are required');
      return;
    }
    setExperience([...experience, { ...newExp }]);
    setNewExp({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    toast.success('Experience item added');
  };

  // Add Education
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.school || !newEdu.degree) {
      toast.warning('School and Degree are required');
      return;
    }
    setEducation([...education, { ...newEdu }]);
    setNewEdu({
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    toast.success('Education item added');
  };

  // Add Project
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProj.title) {
      toast.warning('Project title is required');
      return;
    }
    setProjects([...projects, { ...newProj }]);
    setNewProj({ title: '', description: '', link: '', github: '' });
    toast.success('Project added');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profile View</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Your Profile</h1>
          <p className="text-xs text-slate-500">Keep your information accurate to stand out to recruiters</p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-2 pb-px">
        {[
          { id: 'basic', label: 'Basic & Headline', icon: User },
          { id: 'skills', label: 'Skills', icon: Briefcase },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'projects', label: 'Projects', icon: FolderGit2 },
          { id: 'media', label: 'Photo & Resume', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Basic & Headline */}
      {activeTab === 'basic' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={basicInfo.name}
                onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter your location"
                value={basicInfo.location}
                onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Professional Headline
              </label>
              <input
                type="text"
                placeholder="Enter your headline"
                value={basicInfo.headline}
                onChange={(e) => setBasicInfo({ ...basicInfo, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={basicInfo.phone}
                onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Career Goals
              </label>
              <input
                type="text"
                placeholder="Enter your career goals"
                value={basicInfo.careerGoals}
                onChange={(e) => setBasicInfo({ ...basicInfo, careerGoals: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                About / Summary
              </label>
              <textarea
                rows="5"
                placeholder="Enter your about / professional summary"
                value={basicInfo.about}
                onChange={(e) => setBasicInfo({ ...basicInfo, about: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skills */}
      {activeTab === 'skills' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Your Skills</h3>
            <p className="text-xs text-slate-500">Add technical and soft skills to match job algorithms</p>
          </div>

          <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Add your skills (e.g. React, Node.js, Python, SQL)"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-brand-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl hover:bg-brand-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="p-0.5 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <p className="text-xs text-slate-400 italic">No skills added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Experience */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          {/* Existing Experience Items */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Current Work Experience
            </h3>

            {experience.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No work experiences added yet.</p>
            ) : (
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{exp.title}</h4>
                      <p className="text-xs text-slate-600">{exp.company} • {exp.location}</p>
                      <p className="text-xs text-slate-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      {exp.description && <p className="text-xs text-slate-600 mt-2">{exp.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setExperience(experience.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Experience Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Work Experience</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company *</label>
                <input
                  type="text"
                  placeholder="e.g. TechCorp Solutions"
                  value={newExp.company}
                  onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA / Remote"
                  value={newExp.location}
                  onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Year</label>
                  <input
                    type="text"
                    placeholder="2021"
                    value={newExp.startDate}
                    onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Year</label>
                  <input
                    type="text"
                    placeholder="2024"
                    disabled={newExp.current}
                    value={newExp.endDate}
                    onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newExp.current}
                    onChange={(e) => setNewExp({ ...newExp, current: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                  <span>I currently work in this role</span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Responsibilities</label>
                <textarea
                  rows="3"
                  placeholder="Describe your achievements, architecture decisions, and projects..."
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                ></textarea>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddExperience}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Experience List</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Education */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Current Education
            </h3>

            {education.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No education records added yet.</p>
            ) : (
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{edu.school}</h4>
                      <p className="text-xs text-slate-600">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                      <p className="text-xs text-slate-400">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Education</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School / University *</label>
                <input
                  type="text"
                  placeholder="Enter your education (e.g. University Name)"
                  value={newEdu.school}
                  onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Degree *</label>
                <input
                  type="text"
                  placeholder="Enter your degree (e.g. Bachelor of Science)"
                  value={newEdu.degree}
                  onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Field of Study</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={newEdu.fieldOfStudy}
                  onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Year</label>
                  <input
                    type="text"
                    placeholder="2018"
                    value={newEdu.startDate}
                    onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Year</label>
                  <input
                    type="text"
                    placeholder="2022"
                    value={newEdu.endDate}
                    onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddEducation}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Education List</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Current Projects
            </h3>

            {projects.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No projects added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                    <p className="text-xs text-slate-600">{proj.description}</p>
                    <div className="flex items-center gap-3 pt-1 text-xs font-semibold text-brand-600">
                      {proj.link && <span>Live Link Added</span>}
                      {proj.github && <span>GitHub Added</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add a Project</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Task Orchestrator"
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Live Demo URL</label>
                <input
                  type="text"
                  placeholder="https://myproject.com"
                  value={newProj.link}
                  onChange={(e) => setNewProj({ ...newProj, link: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Repo URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/..."
                  value={newProj.github}
                  onChange={(e) => setNewProj({ ...newProj, github: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Summary of tech stack, problem solved, and impact..."
                  value={newProj.description}
                  onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                ></textarea>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddProject}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Projects</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 6: Photo & Resume */}
      {activeTab === 'media' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar upload */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Profile Photo</h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                {user?.profileImage ? (
                  <img
                    src={getMediaUrl(user.profileImage)}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div className="space-y-2">
                <label className="cursor-pointer px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5">
                  {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{uploadingAvatar ? 'Uploading...' : 'Upload New Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
                <p className="text-[11px] text-slate-400">JPG, PNG, WebP up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Resume upload */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Resume / CV Document</h3>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>
                  {authProfile?.resumeOriginalName || 'No resume file uploaded yet'}
                </span>
              </div>

              <label className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5">
                {uploadingResume ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploadingResume ? 'Uploading...' : 'Upload PDF / DOCX'}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="hidden"
                  disabled={uploadingResume}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;
