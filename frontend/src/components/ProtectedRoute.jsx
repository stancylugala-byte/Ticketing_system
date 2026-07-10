import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
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

  // ✅ ALLOW ALL ROLES - go to home page
  console.log('✅ User authenticated:', user);
  return <Navigate to="/" replace />;  // ← THIS SENDS TO HOME PAGE
};

export default ProtectedRoute;