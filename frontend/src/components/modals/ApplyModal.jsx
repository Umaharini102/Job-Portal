import React, { useState } from 'react';
import Modal from '../common/Modal';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';

const ApplyModal = ({ isOpen, onClose, job, onApplicationSubmitted }) => {
  const { profile } = useAuth();
  const toast = useToast();
  const [useProfileResume, setUseProfileResume] = useState(!!profile?.resume);
  const [uploadedResumePath, setUploadedResumePath] = useState('');
  const [uploadedResumeName, setUploadedResumeName] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error('Please upload a PDF or DOC/DOCX document');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setIsUploading(true);
    try {
      const res = await API.post('/profiles/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setUploadedResumePath(res.data.resume);
        setUploadedResumeName(res.data.resumeOriginalName || file.name);
        setUseProfileResume(false);
        toast.success('Resume uploaded successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalResume = '';
    let finalName = '';

    if (useProfileResume && profile?.resume) {
      finalResume = profile.resume;
      finalName = profile.resumeOriginalName || 'Profile_Resume.pdf';
    } else if (uploadedResumePath) {
      finalResume = uploadedResumePath;
      finalName = uploadedResumeName;
    } else {
      toast.warning('Please provide or upload a resume to proceed');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await API.post('/applications', {
        jobId: job._id,
        resume: finalResume,
        resumeOriginalName: finalName,
        coverLetter,
      });

      if (res.data.success) {
        toast.success('Application submitted successfully!');
        if (onApplicationSubmitted) onApplicationSubmitted();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to ${job?.companyName}`}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h4 className="font-bold text-slate-900 text-base">{job?.title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {job?.location} • {job?.jobType} • {job?.workMode}
          </p>
        </div>

        {/* Resume Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Resume / CV <span className="text-rose-500">*</span>
          </label>

          {profile?.resume && (
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="resumeOption"
                checked={useProfileResume}
                onChange={() => setUseProfileResume(true)}
                className="w-4 h-4 text-brand-600 focus:ring-brand-500"
              />
              <FileText className="w-5 h-5 text-brand-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">Use Saved Profile Resume</p>
                <p className="text-xs text-slate-500">
                  {profile.resumeOriginalName || 'Resume from your profile'}
                </p>
              </div>
            </label>
          )}

          {/* Upload new option */}
          <div
            className={`p-4 rounded-xl border-2 border-dashed transition-all ${
              !useProfileResume && uploadedResumePath
                ? 'border-emerald-400 bg-emerald-50/40'
                : 'border-slate-200 hover:border-brand-400'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="resumeOption"
                  checked={!useProfileResume}
                  onChange={() => setUseProfileResume(false)}
                  className="w-4 h-4 text-brand-600"
                />
                <span className="text-sm font-semibold text-slate-800">
                  Upload a New Resume (PDF, DOCX)
                </span>
              </label>

              <label className="cursor-pointer px-3 py-1.5 bg-brand-600 text-white hover:bg-brand-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{isUploading ? 'Uploading...' : 'Browse File'}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {uploadedResumePath && !useProfileResume && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Uploaded: {uploadedResumeName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Cover Letter / Note to Recruiter (Optional)
          </label>
          <textarea
            rows="4"
            placeholder="Introduce yourself, highlight relevant achievements, and share why you are excited for this role..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder:text-slate-400"
          ></textarea>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyModal;
