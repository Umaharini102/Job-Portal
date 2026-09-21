import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StatCard from '../../components/cards/StatCard';
import Badge from '../../components/common/Badge';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  BarChart3,
  Calendar,
  ArrowRight,
  TrendingUp,
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
} from 'recharts';

const COLORS = ['#0a66c2', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const RecruiterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, applicantsRes] = await Promise.all([
          API.get('/admin/recruiter-analytics'),
          API.get('/applications/recruiter'),
        ]);

        if (analyticsRes.data.success) {
          setStats(analyticsRes.data.stats);
          setCharts(analyticsRes.data.charts);
        }
        if (applicantsRes.data.success) {
          setRecentApplicants(applicantsRes.data.applications.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching recruiter dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Recruiter Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Overview of your active job listings, incoming candidate applications, and hiring metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/post-job"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a New Job</span>
          </Link>
          <Link
            to="/recruiter/applicants"
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Review Candidates
          </Link>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Posted Jobs"
          value={stats?.totalJobs || 0}
          icon={Briefcase}
          color="blue"
          subtitle={`${stats?.activeJobs || 0} currently active`}
        />
        <StatCard
          title="Total Applicants"
          value={stats?.totalApplicants || 0}
          icon={Users}
          color="purple"
          subtitle="Across all postings"
        />
        <StatCard
          title="Shortlisted"
          value={stats?.shortlistedCount || 0}
          icon={Clock}
          color="amber"
          subtitle="Ready for review"
        />
        <StatCard
          title="Selected / Hired"
          value={stats?.selectedCount || 0}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Offer accepted"
        />
      </div>

      {/* Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Applications Trend (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Application Volume Trend</h3>
              <p className="text-xs text-slate-500">Applicant inflows over the past months</p>
            </div>
            <TrendingUp className="w-4 h-4 text-brand-600" />
          </div>

          <div className="h-64 w-full pt-4">
            {charts?.monthlyTrends ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="applications" fill="#0a66c2" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">Loading chart data...</div>
            )}
          </div>
        </div>

        {/* Applications Status Distribution Donut (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pipeline Status</h3>
              <p className="text-xs text-slate-500">Candidate distribution by stage</p>
            </div>
            <BarChart3 className="w-4 h-4 text-brand-600" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {charts?.statusDistribution && charts.statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.statusDistribution}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {charts.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No application stages recorded yet</div>
            )}
          </div>

          {charts?.statusDistribution && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-slate-600">
              {charts.statusDistribution.map((item, idx) => (
                <span key={idx} className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span>{item._id}: {item.count}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Candidates List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Candidate Submissions</h3>
            <p className="text-xs text-slate-500">Latest applicants awaiting your review</p>
          </div>
          <Link
            to="/recruiter/applicants"
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            <span>View All Applicants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApplicants.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">No candidates have applied yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Job Title</th>
                  <th className="pb-3">Applied Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentApplicants.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 font-bold text-slate-900">
                      {app.applicantId?.name || 'Applicant'}
                    </td>
                    <td className="py-3.5 text-slate-700 font-medium">
                      {app.jobId?.title || 'Job Listing'}
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5">
                      <Badge variant={app.status}>{app.status}</Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to={`/recruiter/applicants?jobId=${app.jobId?._id || ''}`}
                        className="text-brand-600 font-bold hover:underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
