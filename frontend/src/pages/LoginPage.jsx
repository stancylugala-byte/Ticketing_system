import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import AuthNavbar from '../components/AuthNavbar';

const ROLE_DASHBOARDS = {
  SupportOfficer: '/dashboard/support',
  Developer:      '/dashboard/support',
  Admin:          '/dashboard/support',
  Client:         '/dashboard/support',
};

export default function LoginPage() {
  const navigate            = useNavigate();
  const location            = useLocation();
  const { login }           = useAuth();  // only destructure what we need

  const [form, setForm]     = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState('');

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
      // Navigate immediately after login — no useEffect needed
      const from = location.state?.from?.pathname;
      const dest = from || ROLE_DASHBOARDS[loggedInUser.role] || '/dashboard/support';
      navigate(dest, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f4f9]">
      <AuthNavbar showLogin={false} showSignUp showOnlySignUp />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex">

          {/* ── Left: form ── */}
          <div className="flex-1 px-10 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500 text-sm mb-8">Enter your credentials to access your support dashboard.</p>

            {successMsg && (
              <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
                ✓ {successMsg}
              </div>
            )}
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
                  Email or Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="email" name="email" type="email" autoComplete="email" required
                    value={form.email} onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password" name="password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password" required
                    value={form.password} onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPw
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    }
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded" />
                <span className="text-sm text-gray-600">Keep me logged in for 30 days</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              type="button"
              className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>

          {/* ── Right: dark panel ── */}
          <div className="w-80 bg-[#1a2332] px-8 py-12 flex flex-col justify-between shrink-0">
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-3">Streamline Your Support</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Join 500+ enterprise teams managing incidents with pixel-perfect precision.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-white/10 rounded-xl px-4 py-3">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Resolution Rate</p>
                <p className="text-white text-2xl font-extrabold">98.4%</p>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Avg. Response Time</p>
                <p className="text-white text-2xl font-extrabold">12 mins</p>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-4">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-3">Recent Activity</p>
                <div className="flex flex-col gap-2">
                  {['Ticket #4402 resolved by Sarah', 'New Incident #4405 reported'].map((a, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                        {i === 0 ? 'S' : 'A'}
                      </div>
                      <span className="text-white/70 text-xs">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Enterprise-grade security encryption active
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
