import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/LoginPage';
import SignupPage         from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage  from './pages/ResetPasswordPage';
import SupportDashboard   from './pages/SupportDashboard';
import ClientDashboard    from './pages/ClientDashboard';
import ManagerDashboard   from './pages/ManagerDashboard';
import AdminDashboard     from './pages/AdminDashboard';
import ProfilePage        from './pages/ProfilePage';
import EngineeringBacklog from './pages/Dashboard/EngineeringBacklog';
import DashboardLayout    from './components/layout/DashboardLayout';
import Sidebar            from './components/Sidebar';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ProtectedRoute     from './components/ProtectedRoute';

// Role → dashboard path (single source of truth)
export const ROLE_DASHBOARDS = {
  Client:         '/dashboard/client',
  SupportOfficer: '/dashboard/support',
  Developer:      '/dashboard/dev',
  Manager:        '/dashboard/manager',
  Admin:          '/dashboard/admin',
};

// Support Officer layout — sidebar + dashboard
function SupportLayout() {
  const [activeModule, setActiveModule] = useState('ticket-queue');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}
      <div className={`fixed md:relative inset-y-0 left-0 z-50 md:z-auto h-screen transition-transform duration-300
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar
          activePage={activeModule}
          onNavigate={(id) => { setActiveModule(id); setMobileSidebarOpen(false); }}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(v => !v)}
        />
      </div>
      <SupportDashboard
        activeModule={activeModule}
        sidebarCollapsed={sidebarCollapsed}
        onOpenMobileSidebar={() => setMobileSidebarOpen(v => !v)}
      />
    </div>
  );
}

// Developer dashboard — Engineering Backlog wrapped in DashboardLayout
function DeveloperDashboard() {
  return (
    <DashboardLayout>
      <EngineeringBacklog />
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* OAuth callback */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Public */}
      <Route path="/"                element={<LandingPage />} />
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/signup"          element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      {/* Client */}
      <Route path="/dashboard/client" element={
        <ProtectedRoute allowedRoles={['Client']} roleDashboards={ROLE_DASHBOARDS}>
          <ClientDashboard />
        </ProtectedRoute>
      } />

      {/* Support Officer */}
      <Route path="/dashboard/support" element={
        <ProtectedRoute allowedRoles={['SupportOfficer']} roleDashboards={ROLE_DASHBOARDS}>
          <SupportLayout />
        </ProtectedRoute>
      } />

      {/* Developer */}
      <Route path="/dashboard/dev" element={
        <ProtectedRoute allowedRoles={['Developer']} roleDashboards={ROLE_DASHBOARDS}>
          <DeveloperDashboard />
        </ProtectedRoute>
      } />

      {/* Support Manager */}
      <Route path="/dashboard/manager" element={
        <ProtectedRoute allowedRoles={['Manager']} roleDashboards={ROLE_DASHBOARDS}>
          <ManagerDashboard />
        </ProtectedRoute>
      } />

      {/* System Administrator */}
      <Route path="/dashboard/admin" element={
        <ProtectedRoute allowedRoles={['Admin']} roleDashboards={ROLE_DASHBOARDS}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Profile — any authenticated user */}
      <Route path="/profile" element={
        <ProtectedRoute roleDashboards={ROLE_DASHBOARDS}>
          <ProfilePage />
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
