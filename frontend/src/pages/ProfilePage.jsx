import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';
import DarkModeToggle from '../components/DarkModeToggle';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const ROLE_DASHBOARDS = {
  Client:         '/dashboard/client',
  SupportOfficer: '/dashboard/support',
  Developer:      '/dashboard/dev',
  Manager:        '/dashboard/manager',
  Admin:          '/dashboard/admin',
};

const ROLE_COLORS = {
  Client:         'bg-blue-100 text-blue-700',
  SupportOfficer: 'bg-yellow-100 text-yellow-700',
  Developer:      'bg-purple-100 text-purple-700',
  Manager:        'bg-indigo-100 text-indigo-700',
  Admin:          'bg-red-100 text-red-700',
};

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName]       = useState(user?.full_name || '');
  const [currentPw, setCurrentPw]     = useState('');
  const [newPw, setNewPw]             = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [success, setSuccess]         = useState('');
  const [error, setError]             = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPw && newPw !== confirmPw) {
      setError('New passwords do not match.');
      return;
    }
    if (newPw && newPw.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setSaving(true);
    try {
      const payload = { full_name: fullName };
      if (newPw) { payload.current_password = currentPw; payload.new_password = newPw; }

      const res = await updateProfile(payload);
      // Update context with new name
      const token = localStorage.getItem('jpa_token');
      login(token, res.data.data);

      setSuccess('Profile updated successfully.');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleDashboard = () => navigate(ROLE_DASHBOARDS[user?.role] || '/login');

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100";
  const readonlyCls = "w-full px-3 py-2.5 border border-gray-100 dark:border-slate-700 rounded-xl text-sm bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-slate-500 cursor-not-allowed";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Topbar */}
      <header className="h-14 bg-gray-900 dark:bg-slate-900 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-bold text-sm">JavaPA</span>
        </div>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <button
            onClick={handleDashboard}
            className="text-white/70 text-sm hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Page content */}
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* User identity card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm px-6 py-5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0">
              {getInitials(user?.full_name)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user?.full_name}</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">{user?.email}</p>
              <span className={`inline-flex items-center gap-1.5 mt-1 text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[user?.role] || 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleDashboard}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:bg-slate-900 hover:border-blue-300 hover:text-blue-600 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            {user?.role} Dashboard
          </button>
        </div>

        {/* Account Details */}
        <form onSubmit={handleSave}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm px-6 py-5 mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-4">Account Details</h3>

            {success && (
              <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                ✓ {success}
              </div>
            )}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Full Name — editable */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Your full name" className={inputCls}
                />
              </div>

              {/* Email — read-only */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1.5">Email</label>
                <input type="email" value={user?.email || ''} readOnly className={readonlyCls} />
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Cannot change email</p>
              </div>

              {/* Role — read-only */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1.5">Role</label>
                <input type="text" value={user?.role || ''} readOnly className={readonlyCls} />
              </div>

              {/* Member since — read-only */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1.5">Member Since</label>
                <input
                  type="text"
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                  readOnly className={readonlyCls}
                />
              </div>
            </div>
          </div>

          {/* Security + Account Actions */}
          <div className="grid grid-cols-2 gap-4 mb-4">

            {/* Security — change password */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm px-6 py-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-4">Security</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                      placeholder="Enter current password" className={inputCls}
                    />
                    <button type="button" onClick={() => setShowCurrent(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {showCurrent
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPw} onChange={e => setNewPw(e.target.value)}
                      placeholder="Enter new password" className={inputCls}
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {showNew
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                  <input
                    type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                    placeholder="Confirm new password" className={inputCls}
                  />
                  {confirmPw && newPw !== confirmPw && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm px-6 py-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-4">Account Actions</h3>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 border-2 border-red-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-colors text-sm"
                >
                  Log out
                </button>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700">
                  <p className="text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Session Info</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Role: <span className="font-medium text-gray-600 dark:text-slate-300">{user?.role}</span></p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Status: <span className="text-emerald-600 font-medium">● Active</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm shadow-lg shadow-blue-200"
            >
              {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
