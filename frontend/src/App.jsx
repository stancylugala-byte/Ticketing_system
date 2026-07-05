import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/LoginPage';
import SignupPage         from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage  from './pages/ResetPasswordPage';
import SupportDashboard   from './pages/SupportDashboard';
import Sidebar            from './components/Sidebar';
import ProtectedRoute     from './components/ProtectedRoute';
import { useAuth }        from './context/AuthContext';

// Wraps Sidebar + SupportDashboard for the support officer route
function SupportLayout() {
  const [activeModule, setActiveModule] = useState('ticket-queue');
  return (
    <>
      <Sidebar activePage={activeModule} onNavigate={setActiveModule} />
      <SupportDashboard activeModule={activeModule} />
    </>
  );
}

// Redirect already-authenticated users away from auth pages
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user?.role === 'SupportOfficer') return <Navigate to="/dashboard/support" replace />;
  if (user) return <Navigate to="/dashboard/support" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute><SignupPage /></PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute><ForgotPasswordPage /></PublicRoute>
      } />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected — Support Officer only */}
      <Route path="/dashboard/support" element={
        <ProtectedRoute allowedRoles={['SupportOfficer']}>
          <SupportLayout />
        </ProtectedRoute>
      } />

      {/* Catch-all → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
