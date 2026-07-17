import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_DASHBOARDS = {
  Client:         '/dashboard/client',
  SupportOfficer: '/dashboard/support',
  Developer:      '/dashboard/dev',
  Manager:        '/dashboard/manager',
  Admin:          '/dashboard/admin',
};

export default function ProtectedRoute({ children, allowedRoles, roleDashboards }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still verifying stored session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not logged in → send to login, remember intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wrong role → silently redirect to their own dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const correct = (roleDashboards || ROLE_DASHBOARDS)[user.role] || '/login';
    return <Navigate to={correct} replace />;
  }

  // Authenticated + correct role → render the page
  return children;
}
