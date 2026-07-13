const ROLES = [
  { role: 'Client',         color: 'bg-blue-600',   badge: 'bg-blue-100 text-blue-700',     permissions: ['Submit tickets', 'View own tickets', 'Add comments', 'Close own tickets', 'Submit feedback'] },
  { role: 'SupportOfficer', color: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700', permissions: ['View all tickets', 'Claim tickets', 'Update ticket status', 'Add internal notes', 'Reply to clients', 'View knowledge base'] },
  { role: 'Developer',      color: 'bg-purple-600', badge: 'bg-purple-100 text-purple-700', permissions: ['View escalated tickets', 'Update ticket status', 'Add internal notes', 'View engineering backlog', 'Access knowledge base'] },
  { role: 'Admin',          color: 'bg-red-600',    badge: 'bg-red-100 text-red-700',       permissions: ['Full system access', 'User management', 'Role assignment', 'System configuration', 'SLA management', 'Audit log access', 'Backup & security'] },
];

export default function RolesView({ showPermissions = false }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{showPermissions ? 'Assign Permissions' : 'Role Directory'}</h2>
        <p className="text-sm text-gray-500">
          {showPermissions
            ? 'Permissions are mapped to each role. Role-based access is enforced at the API middleware level.'
            : 'Platform roles and their associated capabilities. Roles are enforced via JWT token validation.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {ROLES.map(r => (
          <div key={r.role} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className={`${r.color} px-5 py-3 flex items-center justify-between`}>
              <span className="text-white font-bold text-sm">{r.role}</span>
              <span className="text-white/60 text-xs">{r.permissions.length} permissions</span>
            </div>
            <div className="px-5 py-4">
              <ul className="space-y-1.5">
                {r.permissions.map(p => (
                  <li key={p} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <span className="text-lg shrink-0">⚠️</span>
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>Note:</strong> Role changes take effect immediately at the next login. Permissions are enforced at the backend middleware level via <code className="bg-amber-100 px-1 rounded text-xs">requireRole()</code> and cannot be overridden from the frontend.
        </p>
      </div>
    </div>
  );
}
