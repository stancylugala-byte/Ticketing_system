import { useState, useEffect } from 'react';
import { getMyTickets, reopenTicket } from '../../../api/clientApi';

export default function ReopenTicketView({ onRefresh }) {
  const [tickets, setTickets]   = useState([]);
  const [selected, setSelected] = useState('');
  const [reason, setReason]     = useState('');
  const [acting, setActing]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    getMyTickets({ status: 'Closed', limit: 50 })
      .then(r => setTickets(r.data.data.tickets || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) { setError('Please select a ticket'); return; }
    setActing(true); setError('');
    try {
      await reopenTicket(selected);
      setSuccess(true); setSelected(''); setReason('');
      onRefresh?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Failed to reopen'); }
    finally { setActing(false); }
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Reopen Ticket</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Reactivate a closed ticket if the issue persists.</p>
      </div>

      {success && <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">✓ Ticket reopened successfully!</div>}
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Select Closed Ticket</label>
          <select value={selected} onChange={e => setSelected(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100">
            <option value="">— Choose a closed ticket —</option>
            {tickets.map(t => (
              <option key={t.id} value={t.id}>#{t.id.slice(0,8).toUpperCase()} — {t.title}</option>
            ))}
          </select>
          {tickets.length === 0 && <p className="text-xs text-gray-400 mt-1">No closed tickets found.</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Reason for Reopening</label>
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4}
            placeholder="Explain why the issue still persists..."
            className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100 resize-none placeholder-gray-400" />
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={acting || !selected}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2">
            {acting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {acting ? 'Reopening...' : '↩ Reopen Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}

