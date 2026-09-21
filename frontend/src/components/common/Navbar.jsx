import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API, { getMediaUrl } from '../../services/api';
import {
  Briefcase,
  Search,
  Bell,
  Home,
  FileText,
  Bookmark,
  User,
  PlusCircle,
  BarChart3,
  Users,
  Building,
  Flag,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Poll for unread notifications count if user is logged in
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    const fetchUnread = async () => {
      try {
        const res = await API.get('/notifications');
        if (res.data.success) {
          setUnreadCount(res.data.unreadCount || 0);
        }
      } catch (err) {
        // ignore silently
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 20000); // 20s poll
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdowns on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm'
        : 'bg-white/85 backdrop-blur-sm border-b border-slate-200/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Search */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <Link to={user ? (user.role === 'Admin' ? '/admin/dashboard' : user.role === 'Recruiter' ? '/recruiter/dashboard' : '/home') : '/'} className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:bg-brand-700 transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 hidden sm:inline-block">
                Job<span className="text-brand-600">Connect</span>
              </span>
            </Link>

            {/* Global Search bar */}
            <form onSubmit={handleSearch} className="relative w-full hidden md:block">
              <input
                type="text"
                placeholder="Search jobs, skills, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-full focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </form>
          </div>

          {/* Navigation Links - Role Dependent */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Guest Navigation */}
            {!user && (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/jobs"
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/jobs') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  to="/companies"
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/companies') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Companies
                </Link>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Applications
                </Link>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Profile
                </Link>
                <div className="h-6 w-px bg-slate-200 mx-1.5" />
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Job Seeker Navigation */}
            {user && user.role === 'Job Seeker' && (
              <>
                <Link
                  to="/home"
                  className={`flex flex-col items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/home') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Home className="w-5 h-5 mb-0.5" />
                  <span>Feed</span>
                </Link>
                <Link
                  to="/jobs"
                  className={`flex flex-col items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/jobs') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-5 h-5 mb-0.5" />
                  <span>Jobs</span>
                </Link>
                <Link
                  to="/companies"
                  className={`flex flex-col items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/companies') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="w-5 h-5 mb-0.5" />
                  <span>Companies</span>
                </Link>
                <Link
                  to="/applications"
                  className={`flex flex-col items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/applications') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-5 h-5 mb-0.5" />
                  <span>Applied</span>
                </Link>
                <Link
                  to="/saved-jobs"
                  className={`flex flex-col items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/saved-jobs') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bookmark className="w-5 h-5 mb-0.5" />
                  <span>Saved</span>
                </Link>
                <Link
                  to="/notifications"
                  className={`relative flex flex-col items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/notifications') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bell className="w-5 h-5 mb-0.5" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-2.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Recruiter Navigation */}
            {user && user.role === 'Recruiter' && (
              <>
                <Link
                  to="/recruiter/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/recruiter/dashboard') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/recruiter/jobs"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/recruiter/jobs') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Manage Jobs</span>
                </Link>
                <Link
                  to="/recruiter/applicants"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/recruiter/applicants') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Applicants</span>
                </Link>
                <Link
                  to="/companies"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/companies') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Companies</span>
                </Link>
                <Link
                  to="/recruiter/post-job"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-all ml-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Job</span>
                </Link>
              </>
            )}

            {/* Admin Navigation */}
            {user && user.role === 'Admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/dashboard') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/users') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Users</span>
                </Link>
                <Link
                  to="/admin/recruiters"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/recruiters') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Recruiters</span>
                </Link>
                <Link
                  to="/admin/jobs"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/jobs') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Jobs</span>
                </Link>
                <Link
                  to="/admin/companies"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/companies') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Companies</span>
                </Link>
                <Link
                  to="/admin/applications"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/applications') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Apps</span>
                </Link>
                <Link
                  to="/admin/reports"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/reports') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Reports</span>
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/analytics') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </Link>
              </>
            )}

            {/* Profile Dropdown (If Logged In) */}
            {user && (
              <div className="relative ml-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300">
                    {user.profileImage ? (
                      <img
                        src={getMediaUrl(user.profileImage)}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 bg-brand-100 text-brand-700">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'Job Seeker' && (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>View Profile</span>
                        </Link>
                        <Link
                          to="/profile/edit"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Edit Profile</span>
                        </Link>
                      </>
                    )}

                    {user.role === 'Recruiter' && (
                      <Link
                        to="/recruiter/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Building className="w-4 h-4 text-slate-400" />
                        <span>Company Profile</span>
                      </Link>
                    )}

                    <Link
                      to="/settings"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Account Settings</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <Link to="/notifications" className="relative p-2 text-slate-600">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-1">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="px-2 pb-2">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg outline-none"
              />
            </form>

            {!user ? (
              <div className="flex flex-col gap-1 px-2 pt-2">
                <Link to="/jobs" className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100">
                  Explore Jobs
                </Link>
                <Link to="/companies" className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100">
                  Companies
                </Link>
                <Link to="/login" className="px-3 py-2 text-sm font-semibold text-brand-600">
                  Sign In
                </Link>
                <Link to="/register" className="px-3 py-2 text-sm font-semibold bg-brand-600 text-white rounded-lg text-center">
                  Join Now
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1 px-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email} ({user.role})</p>
                </div>

                {user.role === 'Job Seeker' && (
                  <>
                    <Link to="/home" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Feed / Recommendations</Link>
                    <Link to="/jobs" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Search Jobs</Link>
                    <Link to="/companies" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Companies</Link>
                    <Link to="/applications" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Applied Jobs</Link>
                    <Link to="/saved-jobs" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Saved Jobs</Link>
                    <Link to="/profile" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">My Profile</Link>
                  </>
                )}

                {user.role === 'Recruiter' && (
                  <>
                    <Link to="/recruiter/dashboard" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Dashboard</Link>
                    <Link to="/recruiter/post-job" className="px-3 py-2 text-sm font-semibold text-brand-600">Post a Job</Link>
                    <Link to="/recruiter/jobs" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Posted Jobs</Link>
                    <Link to="/companies" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Companies</Link>
                    <Link to="/recruiter/applicants" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Applicants</Link>
                    <Link to="/recruiter/profile" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Company Profile</Link>
                  </>
                )}

                {user.role === 'Admin' && (
                  <>
                    <Link to="/admin/dashboard" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Admin Dashboard</Link>
                    <Link to="/admin/users" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Manage Users</Link>
                    <Link to="/admin/recruiters" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Manage Recruiters</Link>
                    <Link to="/admin/jobs" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Manage Jobs</Link>
                    <Link to="/admin/companies" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Company Directory</Link>
                    <Link to="/admin/applications" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Platform Applications</Link>
                    <Link to="/admin/reports" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Reports</Link>
                    <Link to="/admin/analytics" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Platform Analytics</Link>
                  </>
                )}

                <Link to="/settings" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100">Account Settings</Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-sm font-medium text-rose-600 text-left rounded-lg hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
