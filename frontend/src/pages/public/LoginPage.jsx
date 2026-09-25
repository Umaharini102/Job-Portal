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
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-charcoal-900 border border-charcoal-700 flex items-center justify-center text-white font-black text-sm tracking-wider shadow-md">
              <span className="text-brand-500">CS</span>E
            </div>
            <span className="font-extrabold text-xl tracking-tight text-charcoal-950">
              Career Simulation Engine
            </span>
          </Link>
          <h2 className="text-2xl font-black text-charcoal-950">Sign in to your account</h2>
          <p className="text-sm text-charcoal-600">
            Access your simulated pipeline and active career opportunities
          </p>
        </div>

        {/* Evaluation Demo Accounts Box */}
        <div className="bg-[#FAF6EE] border border-[#E2D5BE] rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand-600" />
              Demo Testing Accounts
            </span>
          </div>
          <p className="text-xs text-charcoal-700 leading-relaxed">
            Test platform features using evaluation accounts, or register dynamically:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Recruiter')}
              disabled={!!demoLoading || loading}
              className="px-2 py-2 text-xs font-bold rounded-xl bg-white border border-[#DFD3BE] text-charcoal-800 hover:bg-brand-600 hover:text-white transition-all shadow-sm flex flex-col items-center gap-1 text-center"
            >
              <Building className="w-4 h-4 text-brand-600" />
              <span>Recruiter Demo</span>
              <span className="text-[10px] opacity-75 font-normal">recruiter@jobconnect.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Admin')}
              disabled={!!demoLoading || loading}
              className="px-2 py-2 text-xs font-bold rounded-xl bg-white border border-[#DFD3BE] text-charcoal-800 hover:bg-charcoal-900 hover:text-white transition-all shadow-sm flex flex-col items-center gap-1 text-center"
            >
              <Shield className="w-4 h-4 text-coral-600" />
              <span>Admin Demo</span>
              <span className="text-[10px] opacity-75 font-normal">admin@jobconnect.com</span>
            </button>
          </div>
          <div className="pt-1 text-center border-t border-[#DFD3BE]/60">
            <span className="text-xs text-charcoal-600">
              Job Seekers register dynamically:{' '}
              <Link to="/register" className="font-bold text-brand-600 hover:underline">
                Create Seeker Account &rarr;
              </Link>
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#FDFBF7] p-8 rounded-3xl shadow-xl border border-[#E8DFC9] space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleStandardSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#DFD3BE] rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-charcoal-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#DFD3BE] rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-charcoal-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!demoLoading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="border-t border-[#E8DFC9] pt-4 text-center">
            <p className="text-sm text-charcoal-600">
              New to Career Simulation Engine?{' '}
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
