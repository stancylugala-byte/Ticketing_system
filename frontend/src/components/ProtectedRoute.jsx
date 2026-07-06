import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still resolving stored session — show spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f4f9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wrong role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/login"
        state={{ message: `Access denied. Required role: ${allowedRoles.join(' or ')}.` }}
        replace
      />
    );
  }

  return children;
}
