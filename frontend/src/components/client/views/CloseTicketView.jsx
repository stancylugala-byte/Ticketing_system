import { useState, useEffect } from 'react';
import { getMyTickets, closeTicket } from '../../../api/clientApi';

export default function CloseTicketView({ onRefresh }) {
  const [tickets, setTickets]   = useState([]);
  const [selected, setSelected] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [acting, setActing]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    getMyTickets({ status: 'Resolved', limit: 50 })
      .then(r => setTickets(r.data.data.tickets || []))
      .catch(() => {});
  }, []);

  const handleClose = async () => {
    if (!selected || !confirmed) return;
    setActing(true); setError('');
    try {
      await closeTicket(selected);
      setSuccess(true); setSelected(''); setConfirmed(false);
      onRefresh?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Failed to close'); }
    finally { setActing(false); }
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Close Ticket Confirmation</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Confirm that your issue is resolved and close the ticket.</p>
      </div>

      {success && <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">✓ Ticket closed successfully. Thank you!</div>}
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Select Resolved Ticket</label>
          <select value={selected} onChange={e => { setSelected(e.target.value); setConfirmed(false); }}
            className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100">
            <option value="">— Choose a resolved ticket —</option>
            {tickets.map(t => (
              <option key={t.id} value={t.id}>#{t.id.slice(0,8).toUpperCase()} — {t.title}</option>
            ))}
          </select>
          {tickets.length === 0 && <p className="text-xs text-gray-400 mt-1">No resolved tickets available to close.</p>}
        </div>

        {selected && (
          <>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ Before you close</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                Closing this ticket confirms that your issue has been fully resolved. If the problem recurs, you can reopen it.
              </p>
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-blue-600 shrink-0" />
              <span className="text-sm text-gray-700 dark:text-slate-300">I confirm the issue is resolved and I want to close this ticket.</span>
            </label>
            <div className="flex justify-end pt-2">
              <button onClick={handleClose} disabled={acting || !confirmed}
                className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-colors flex items-center gap-2">
                {acting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {acting ? 'Closing...' : '✓ Close Ticket'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

