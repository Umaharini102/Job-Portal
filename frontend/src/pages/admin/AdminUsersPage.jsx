import React, { useState, useEffect, useCallback } from 'react';
import API, { getMediaUrl } from '../../services/api';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Trash2,
  Power,
  Shield,
  User,
  Building,
  Mail,
  MapPin,
} from 'lucide-react';

const AdminUsersPage = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      params.append('page', currentPage);
      params.append('limit', '10');

      const res = await API.get(`/users?${params.toString()}`);
      if (res.data.success) {
        setUsers(res.data.users);
        setTotalUsers(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await API.put(`/users/${id}/toggle-status`);
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isActive: res.data.isActive } : u))
        );
      }
    } catch (err) {
      toast.error('Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure? This will delete the user and all their profiles, jobs, or applications.')) {
      return;
    }

    try {
      const res = await API.delete(`/users/${id}`);
      if (res.data.success) {
        toast.info('User removed');
        setUsers(users.filter((u) => u._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">User Directory & Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, deactivate, or moderate Job Seekers, Recruiters, and Admins
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Role Filter:</span>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          >
            <option value="">All Roles</option>
            <option value="Job Seeker">Job Seeker</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-white rounded-2xl border border-slate-200 animate-pulse p-4"></div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No users found</h3>
          <p className="text-xs text-slate-500">No users match your current search criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-brand-600 flex-shrink-0">
                          {u.profileImage ? (
                            <img src={getMediaUrl(u.profileImage)} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            u.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                          {u.location && (
                            <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {u.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <p className="font-medium">{u.email}</p>
                      {u.phone && <p className="text-slate-400 mt-0.5">{u.phone}</p>}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'Admin'
                          ? 'bg-slate-900 text-white'
                          : u.role === 'Recruiter'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-brand-50 text-brand-700 border border-brand-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {u.role !== 'Admin' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(u._id)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title={u.isActive ? 'Deactivate user' : 'Reactivate user'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
