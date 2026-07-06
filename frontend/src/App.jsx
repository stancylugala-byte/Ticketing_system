import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/LoginPage';
import SignupPage         from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage  from './pages/ResetPasswordPage';
import SupportDashboard   from './pages/SupportDashboard';
import Sidebar            from './components/Sidebar';
import ProtectedRoute     from './components/ProtectedRoute';

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
      {/* Public — no guards, always accessible */}
      <Route path="/"                element={<LandingPage />} />
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/signup"          element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      {/* Protected — requires auth + correct role */}
      <Route path="/dashboard/support" element={
        <ProtectedRoute allowedRoles={['SupportOfficer']}>
          <SupportLayout />
        </ProtectedRoute>
      } />

      {/* Any unknown path → landing */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
