import { useState, useEffect } from 'react';
import { createTicket, getCategories } from '../../../api/clientApi';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const priorityColor = { Low:'bg-green-100 text-green-700', Medium:'bg-yellow-100 text-yellow-700', High:'bg-orange-100 text-orange-700', Critical:'bg-red-100 text-red-700' };

export default function CreateTicketView({ onRefresh }) {
  const [form, setForm]         = useState({ title: '', description: '', category_id: '', priority: 'Medium' });
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!form.description.trim()) { setError('Description is required'); return; }
    setSubmitting(true); setError('');
    try {
      await createTicket({ title: form.title.trim(), description: form.description.trim(), category_id: form.category_id ? parseInt(form.category_id) : null, priority: form.priority });
      setSuccess(true);
      setForm({ title: '', description: '', category_id: '', priority: 'Medium' });
      onRefresh?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Failed to create ticket'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Create New Ticket</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Describe your issue and our support team will assist you.</p>
      </div>

      {success && <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">✓ Ticket created successfully!</div>}
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Subject <span className="text-red-500">*</span></label>
          <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Brief description of your issue"
            className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100 placeholder-gray-400" maxLength={200} />
          <p className="text-xs text-gray-400 mt-1">{form.title.length}/200</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Category</label>
            <select value={form.category_id} onChange={e => setForm(f => ({...f, category_id: e.target.value}))}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100">
              <option value="">Select category</option>
              {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Priority <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button key={p} type="button" onClick={() => setForm(f => ({...f, priority: p}))}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${form.priority === p ? priorityColor[p] + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Description <span className="text-red-500">*</span></label>
          <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={6}
            placeholder="Provide detailed information about your issue — steps to reproduce, error messages, expected vs actual behaviour..."
            className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100 resize-none placeholder-gray-400" maxLength={2000} />
          <p className="text-xs text-gray-400 mt-1">{form.description.length}/2000</p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={() => setForm({ title:'', description:'', category_id:'', priority:'Medium' })}
            className="px-5 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            Clear
          </button>
          <button type="submit" disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2">
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {submitting ? 'Creating...' : '✓ Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}

