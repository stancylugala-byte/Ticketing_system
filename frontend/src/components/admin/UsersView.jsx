import { useEffect, useState, useCallback } from 'react';
import { getUsers as adminGetUsers, createUser as adminCreateUser, updateUser as adminUpdateUser, deleteUser as adminDeleteUser } from '../../api/adminApi';
import { getUsers as managerGetUsers, createUser as managerCreateUser, updateUser as managerUpdateUser, deleteUser as managerDeleteUser } from '../../api/managerApi';
import { useAuth } from '../../context/AuthContext';

const CREATABLE_ROLES = ['Client', 'SupportOfficer', 'Developer', 'Manager'];
const ADMIN_ROLES     = ['Client', 'SupportOfficer', 'Developer', 'Manager', 'Admin'];

const ROLE_BADGE = {
  Client:         'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  SupportOfficer: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  Developer:      'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
  Manager:        'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
  Admin:          'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
};

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}
function timeAgo(d) {
  if (!d) return '—';
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

const INP = 'w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 transition-colors';

// ── Shared User Form (used for both Add and Edit) ─────────────────────────────
function UserForm({ initial, isEdit, isManager, onSuccess, onCancel }) {
  const roleOptions = isManager ? CREATABLE_ROLES : ADMIN_ROLES;
  const [form,    setForm]    = useState(initial || { full_name: '', email: '', password: '', role: 'Client' });
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [showPw,  setShowPw]  = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.full_name.trim()) return setError('Full name is required');
    if (!form.email.trim())     return setError('Email is required');
    if (!isEdit && form.password.length < 6) return setError('Password must be at least 6 characters');
    if (isEdit && form.password && form.password.length < 6) return setError('New password must be at least 6 characters');
    setSaving(true);
    try {
      await onSuccess(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="px-3 py-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-xs text-red-700 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">Full Name <span className="text-red-500">*</span></label>
          <input className={INP} placeholder="Jane Doe" value={form.full_name} onChange={e => set('full_name', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">Email <span className="text-red-500">*</span></label>
          <input type="email" className={INP} placeholder="jane@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
            {isEdit ? 'New Password' : 'Password'} {!isEdit && <span className="text-red-500">*</span>}
            {isEdit && <span className="text-gray-400 dark:text-slate-500 font-normal"> (leave blank to keep current)</span>}
          </label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              className={INP + ' pr-9'}
              placeholder={isEdit ? 'Leave blank to keep current' : 'Min. 6 characters'}
              value={form.password}
              onChange={e => set('password', e.target.value)}
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {showPw
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                }
              </svg>
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">Role <span className="text-red-500">*</span></label>
          <select className={INP} value={form.role} onChange={e => set('role', e.target.value)}>
            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-1">
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2">
          {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {saving ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : '+ Create User')}
        </button>
      </div>
    </form>
  );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Main UsersView ─────────────────────────────────────────────────────────────
export default function UsersView({ roleFilter, label }) {
  const { user: currentUser } = useAuth();
  const isManager = currentUser?.role === 'Manager';

  const apiCalls = {
    getUsers:   isManager ? managerGetUsers   : adminGetUsers,
    createUser: isManager ? managerCreateUser : adminCreateUser,
    updateUser: isManager ? managerUpdateUser : adminUpdateUser,
    deleteUser: isManager ? managerDeleteUser : adminDeleteUser,
  };

  const [users,    setUsers]    = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showAdd,  setShowAdd]  = useState(false);
  const [editUser, setEditUser] = useState(null);   // user object being edited
  const [confirm,  setConfirm]  = useState(null);   // user id pending delete

  const load = useCallback(() => {
    setLoading(true);
    apiCalls.getUsers({ role: roleFilter, search, page, limit: 15 })
      .then(r => { setUsers(r.data.data.users); setTotal(r.data.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, search, page, isManager]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (form) => {
    await apiCalls.createUser(form);
    setShowAdd(false);
    load();
  };

  const handleUpdate = async (form) => {
    const payload = { full_name: form.full_name, email: form.email, role: form.role };
    if (form.password) payload.password = form.password;
    await apiCalls.updateUser(editUser.id, payload);
    setEditUser(null);
    load();
  };

  const handleDelete = async (id) => {
    try {
      await apiCalls.deleteUser(id);
      setConfirm(null);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed');
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / 15));

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{label}</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">{total} {label.toLowerCase()} registered</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            className="px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-400 bg-white dark:bg-slate-800 dark:text-slate-100 w-52 placeholder-gray-400 dark:placeholder-slate-500"
            placeholder={`Search ${label.toLowerCase()}...`}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_130px_90px_110px] px-5 py-2.5 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <span>User</span><span>Email</span><span>Role</span><span>Joined</span><span>Actions</span>
        </div>

        {loading ? (
          <div className="p-4 flex flex-col gap-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse" />)}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400 dark:text-slate-500 gap-2">
            <span className="text-3xl">👥</span>
            <p className="text-sm">No {label.toLowerCase()} found</p>
          </div>
        ) : users.map(u => (
          <div key={u.id} className="grid grid-cols-[1fr_1fr_130px_90px_110px] items-center px-5 py-3.5 border-b border-gray-100 dark:border-slate-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                {getInitials(u.full_name)}
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{u.full_name}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400 truncate pr-3">{u.email}</span>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${ROLE_BADGE[u.role] || 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}>
              {u.role}
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-500">{timeAgo(u.created_at)}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setEditUser({ ...u, password: '' })}
                className="px-2.5 py-1.5 text-[11px] font-semibold border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirm(u.id)}
                className="px-2.5 py-1.5 text-[11px] font-semibold border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 hover:text-red-600 dark:hover:text-red-400 transition-all"
              >
                Del
              </button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <span className="text-xs text-gray-400 dark:text-slate-500">Showing {users.length} of {total}</span>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              ← Prev
            </button>
            <span className="text-xs text-gray-500 dark:text-slate-400 px-1">{page}/{totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* ── Add User Modal ── */}
      {showAdd && (
        <Modal title="Add New User" onClose={() => setShowAdd(false)}>
          <UserForm
            isEdit={false}
            isManager={isManager}
            onSuccess={handleCreate}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {/* ── Edit User Modal ── */}
      {editUser && (
        <Modal title={`Edit User — ${editUser.full_name}`} onClose={() => setEditUser(null)}>
          <UserForm
            isEdit={true}
            isManager={isManager}
            initial={editUser}
            onSuccess={handleUpdate}
            onCancel={() => setEditUser(null)}
          />
        </Modal>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {confirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Delete User</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">This action is permanent and cannot be undone. The user and all associated data will be removed.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)}
                className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
