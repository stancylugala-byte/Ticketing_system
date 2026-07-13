import { useState } from 'react';

export default function BackupSecurityView() {
  const [backupStatus, setBackupStatus] = useState('idle'); // idle | running | done
  const [securityLog]  = useState([
    { time: '10:14 AM', event: 'Admin updated SLA settings', severity: 'info' },
    { time: '09:42 AM', event: 'Support Officer Sarah logged in',  severity: 'info' },
    { time: '09:15 AM', event: 'Failed login attempt — 3 retries', severity: 'warn' },
    { time: '08:30 AM', event: 'System health check passed',      severity: 'success' },
    { time: '08:00 AM', event: 'Automatic DB backup completed',   severity: 'success' },
    { time: 'Yesterday','event': 'Rate limit triggered: /api/auth/login', severity: 'warn' },
  ]);

  const handleBackup = () => {
    setBackupStatus('running');
    setTimeout(() => setBackupStatus('done'), 2500);
  };

  const severityStyle = {
    info:    'bg-blue-50 text-blue-700 border-blue-200',
    warn:    'bg-yellow-50 text-yellow-700 border-yellow-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    error:   'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Backup & Security</h2>
        <p className="text-sm text-gray-500">Database backup controls and security monitoring</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Database Backup */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-xl">💾</div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Database Backup</h3>
              <p className="text-xs text-gray-400">Manual backup trigger</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 mb-4 text-xs text-gray-600">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
              <span>Database</span><span className="font-semibold">sts (MySQL)</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
              <span>Last Backup</span><span className="font-semibold text-emerald-600">Today 08:00 AM</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
              <span>Schedule</span><span className="font-semibold">Daily at 08:00 AM</span>
            </div>
          </div>
          <button
            onClick={handleBackup}
            disabled={backupStatus === 'running'}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all
              ${backupStatus === 'done'    ? 'bg-emerald-500 text-white' :
                backupStatus === 'running' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' :
                'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {backupStatus === 'running' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {backupStatus === 'done'    ? '✓ Backup Complete' :
             backupStatus === 'running' ? 'Running Backup...' : '▶ Run Database Backup'}
          </button>
        </div>

        {/* Security Monitoring */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center text-xl">🔒</div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Security Status</h3>
              <p className="text-xs text-gray-400">Real-time threat monitoring</p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { label: 'JWT Authentication',     status: 'Active',   ok: true },
              { label: 'CORS Policy',             status: 'Enforced', ok: true },
              { label: 'Helmet Security Headers', status: 'Active',   ok: true },
              { label: 'Rate Limiting',           status: 'Active',   ok: true },
              { label: 'SSL / HTTPS',             status: 'Dev Mode', ok: false },
              { label: 'Bcrypt Password Hashing', status: 'Round 12', ok: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-700">{item.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Log */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">Security Log</h3>
          <span className="text-xs text-gray-400">Last 24 hours</span>
        </div>
        <div className="divide-y divide-gray-100">
          {securityLog.map((log, i) => (
            <div key={i} className={`flex items-start gap-3 px-5 py-3.5 border-l-4 ${log.severity === 'warn' ? 'border-l-yellow-400' : log.severity === 'success' ? 'border-l-emerald-400' : 'border-l-blue-400'}`}>
              <span className="text-xs text-gray-400 w-20 shrink-0 font-medium">{log.time}</span>
              <span className={`text-xs font-medium border px-2 py-0.5 rounded-full shrink-0 ${severityStyle[log.severity]}`}>
                {log.severity.toUpperCase()}
              </span>
              <span className="text-sm text-gray-700">{log.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
