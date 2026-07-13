import { useEffect, useState } from 'react';
import { getSlaRules, updateSlaRule } from '../../api/managerApi';

const PRIORITY_COLORS = { Low:'text-green-700 bg-green-50', Medium:'text-yellow-700 bg-yellow-50', High:'text-orange-700 bg-orange-50', Critical:'text-red-700 bg-red-50' };

export default function SlaRulesView() {
  const [rules,   setRules]   = useState([]);
  const [editing, setEditing] = useState(null); // { id, response_time, resolution_time }
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSlaRules().then(r => setRules(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateSlaRule(editing.id, { response_time: editing.response_time, resolution_time: editing.resolution_time });
      const r = await getSlaRules();
      setRules(r.data.data || []);
      setEditing(null);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">SLA Rules</h2>
        <p className="text-sm text-gray-500">Configure response and resolution time targets per priority level</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {loading ? (
          [...Array(4)].map((_,i) => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)
        ) : (
          rules.map(rule => {
            const isEditing = editing?.id === rule.sla_id;
            const c = PRIORITY_COLORS[rule.priority] || 'text-gray-700 bg-gray-50';
            return (
              <div key={rule.sla_id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${c}`}>{rule.priority} Priority</span>
                  {!isEditing ? (
                    <button
                      onClick={() => setEditing({ id: rule.sla_id, response_time: rule.response_time, resolution_time: rule.resolution_time })}
                      className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
                    >Edit</button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(null)} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
                      <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Response Time (h)</p>
                    {isEditing ? (
                      <input type="number" min="1" value={editing.response_time}
                        onChange={e => setEditing(v => ({ ...v, response_time: parseInt(e.target.value) }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{rule.response_time}h</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Resolution Time (h)</p>
                    {isEditing ? (
                      <input type="number" min="1" value={editing.resolution_time}
                        onChange={e => setEditing(v => ({ ...v, resolution_time: parseInt(e.target.value) }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{rule.resolution_time}h</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {rules.length === 0 && !loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-700 flex gap-2">
          <span>⚠</span>
          <span>No SLA policies configured yet. Create SLA policies through the database or seed the sla_policies table.</span>
        </div>
      )}
    </div>
  );
}
