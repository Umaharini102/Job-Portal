import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Lock, Mail, Loader2, Shield, User, Building } from 'lucide-react';

const LoginPage = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectUserByRole = (role) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login' && from !== '/register') {
      navigate(from, { replace: true });
      return;
    }
    if (role === 'Admin') navigate('/admin/dashboard', { replace: true });
    else if (role === 'Recruiter') navigate('/recruiter/dashboard', { replace: true });
    else navigate('/home', { replace: true });
  };

  const handleStandardSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      redirectUserByRole(result.user.role);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    setDemoLoading(role);
    setErrorMessage('');
    const result = await quickLogin(role);
    setDemoLoading(null);

    if (result.success) {
      redirectUserByRole(result.user.role);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Job<span className="text-brand-600">Connect</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="text-sm text-slate-500">
            Stay updated on your professional world and opportunities
          </p>
        </div>

        {/* Generic Evaluation Demo Accounts Box */}
        <div className="bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand-600" />
              Demo Testing Accounts
            </span>
          </div>
          <p className="text-xs text-brand-800 leading-relaxed">
            Test platform features using generic evaluation accounts, or register dynamically:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Recruiter')}
              disabled={!!demoLoading || loading}
              className="px-2 py-2 text-xs font-bold rounded-xl bg-white border border-brand-200 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex flex-col items-center gap-1 text-center"
            >
              <Building className="w-4 h-4" />
              <span>Recruiter Demo</span>
              <span className="text-[10px] opacity-75 font-normal">recruiter@jobconnect.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Admin')}
              disabled={!!demoLoading || loading}
              className="px-2 py-2 text-xs font-bold rounded-xl bg-white border border-brand-200 text-slate-800 hover:bg-slate-900 hover:text-white transition-all shadow-sm flex flex-col items-center gap-1 text-center"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Demo</span>
              <span className="text-[10px] opacity-75 font-normal">admin@jobconnect.com</span>
            </button>
          </div>
          <div className="pt-1 text-center border-t border-brand-200/50">
            <span className="text-xs text-slate-600">
              Job Seekers register dynamically:{' '}
              <Link to="/register" className="font-bold text-brand-700 hover:underline">
                Create Seeker Account &rarr;
              </Link>
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleStandardSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!demoLoading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-sm text-slate-600">
              New to JobConnect?{' '}
              <Link to="/register" className="font-bold text-brand-600 hover:underline">
                Join now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
