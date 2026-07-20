import { useState } from 'react';

export default function BackupSecurityView() {
  const [backupStatus, setBackupStatus] = useState('idle');
  const [securityLog] = useState([
    { time: '10:14 AM', event: 'Admin updated SLA settings',           severity: 'info' },
    { time: '09:42 AM', event: 'Support Officer Sarah logged in',       severity: 'info' },
    { time: '09:15 AM', event: 'Failed login attempt — 3 retries',      severity: 'warn' },
    { time: '08:30 AM', event: 'System health check passed',            severity: 'success' },
    { time: '08:00 AM', event: 'Automatic DB backup completed',         severity: 'success' },
    { time: 'Yesterday', event: 'Rate limit triggered: /api/auth/login', severity: 'warn' },
  ]);

  const handleBackup = () => {
    setBackupStatus('running');
    setTimeout(() => setBackupStatus('done'), 2500);
  };

  const severityStyle = {
    info:    'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
    warn:    'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30',
    success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    error:   'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30',
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Backup &amp; Security</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">Database backup controls and security monitoring</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Database Backup */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-xl">🗄</div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Database Backup</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500">Manual backup trigger</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 mb-4 text-xs text-gray-600 dark:text-slate-300">
            {[
              { label: 'Database',     value: 'sts (MySQL)' },
              { label: 'Last Backup',  value: 'Today 08:00 AM', green: true },
              { label: 'Schedule',     value: 'Daily at 08:00 AM' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                <span className="text-gray-500 dark:text-slate-400">{item.label}</span>
                <span className={`font-semibold ${item.green ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-slate-200'}`}>{item.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleBackup}
            disabled={backupStatus === 'running'}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              backupStatus === 'done'    ? 'bg-emerald-500 text-white' :
              backupStatus === 'running' ? 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 cursor-not-allowed' :
              'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {backupStatus === 'running' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {backupStatus === 'done'    ? '✓ Backup Complete' :
             backupStatus === 'running' ? 'Running Backup...' : '▶ Run Database Backup'}
          </button>
        </div>

        {/* Security Monitoring */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center text-xl">🔒</div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Security Status</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500">Real-time threat monitoring</p>
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
              <div key={item.label} className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                <span className="text-xs text-gray-700 dark:text-slate-200">{item.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.ok
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Log */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700 dark:text-slate-200">Security Log</h3>
          <span className="text-xs text-gray-400 dark:text-slate-500">Last 24 hours</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {securityLog.map((log, i) => (
            <div key={i} className={`flex items-start gap-3 px-5 py-3.5 border-l-4 ${
              log.severity === 'warn'    ? 'border-l-yellow-400' :
              log.severity === 'success' ? 'border-l-emerald-400' : 'border-l-blue-400'
            }`}>
              <span className="text-xs text-gray-400 dark:text-slate-500 w-20 shrink-0 font-medium">{log.time}</span>
              <span className={`text-xs font-medium border px-2 py-0.5 rounded-full shrink-0 ${severityStyle[log.severity]}`}>
                {log.severity.toUpperCase()}
              </span>
              <span className="text-sm text-gray-700 dark:text-slate-200">{log.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
