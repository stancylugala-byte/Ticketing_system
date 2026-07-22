import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_DASHBOARDS = {
  Client:         '/dashboard/client',
  SupportOfficer: '/dashboard/support',
  Developer:      '/dashboard/dev',
  Manager:        '/dashboard/manager',
  Admin:          '/dashboard/admin',
};

export default function AuthCallbackPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for error param first
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      setError('Google sign-in failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Read #data=... from the URL fragment
    const hash = window.location.hash; // e.g. "#data=..."
    if (!hash.startsWith('#data=')) {
      setError('Invalid callback. Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const encoded  = hash.slice('#data='.length);
      const { token, user } = JSON.parse(decodeURIComponent(encoded));

      if (!token || !user) throw new Error('Missing data');

      // Log in via AuthContext — same as standard login
      login(token, user);

      const dest = ROLE_DASHBOARDS[user.role] || '/dashboard/client';
      navigate(dest, { replace: true });
    } catch {
      setError('Failed to process sign-in. Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 gap-4">
      {error ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-gray-700 dark:text-slate-300 text-sm font-medium">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-slate-400 text-sm">Signing you in with Google...</p>
        </div>
      )}
    </div>
  );
}
