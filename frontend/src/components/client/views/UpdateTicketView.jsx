import { useState, useEffect } from 'react';
import { getMyTickets, updateTicket } from '../../../api/clientApi';

export default function UpdateTicketView({ onRefresh }) {
  const [tickets, setTickets]   = useState([]);
  const [selected, setSelected] = useState('');
  const [form, setForm]         = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    getMyTickets({ limit: 50 }).then(r => {
      const active = (r.data.data.tickets || []).filter(t => !['Resolved','Closed'].includes(t.status));
      setTickets(active);
    }).catch(() => {});
  }, []);

  const handleSelect = (id) => {
    setSelected(id);
    const t = tickets.find(t => t.id === id);
    if (t) setForm({ title: t.title, description: t.description });
    setSuccess(false); setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) { setError('Please select a ticket'); return; }
    setSubmitting(true); setError('');
    try {
      await updateTicket(selected, { title: form.title.trim(), description: form.description.trim() });
      setSuccess(true); onRefresh?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Failed to update'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Update Ticket</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Add additional information or update the details of an open ticket.</p>
      </div>

      {success && <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">✓ Ticket updated successfully!</div>}
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Select Ticket</label>
          <select value={selected} onChange={e => handleSelect(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100">
            <option value="">— Choose a ticket to update —</option>
            {tickets.map(t => (
              <option key={t.id} value={t.id}>#{t.id.slice(0,8).toUpperCase()} — {t.title} ({t.status})</option>
            ))}
          </select>
          {tickets.length === 0 && <p className="text-xs text-gray-400 mt-1">No open tickets available to update.</p>}
        </div>

        {selected && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Title</label>
              <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={6}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100 resize-none" />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={submitting}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2">
                {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {submitting ? 'Saving...' : '✓ Save Changes'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

