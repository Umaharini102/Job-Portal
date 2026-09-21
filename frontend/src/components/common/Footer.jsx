import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Shield, Globe, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl text-slate-900">
                Job<span className="text-brand-600">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              The modern professional network connecting exceptional talent with world-class opportunities.
              Build your career, hire top talent, and empower teams.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Verified Employers
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-brand-500" /> Global Roles
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/jobs" className="hover:text-brand-600 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-brand-600 transition-colors">Hiring Companies</Link></li>
              <li><Link to="/register" className="hover:text-brand-600 transition-colors">Create Profile</Link></li>
              <li><Link to="/saved-jobs" className="hover:text-brand-600 transition-colors">Saved Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">For Recruiters</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/recruiter/post-job" className="hover:text-brand-600 transition-colors">Post a Job</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-brand-600 transition-colors">Recruiter Portal</Link></li>
              <li><Link to="/recruiter/applicants" className="hover:text-brand-600 transition-colors">Candidate Search</Link></li>
              <li><Link to="/recruiter/analytics" className="hover:text-brand-600 transition-colors">Hiring Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><span className="text-slate-400 cursor-not-allowed">About Us</span></li>
              <li><span className="text-slate-400 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="text-slate-400 cursor-not-allowed">Terms of Service</span></li>
              <li><span className="text-slate-400 cursor-not-allowed">Support & Help</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JobConnect Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for modern professionals.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
