import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/LoginPage';
import SignupPage         from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage  from './pages/ResetPasswordPage';
import SupportDashboard   from './pages/SupportDashboard';
import ClientDashboard    from './pages/ClientDashboard';
import Sidebar            from './components/Sidebar';
import ProtectedRoute     from './components/ProtectedRoute';

// Role → dashboard path mapping (single source of truth)
export const ROLE_DASHBOARDS = {
  SupportOfficer: '/dashboard/support',
  Developer:      '/dashboard/dev',
  Admin:          '/dashboard/admin',
  Client:         '/dashboard/client',
};

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

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"                element={<LandingPage />} />
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/signup"          element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      {/* Protected — Support Officer */}
      <Route path="/dashboard/support" element={
        <ProtectedRoute allowedRoles={['SupportOfficer']} roleDashboards={ROLE_DASHBOARDS}>
          <SupportLayout />
        </ProtectedRoute>
      } />

      {/* Client Dashboard */}
      <Route path="/dashboard/client" element={
        <ProtectedRoute allowedRoles={['Client']}>
          <ClientDashboard />
        </ProtectedRoute>
      } />

      {/* Protected — Client (default for unspecified roles) */}
      <Route path="/dashboard/client" element={
        <ProtectedRoute allowedRoles={['Client']} roleDashboards={ROLE_DASHBOARDS}>
          <ClientDashboard />
        </ProtectedRoute>
      } />

      {/* Catch-all → landing */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
