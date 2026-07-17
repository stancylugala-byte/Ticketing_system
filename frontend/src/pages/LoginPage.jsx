import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import AuthNavbar from '../components/AuthNavbar';
import heroBg from '../assets/hero.png';

const ROLE_DASHBOARDS = {
  Client:         '/dashboard/client',
  SupportOfficer: '/dashboard/support',
  Developer:      '/dashboard/dev',
  Manager:        '/dashboard/manager',
  Admin:          '/dashboard/admin',
};

export default function LoginPage() {
  const navigate        = useNavigate();
  const location        = useLocation();
  const { login }       = useAuth();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');

  const successMsg = location.state?.message || '';

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      const { token, user: loggedInUser } = res.data.data;
      login(token, loggedInUser);
      const from = location.state?.from?.pathname;
      const dest = from || ROLE_DASHBOARDS[loggedInUser.role] || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AuthNavbar showLogin={false} showSignUp showOnlySignUp />

      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: form card centered ── */}
        <div className="w-1/2 flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-8 py-4">
          <div className="w-full max-w-[380px] bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 px-8 py-7">

            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Welcome back</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-5">Enter your credentials to access your dashboard.</p>

            {successMsg && (
              <div className="mb-4 px-3 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm">
                ✓ {successMsg}
              </div>
            )}
            {error && (
              <div className="mb-4 px-3 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1" htmlFor="email">
                  Email or Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input id="email" name="email" type="email" autoComplete="email" required
                    value={form.email} onChange={handleChange} placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 placeholder-gray-400 dark:placeholder-slate-500 transition-all bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300" htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input id="password" name="password" type={showPw ? 'text' : 'password'}
                    autoComplete="current-password" required
                    value={form.password} onChange={handleChange} placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 placeholder-gray-400 dark:placeholder-slate-500 transition-all bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {showPw
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                      }
                    </svg>
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded" />
                <span className="text-sm text-gray-600 dark:text-slate-400">Keep me logged in for 30 days</span>
              </label>

              <button type="submit" disabled={submitting}
                className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm">
                {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
              <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
            </div>

            <button type="button"
              className="w-full py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700">Create an account</Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT: full-height hero image ── */}
        <div className="w-1/2 relative overflow-hidden">
          <img src={heroBg} alt="JavaPA" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900/40 to-slate-900/70" />
          <div className="absolute inset-0 flex flex-col justify-end px-10 py-10">
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-2">500+ enterprise teams worldwide</p>
              <h2 className="text-2xl font-extrabold leading-snug mb-3">
                Your Support Command<br />Centre Awaits
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                Log in to access your personalised dashboard, manage tickets, and keep your SLAs on track.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
