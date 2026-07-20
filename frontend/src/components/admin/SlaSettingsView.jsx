import { useEffect, useState } from 'react';
import { getSlaRules, updateSlaRule } from '../../api/adminApi';

const PRIORITY_STYLE = {
  Low:      { badge: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',  accent: 'border-l-green-500' },
  Medium:   { badge: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400', accent: 'border-l-yellow-500' },
  High:     { badge: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400', accent: 'border-l-orange-500' },
  Critical: { badge: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',       accent: 'border-l-red-500' },
};

export default function SlaSettingsView() {
  const [rules,   setRules]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);

  const load = () => {
    setLoading(true);
    getSlaRules().then(r => setRules(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateSlaRule(editing.sla_id, { response_time: editing.response_time, resolution_time: editing.resolution_time });
      setEditing(null);
      load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">SLA Settings</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">Configure response and resolution time targets. Changes take effect immediately across all active tickets.</p>
      </div>

      {rules.length === 0 && !loading && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-5 text-sm text-amber-700 dark:text-amber-400 flex gap-2">
          <span>⚠</span>
          <span>No SLA policies found. Seed the <code className="bg-amber-100 dark:bg-amber-500/20 px-1 rounded">sla_policies</code> table with priority entries (Low, Medium, High, Critical) to enable SLA management.</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {loading
          ? [...Array(4)].map((_,i) => <div key={i} className="h-36 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />)
          : rules.map(rule => {
              const s = PRIORITY_STYLE[rule.priority] || { badge: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300', accent: 'border-l-gray-400' };
              const isEditing = editing?.sla_id === rule.sla_id;
              return (
                <div key={rule.sla_id} className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 border-l-4 ${s.accent} shadow-sm p-5`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${s.badge}`}>{rule.priority} Priority</span>
                    {!isEditing ? (
                      <button onClick={() => setEditing({ ...rule })}
                        className="px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-300 hover:text-blue-600 transition-all">
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(null)} className="px-3 py-1.5 text-xs border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Response Time (h)</p>
                      {isEditing ? (
                        <input type="number" min="1" value={editing.response_time}
                          onChange={e => setEditing(v => ({ ...v, response_time: parseInt(e.target.value) }))}
                          className="w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-900 dark:text-slate-100" />
                      ) : (
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{rule.response_time}h</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Resolution Time (h)</p>
                      {isEditing ? (
                        <input type="number" min="1" value={editing.resolution_time}
                          onChange={e => setEditing(v => ({ ...v, resolution_time: parseInt(e.target.value) }))}
                          className="w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-900 dark:text-slate-100" />
                      ) : (
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{rule.resolution_time}h</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
        }
      </div>

      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-4 flex gap-3">
        <span className="text-lg shrink-0">💡</span>
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          SLA policies are linked to tickets by priority level. Updating these values immediately affects all currently active ticket SLA calculations.
        </p>
      </div>
    </div>
  );
}
