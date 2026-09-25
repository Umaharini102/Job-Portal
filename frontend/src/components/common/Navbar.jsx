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
        ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC9] shadow-sm'
        : 'bg-[#FAF7F2]/85 backdrop-blur-sm border-b border-[#ECE2D0]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Search */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <Link
              to={user ? (user.role === 'Admin' ? '/admin/dashboard' : user.role === 'Recruiter' ? '/recruiter/dashboard' : '/home') : '/'}
              className="flex items-center gap-2.5 flex-shrink-0 group"
              title="Career Simulation Engine"
            >
              <div className="w-10 h-10 rounded-xl bg-charcoal-900 border border-charcoal-700 flex items-center justify-center text-white font-black text-sm tracking-wider shadow-md group-hover:border-brand-500 transition-colors">
                <span className="text-brand-500">CS</span>E
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-charcoal-950 leading-tight">
                  Career Simulation Engine
                </span>
                <span className="text-[10px] font-mono tracking-wider text-charcoal-500 font-semibold hidden lg:block">
                  Next-Gen Career Platform
                </span>
              </div>
            </Link>

            {/* Global Search bar */}
            <form onSubmit={handleSearch} className="relative w-full hidden xl:block max-w-xs ml-2">
              <input
                type="text"
                placeholder="Search jobs, skills, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-white/90 border border-[#E2D6C0] rounded-full focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-charcoal-400 text-charcoal-900"
              />
              <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5 pointer-events-none" />
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
                    isActive('/') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/jobs"
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/jobs') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  to="/companies"
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/companies') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  Companies
                </Link>
                <a
                  href="/#career-simulation"
                  className="px-3 py-2 text-sm font-semibold text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Career</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                </a>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-semibold text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6] rounded-lg transition-colors"
                >
                  Applications
                </Link>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-semibold text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6] rounded-lg transition-colors"
                >
                  Profile
                </Link>
                <div className="h-5 w-px bg-[#E2D6C0] mx-1.5" />
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-charcoal-900 hover:text-brand-600 hover:bg-[#F3EFE6] rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02]"
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
                    isActive('/home') ? 'text-brand-600 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Home className="w-4 h-4 mb-0.5" />
                  <span>Feed</span>
                </Link>
                <Link
                  to="/jobs"
                  className={`flex flex-col items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/jobs') ? 'text-brand-600 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Briefcase className="w-4 h-4 mb-0.5" />
                  <span>Jobs</span>
                </Link>
                <Link
                  to="/companies"
                  className={`flex flex-col items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/companies') ? 'text-brand-600 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Building className="w-4 h-4 mb-0.5" />
                  <span>Companies</span>
                </Link>
                <a
                  href="/#career-simulation"
                  className="flex flex-col items-center px-3 py-1.5 text-xs font-semibold text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6] rounded-lg transition-colors"
                >
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-brand-500">✦</span>
                  <span>Career</span>
                </a>
                <Link
                  to="/applications"
                  className={`flex flex-col items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/applications') ? 'text-brand-600 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <FileText className="w-4 h-4 mb-0.5" />
                  <span>Applications</span>
                </Link>
                <Link
                  to="/saved-jobs"
                  className={`flex flex-col items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/saved-jobs') ? 'text-brand-600 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Bookmark className="w-4 h-4 mb-0.5" />
                  <span>Saved</span>
                </Link>
                <Link
                  to="/notifications"
                  className={`relative flex flex-col items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/notifications') ? 'text-brand-600 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Bell className="w-4 h-4 mb-0.5" />
                  <span>Alerts</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-2.5 w-4 h-4 bg-coral-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
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
                    isActive('/recruiter/dashboard') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/recruiter/jobs"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/recruiter/jobs') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Manage Jobs</span>
                </Link>
                <Link
                  to="/recruiter/applicants"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/recruiter/applicants') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Applicants</span>
                </Link>
                <Link
                  to="/companies"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive('/companies') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Companies</span>
                </Link>
                <Link
                  to="/recruiter/post-job"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-600/20 transition-all ml-1"
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
                    isActive('/admin/dashboard') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/users') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Users</span>
                </Link>
                <Link
                  to="/admin/recruiters"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/recruiters') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Recruiters</span>
                </Link>
                <Link
                  to="/admin/jobs"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/jobs') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Jobs</span>
                </Link>
                <Link
                  to="/admin/companies"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/companies') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Companies</span>
                </Link>
                <Link
                  to="/admin/applications"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/applications') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Apps</span>
                </Link>
                <Link
                  to="/admin/reports"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/reports') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Reports</span>
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive('/admin/analytics') ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F3EFE6]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </Link>
              </>
            )}

            {/* Profile Dropdown (If Logged In) */}
            {user && (
              <div className="relative ml-2 pl-2 border-l border-[#E2D6C0]">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-[#F3EFE6] transition-colors focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-[#EAE2D2] flex-shrink-0 border border-[#D5C7AF]">
                    {user.profileImage ? (
                      <img
                        src={getMediaUrl(user.profileImage)}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-brand-700 bg-brand-100">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#E8DFC9] py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-[#F0E8D8]">
                      <p className="text-sm font-bold text-charcoal-900 truncate">{user.name}</p>
                      <p className="text-xs text-charcoal-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'Job Seeker' && (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-700 hover:bg-[#FAF7F2] hover:text-brand-600 transition-colors"
                        >
                          <User className="w-4 h-4 text-charcoal-400" />
                          <span>View Profile</span>
                        </Link>
                        <Link
                          to="/profile/edit"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-700 hover:bg-[#FAF7F2] hover:text-brand-600 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-charcoal-400" />
                          <span>Edit Profile</span>
                        </Link>
                      </>
                    )}

                    {user.role === 'Recruiter' && (
                      <Link
                        to="/recruiter/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-700 hover:bg-[#FAF7F2] hover:text-brand-600 transition-colors"
                      >
                        <Building className="w-4 h-4 text-charcoal-400" />
                        <span>Company Profile</span>
                      </Link>
                    )}

                    <Link
                      to="/settings"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-700 hover:bg-[#FAF7F2] hover:text-brand-600 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-charcoal-400" />
                      <span>Account Settings</span>
                    </Link>

                    <div className="border-t border-[#F0E8D8] my-1" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-coral-600 hover:bg-coral-50 transition-colors text-left font-medium"
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
              <Link to="/notifications" className="relative p-2 text-charcoal-700">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-coral-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal-800 hover:text-charcoal-950 rounded-xl hover:bg-[#F3EFE6]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8DFC9] py-3 space-y-1 bg-[#FAF7F2]">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="px-2 pb-2">
              <input
                type="text"
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-white border border-[#E2D6C0] rounded-xl outline-none text-charcoal-900"
              />
            </form>

            {!user ? (
              <div className="flex flex-col gap-1 px-2 pt-2">
                <Link to="/jobs" className="px-3 py-2 text-sm font-semibold text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">
                  Explore Jobs
                </Link>
                <Link to="/companies" className="px-3 py-2 text-sm font-semibold text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">
                  Companies
                </Link>
                <a href="/#career-simulation" className="px-3 py-2 text-sm font-semibold text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">
                  Career Simulation
                </a>
                <Link to="/login" className="px-3 py-2 text-sm font-bold text-charcoal-900 hover:text-brand-600">
                  Sign In
                </Link>
                <Link to="/register" className="px-3 py-2.5 text-sm font-bold bg-brand-600 text-white rounded-xl text-center shadow-md">
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1 px-2">
                <div className="px-3 py-2 border-b border-[#E8DFC9] mb-1">
                  <p className="font-bold text-charcoal-950">{user.name}</p>
                  <p className="text-xs text-charcoal-500">{user.email} ({user.role})</p>
                </div>

                {user.role === 'Job Seeker' && (
                  <>
                    <Link to="/home" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Feed / Recommendations</Link>
                    <Link to="/jobs" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Search Jobs</Link>
                    <Link to="/companies" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Companies</Link>
                    <a href="/#career-simulation" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Career Simulation</a>
                    <Link to="/applications" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Applied Jobs</Link>
                    <Link to="/saved-jobs" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Saved Jobs</Link>
                    <Link to="/profile" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">My Profile</Link>
                  </>
                )}

                {user.role === 'Recruiter' && (
                  <>
                    <Link to="/recruiter/dashboard" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Dashboard</Link>
                    <Link to="/recruiter/post-job" className="px-3 py-2 text-sm font-bold text-brand-600">Post a Job</Link>
                    <Link to="/recruiter/jobs" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Posted Jobs</Link>
                    <Link to="/companies" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Companies</Link>
                    <Link to="/recruiter/applicants" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Applicants</Link>
                    <Link to="/recruiter/profile" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Company Profile</Link>
                  </>
                )}

                {user.role === 'Admin' && (
                  <>
                    <Link to="/admin/dashboard" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Admin Dashboard</Link>
                    <Link to="/admin/users" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Manage Users</Link>
                    <Link to="/admin/recruiters" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Manage Recruiters</Link>
                    <Link to="/admin/jobs" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Manage Jobs</Link>
                    <Link to="/admin/companies" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Company Directory</Link>
                    <Link to="/admin/applications" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Platform Applications</Link>
                    <Link to="/admin/reports" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Reports</Link>
                    <Link to="/admin/analytics" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Platform Analytics</Link>
                  </>
                )}

                <Link to="/settings" className="px-3 py-2 text-sm font-medium text-charcoal-800 rounded-xl hover:bg-[#F3EFE6]">Account Settings</Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-sm font-bold text-coral-600 text-left rounded-xl hover:bg-coral-50"
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
