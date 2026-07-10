import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/LoginPage';
import SignupPage         from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage  from './pages/ResetPasswordPage';
import SupportDashboard   from './pages/SupportDashboard';
import ClientDashboard    from './pages/ClientDashboard';
import EngineeringBacklog from './pages/dashboard/EngineeringBacklog';
import DashboardLayout    from './components/layout/DashboardLayout';
import Sidebar            from './components/Sidebar';

// ✅ Role → dashboard path mapping
export const ROLE_DASHBOARDS = {
  SupportOfficer: '/dashboard/support',
  Developer:      '/dashboard/backlog',
  Admin:          '/dashboard/admin',
  Client:         '/dashboard/client',
};

// ✅ Protected Route Component - FIXED
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute - user:', user, 'loading:', loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A1628]">
        <div className="text-[#94A3B8]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    console.log('🔒 No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // ✅ Check if user has allowed role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('🚫 User role not allowed:', user.role);
    // ✅ FIX: Redirect to home page instead of dashboard
    return <Navigate to="/" replace />;
  }

  console.log('✅ User authenticated, rendering children');
  return children;
};

// ✅ Support Layout
function SupportLayout() {
  const [activeModule, setActiveModule] = useState('ticket-queue');
  return (
    <div className="flex h-screen bg-[#0A1628] overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <SupportDashboard activeModule={activeModule} />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* ✅ Protected - Support Officer */}
      <Route
        path="/dashboard/support"
        element={
          <ProtectedRoute allowedRoles={['SupportOfficer']}>
            <SupportLayout />
          </ProtectedRoute>
        }
      />

      {/* ✅ Protected - Client */}
      <Route
        path="/dashboard/client"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ClientDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ✅ Protected - Engineering Backlog (for Developers) */}
      <Route
        path="/dashboard/backlog"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EngineeringBacklog />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ✅ Protected - Performance (for Developers/Admin) */}
      <Route
        path="/dashboard/performance"
        element={
          <ProtectedRoute allowedRoles={['Developer', 'Admin']}>
            <DashboardLayout>
              <div className="p-8 text-white">Performance Dashboard</div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ✅ Protected - Admin Settings */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <DashboardLayout>
              <div className="p-8 text-white">Admin Settings</div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ✅ Fallback: redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;