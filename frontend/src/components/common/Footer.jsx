import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Terminal,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Heart,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-cream-200 border-t border-charcoal-800 mt-20 relative overflow-hidden">
      {/* Subtle warm ambient glow in footer top right */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-lavender-600/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Description (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="flex items-center gap-3 group inline-block">
              <div className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-white font-black text-sm tracking-wider shadow-lg group-hover:border-brand-500 transition-colors">
                <span className="text-brand-500">CS</span>E
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-tight leading-snug">
                  Career Simulation Engine
                </span>
                <span className="text-[11px] font-mono tracking-wider text-charcoal-400 font-medium">
                  Autonomous Career Intelligence & Discovery
                </span>
              </div>
            </Link>

            <p className="text-sm text-cream-300/80 leading-relaxed max-w-sm">
              A premium career navigation platform designed for ambitious talent and forward-thinking companies. Explore opportunities, simulate career trajectories, and connect directly with hiring teams.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-charcoal-800 border border-charcoal-700 hover:border-brand-500 text-cream-200 hover:text-brand-500 flex items-center justify-center transition-colors shadow-sm"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-charcoal-800 border border-charcoal-700 hover:text-brand-500 hover:border-brand-500 text-cream-200 flex items-center justify-center transition-colors shadow-sm"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-xl bg-charcoal-800 border border-charcoal-700 hover:text-brand-500 hover:border-brand-500 text-cream-200 flex items-center justify-center transition-colors shadow-sm"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@careersimulation.com"
                aria-label="Contact Email"
                className="w-9 h-9 rounded-xl bg-charcoal-800 border border-charcoal-700 hover:text-brand-500 hover:border-brand-500 text-cream-200 flex items-center justify-center transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Core Navigation (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <Link to="/jobs" className="hover:text-brand-400 transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-brand-400 transition-colors">
                  Companies
                </Link>
              </li>
              <li>
                <a href="/#career-simulation" className="hover:text-brand-400 transition-colors">
                  Career
                </a>
              </li>
              <li>
                <Link to="/applications" className="hover:text-brand-400 transition-colors">
                  Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruitment & Discovery (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <a href="/#about" className="hover:text-brand-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-brand-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-400 transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-400 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Simulation Quote Card (3 cols) */}
          <div className="md:col-span-3">
            <div className="p-5 rounded-2xl bg-charcoal-800/80 border border-charcoal-700/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-coral-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Your Growth</span>
              </div>
              <p className="text-xs text-cream-300/90 leading-relaxed">
                Connect your skills with active market trends. Discover what you need to become interview-ready.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors pt-1"
              >
                <span>Launch simulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-charcoal-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <p>© {new Date().getFullYear()} Career Simulation Engine. All rights reserved.</p>
          <div className="flex items-center gap-6 text-cream-400/70">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" /> Vetted Roles
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-lavender-400" /> Global Opportunities
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

