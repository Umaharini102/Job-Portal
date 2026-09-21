import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Bell, CheckCheck, Clock, ArrowUpRight, Sparkles, CheckCircle } from 'lucide-react';

const NotificationsPage = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await API.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await API.put(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await API.put('/notifications/mark-all-read');
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay updated on application progress, hiring manager responses, and system alerts
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-brand-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-20 bg-white rounded-2xl border border-slate-200 animate-pulse p-4"></div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Bell className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No notifications yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You're all caught up! New application updates and messages will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                notif.isRead
                  ? 'bg-white border-slate-200'
                  : 'bg-brand-50/40 border-brand-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    notif.type === 'application_status'
                      ? 'bg-emerald-50 text-emerald-600'
                      : notif.type === 'application_received'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-brand-50 text-brand-600'
                  }`}
                >
                  {notif.type === 'application_status' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {notif.link && (
                <Link
                  to={notif.link}
                  className="p-2 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
                  title="View"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
