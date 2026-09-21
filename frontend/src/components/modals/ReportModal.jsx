import React, { useState } from 'react';
import Modal from '../common/Modal';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Loader2 } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, jobId, jobTitle }) => {
  const toast = useToast();
  const [reason, setReason] = useState('Misleading or Incorrect Info');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await API.post('/admin/reports', {
        jobId,
        reason,
        description,
      });

      if (res.data.success) {
        toast.success('Report submitted. Thank you for keeping our platform safe!');
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Job Posting">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-600">
          Reporting job: <span className="font-semibold text-slate-900">{jobTitle}</span>
        </p>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Reason for Report
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
          >
            <option value="Misleading or Incorrect Info">Misleading or Incorrect Info</option>
            <option value="Spam or Scam">Spam or Scam</option>
            <option value="Inappropriate or Offensive Content">Inappropriate or Offensive Content</option>
            <option value="Job Already Expired or Filled">Job Already Expired or Filled</option>
            <option value="Other Policy Violation">Other Policy Violation</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Details (Optional)
          </label>
          <textarea
            rows="3"
            placeholder="Please provide any additional context to assist our moderation team..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
          ></textarea>
        </div>

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
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Submit Report</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportModal;
