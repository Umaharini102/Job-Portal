import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StatCard from '../../components/cards/StatCard';
import {
  Users,
  Briefcase,
  FileText,
  Flag,
  Shield,
  BarChart3,
  TrendingUp,
  Building,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#0a66c2', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/analytics');
        if (res.data.success) {
          setStats(res.data.stats);
          setCharts(res.data.charts);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Admin Platform Control
            </h1>
            <span className="px-2.5 py-0.5 bg-brand-100 text-brand-800 text-xs font-bold rounded-full">
              Super Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global system health, user verification, job moderation, and platform activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/companies"
            className="px-4 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Manage Companies</span>
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/reports"
            className="px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Reports ({stats?.pendingReports || 0})</span>
          </Link>
        </div>
      </div>

      {/* Primary Platform Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="blue"
          subtitle={`${stats?.totalSeekers || 0} Seekers • ${stats?.totalRecruiters || 0} Recruiters`}
        />
        <StatCard
          title="Total Job Postings"
          value={stats?.totalJobs || 0}
          icon={Briefcase}
          color="purple"
          subtitle={`${stats?.activeJobs || 0} Active • ${stats?.closedJobs || 0} Closed`}
        />
        <StatCard
          title="Applications Sent"
          value={stats?.totalApplications || 0}
          icon={FileText}
          color="emerald"
          subtitle="Platform-wide"
        />
        <StatCard
          title="Pending Reports"
          value={stats?.pendingReports || 0}
          icon={Flag}
          color={stats?.pendingReports > 0 ? 'rose' : 'emerald'}
          subtitle={stats?.pendingReports > 0 ? 'Action required' : 'All clear'}
        />
      </div>

      {/* Company Ecosystem Stats (Requirement #15) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Company Ecosystem Overview
            </h2>
          </div>
          <Link
            to="/admin/companies"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Open Company Directory & Actions →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Companies"
            value={stats?.totalCompanies || 0}
            icon={Building}
            color="blue"
            subtitle="Registered & Seeded"
          />
          <StatCard
            title="Indian Companies"
            value={stats?.indianCompanies || 0}
            icon={Building}
            color="emerald"
            subtitle="Domestic Enterprises"
          />
          <StatCard
            title="MNCs"
            value={stats?.mncCompanies || 0}
            icon={Building}
            color="purple"
            subtitle="Global Leaders in India"
          />
          <StatCard
            title="Companies with Active Jobs"
            value={stats?.companiesWithActiveJobs || 0}
            icon={Briefcase}
            color="amber"
            subtitle="Actively Hiring"
          />
        </div>
      </div>

      {/* Platform Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User & Job Growth AreaChart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Platform Activity Velocity</h3>
              <p className="text-xs text-slate-500">Estimated registrations, jobs, and applications</p>
            </div>
            <TrendingUp className="w-4 h-4 text-brand-600" />
          </div>

          <div className="h-72 w-full pt-4">
            {charts?.monthlyData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.monthlyData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0a66c2" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0a66c2" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#0a66c2" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                  <Area type="monotone" dataKey="applications" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">Loading growth metrics...</div>
            )}
          </div>
        </div>

        {/* Workplace Mode Donut */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Workplace Modes</h3>
              <p className="text-xs text-slate-500">Distribution of active postings</p>
            </div>
            <BarChart3 className="w-4 h-4 text-brand-600" />
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            {charts?.jobsByWorkMode && charts.jobsByWorkMode.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.jobsByWorkMode}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {charts.jobsByWorkMode.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No workplace data recorded</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
