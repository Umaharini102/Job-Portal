import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import API from '../../services/api';
import { Lock, Shield, User, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await API.put('/auth/updatepassword', {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Account Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your account credentials, security preferences, and details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Details Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            <span>Profile Summary</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Name</p>
              <p className="font-bold text-slate-900 mt-0.5">{user?.name}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Email</p>
              <p className="font-bold text-slate-900 mt-0.5">{user?.email}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Role</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-brand-50 text-brand-700 font-bold rounded-full border border-brand-200">
                {user?.role}
              </span>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Account Status</p>
              <span className="inline-flex items-center gap-1 mt-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active & Verified
              </span>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Member Since</p>
              <p className="font-semibold text-slate-700 mt-0.5">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-brand-600" />
            <span>Security & Password</span>
          </h3>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
