import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles, roleDashboards = {} }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Resolving stored session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f4f9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in → go to login, remember where they wanted to go
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wrong role → redirect silently to their own dashboard (no error message)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const correctDash = roleDashboards[user.role] || '/login';
    return <Navigate to={correctDash} replace />;
  }

  return children;
}
