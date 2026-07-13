import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/adminApi';

export default function CategoriesView() {
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding,  setAdding]  = useState(false);
  const [editing, setEditing] = useState(null); // { id, name }
  const [saving,  setSaving]  = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    getCategories().then(r => setCats(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try { await createCategory(newName); setNewName(''); load(); }
    catch (e) { alert(e.response?.data?.message || 'Failed to create category'); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!editing?.name?.trim()) return;
    setSaving(true);
    try { await updateCategory(editing.id, editing.name); setEditing(null); load(); }
    catch (e) { alert(e.response?.data?.message || 'Failed to update category'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteCategory(id); setConfirm(null); load(); }
    catch (e) { alert(e.response?.data?.message || 'Failed to delete — category may be in use'); }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Ticket Categories</h2>
        <p className="text-sm text-gray-500">Add, rename, or remove ticket classification categories</p>
      </div>

      {/* Add new */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Add New Category</h3>
        <div className="flex gap-3">
          <input
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 placeholder-gray-400"
            placeholder="e.g. Authentication, Billing, Network..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          />
          <button
            onClick={handleAdd} disabled={saving || !newName.trim()}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Adding...' : '+ Add Category'}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories ({cats.length})</span>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[...Array(4)].map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : cats.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400 gap-2"><span className="text-3xl">🏷</span><p className="text-sm">No categories yet — add your first one above</p></div>
        ) : (
          cats.map(c => (
            <div key={c.category_id} className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              {editing?.id === c.category_id ? (
                <div className="flex gap-2 flex-1 mr-3">
                  <input
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    value={editing.name}
                    onChange={e => setEditing(v => ({ ...v, name: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') handleEdit(); }}
                    autoFocus
                  />
                  <button onClick={handleEdit} disabled={saving} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">Save</button>
                  <button onClick={() => setEditing(null)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-100">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                    {c.category_id}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{c.category_name}</span>
                </div>
              )}
              {!editing || editing.id !== c.category_id ? (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditing({ id: c.category_id, name: c.category_name })}
                    className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all">
                    Edit
                  </button>
                  <button onClick={() => setConfirm(c.category_id)}
                    className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all">
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-base font-bold text-gray-900 mb-2">Delete Category</h3>
            <p className="text-sm text-gray-500 mb-5">This will permanently remove the category. Tickets using it will lose their category assignment.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(confirm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
