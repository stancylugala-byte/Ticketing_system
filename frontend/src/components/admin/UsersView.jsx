import { useEffect, useState, useCallback } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../../api/adminApi';

const ALL_ROLES = ['Client', 'SupportOfficer', 'Developer', 'Admin'];
const ROLE_BADGE = {
  Client:         'bg-blue-100 text-blue-700',
  SupportOfficer: 'bg-yellow-100 text-yellow-700',
  Developer:      'bg-purple-100 text-purple-700',
  Admin:          'bg-red-100 text-red-700',
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

export default function UsersView({ roleFilter, label }) {
  const [users,   setUsers]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // { id, role }
  const [saving,  setSaving]  = useState(false);
  const [confirm, setConfirm] = useState(null); // id to delete

  const load = useCallback(() => {
    setLoading(true);
    getUsers({ role: roleFilter, search, page, limit: 15 })
      .then(r => { setUsers(r.data.data.users); setTotal(r.data.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roleFilter, search, page]);

  useEffect(() => { load(); }, [load]);

  const handleRoleChange = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateUserRole(editing.id, editing.role);
      setEditing(null);
      load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setConfirm(null);
      load();
    } catch (e) { alert(e.response?.data?.message || 'Delete failed'); }
  };

  const totalPages = Math.max(1, Math.ceil(total / 15));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{label}</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">{total} {label.toLowerCase()} registered</p>
        </div>
        <input
          className="px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-red-400 bg-white dark:bg-slate-800 w-52 placeholder-gray-400"
          placeholder={`Search ${label.toLowerCase()}...`}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[200px_1fr_130px_90px_100px] px-5 py-2.5 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <span>User</span><span>Email</span><span>Role</span><span>Joined</span><span>Actions</span>
        </div>

        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[...Array(5)].map((_,i) => <div key={i} className="h-14 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse" />)}</div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400 dark:text-slate-500 gap-2"><span className="text-3xl">??</span><p className="text-sm">No {label.toLowerCase()} found</p></div>
        ) : (
          users.map(u => (
            <div key={u.id} className="grid grid-cols-[200px_1fr_130px_90px_100px] items-center px-5 py-3.5 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{getInitials(u.full_name)}</div>
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{u.full_name}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-slate-400 truncate pr-3">{u.email}</span>

              {/* Role — editable */}
              {editing?.id === u.id ? (
                <div className="flex gap-1.5">
                  <select
                    className="text-xs border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1.5 outline-none focus:border-red-400 bg-white dark:bg-slate-800"
                    value={editing.role}
                    onChange={e => setEditing(v => ({ ...v, role: e.target.value }))}
                  >
                    {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <button onClick={handleRoleChange} disabled={saving}
                    className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-700 disabled:opacity-50 transition-colors">
                    {saving ? '…' : '?'}
                  </button>
                  <button onClick={() => setEditing(null)} className="px-2 py-1 border border-gray-200 dark:border-slate-700 rounded text-[10px] text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:bg-slate-700">?</button>
                </div>
              ) : (
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${ROLE_BADGE[u.role] || 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}>{u.role}</span>
              )}

              <span className="text-xs text-gray-400 dark:text-slate-500">{timeAgo(u.created_at)}</span>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditing({ id: u.id, role: u.role })}
                  className="px-2.5 py-1.5 text-[11px] font-semibold border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
                >Edit</button>
                <button
                  onClick={() => setConfirm(u.id)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                >Del</button>
              </div>
            </div>
          ))
        )}

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <span className="text-xs text-gray-400 dark:text-slate-500">Showing {users.length} of {total}</span>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed">? Prev</button>
            <span className="text-xs text-gray-500 dark:text-slate-400 px-1">{page}/{totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed">Next ?</button>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Delete User</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">This action is permanent and cannot be undone. The user and all associated data will be removed.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(confirm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
