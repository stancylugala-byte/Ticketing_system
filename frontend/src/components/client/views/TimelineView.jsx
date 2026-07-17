import { useEffect, useState } from 'react';
import { getMyTickets } from '../../../api/clientApi';

function fmtDate(d) { return d ? new Date(d).toLocaleString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'; }

export default function TimelineView() {
  const [tickets, setTickets]   = useState([]);
  const [selected, setSelected] = useState('');
  const [ticket, setTicket]     = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getMyTickets({ limit: 50 }).then(r => {
      const t = r.data.data.tickets || [];
      setTickets(t);
      if (t.length > 0) setSelected(t[0].id);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selected) setTicket(tickets.find(t => t.id === selected) || null);
  }, [selected, tickets]);

  const events = ticket ? [
    { label: 'Ticket Created', time: ticket.created_at, icon: '🎫', color: 'bg-blue-500' },
    ticket.assignee && { label: `Assigned to ${ticket.assignee.full_name}`, time: ticket.updated_at, icon: '👤', color: 'bg-purple-500' },
    ticket.status !== 'Open' && { label: `Status: ${ticket.status}`, time: ticket.updated_at, icon: ticket.status === 'Resolved' ? '✅' : ticket.status === 'Closed' ? '🔒' : '⚙️', color: ticket.status === 'Resolved' ? 'bg-emerald-500' : ticket.status === 'Closed' ? 'bg-gray-500' : 'bg-yellow-500' },
  ].filter(Boolean) : [];

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">View Resolution Timeline</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Track the step-by-step progress of your ticket resolution.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">Select Ticket</label>
        <select value={selected} onChange={e => setSelected(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100">
          {tickets.map(t => <option key={t.id} value={t.id}>#{t.id.slice(0,8).toUpperCase()} — {t.title} ({t.status})</option>)}
        </select>
      </div>

      {ticket && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[11px] font-bold text-blue-600">#{ticket.id.slice(0,8).toUpperCase()}</span>
            <span className="text-sm font-bold text-gray-900 dark:text-slate-100">{ticket.title}</span>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700" />
            <div className="flex flex-col gap-6">
              {events.map((ev, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  <div className={`w-10 h-10 ${ev.color} text-white rounded-xl flex items-center justify-center text-base shrink-0 z-10 shadow-md`}>
                    {ev.icon}
                  </div>
                  <div className="flex-1 pt-1.5 pb-4 border-b border-gray-100 dark:border-slate-700 last:border-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{ev.label}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{fmtDate(ev.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

