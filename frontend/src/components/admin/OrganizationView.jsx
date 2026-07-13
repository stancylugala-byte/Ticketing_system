export default function OrganizationView({ type }) {
  const isCompanies = type === 'companies';
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{isCompanies ? 'Companies' : 'Departments'}</h2>
        <p className="text-sm text-gray-500">
          {isCompanies
            ? 'Corporate client registry for enterprise billing and SLA reviews.'
            : 'Internal functional groups for ticket routing and team assignments.'}
        </p>
      </div>

      {/* Placeholder — full org management requires a companies/departments table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-gray-400 gap-4">
        <span className="text-5xl">{isCompanies ? '🏢' : '🗂'}</span>
        <p className="text-base font-semibold text-gray-600">
          {isCompanies ? 'Company Registry' : 'Department Management'}
        </p>
        <p className="text-sm text-center max-w-md">
          {isCompanies
            ? 'Companies are linked to client accounts via user records. Each client\'s organisation is derived from their email domain and profile.'
            : 'Departments are mapped through support officer role assignments. Use Team Management in the Support Manager dashboard for workload distribution.'}
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-sm text-blue-700 max-w-md text-center">
          💡 To extend this module, add a <code className="bg-blue-100 px-1 rounded text-xs">companies</code> table to the database schema and link it to the User model.
        </div>
      </div>
    </div>
  );
}
