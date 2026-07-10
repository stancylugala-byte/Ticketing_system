import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../Sidebar';

const DashboardLayout = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🏠 DashboardLayout - user:', user, 'loading:', loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A1628]">
        <div className="text-[#94A3B8]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    console.log('🔒 No user in DashboardLayout, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#0A1628] overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;