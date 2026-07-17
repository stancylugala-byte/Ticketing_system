import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordReq } from '../api/auth';
import AuthNavbar from '../components/AuthNavbar';

function Check({ pass, label }) {
  return (
    <li className={`flex items-center gap-2 text-xs ${pass ? 'text-emerald-600' : 'text-gray-400 dark:text-slate-500'}`}>
      <span className={`w-3 h-3 rounded-full flex items-center justify-center shrink-0 ${pass ? 'bg-emerald-100' : 'bg-gray-100 dark:bg-slate-700'}`}>
        {pass
          ? <svg className="w-2 h-2" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          : <svg className="w-2 h-2" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        }
      </span>
      {label}
    </li>
  );
}

const EyeBtn = ({ show, toggle }) => (
  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      {show
        ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
      }
    </svg>
  </button>
);

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [form, setForm]     = useState({ password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const checks = {
    length:    form.password.length >= 6,
    uppercase: /[A-Z]/.test(form.password),
    special:   /[!@#$%^&*(),.?":{}|<>@]/.test(form.password),
  };
  const allValid  = Object.values(checks).every(Boolean);
  const matches   = form.password === form.confirm && form.confirm.length > 0;
  const canSubmit = allValid && matches && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!token) { setError('Invalid reset link. Please request a new one.'); return; }
    setLoading(true);
    setError('');
    try {
      await resetPasswordReq({ token, password: form.password });
      navigate('/login', { state: { message: 'Password reset successfully! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-900 overflow-hidden">
      <AuthNavbar showLogin={false} showSignUp showOnlySignUp />

      <div className="flex-1 flex flex-col items-center justify-center px-4">

        {/* Back link */}
        <div className="w-full max-w-sm mb-3">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-200">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Sign In
          </Link>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 px-8 py-7">

          {/* Shield */}
          <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1 text-center">Reset your password</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm text-center mb-5">Create a strong password you haven't used before.</p>

          {!token && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              Invalid reset token. Please request a new link.
            </div>
          )}
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* New password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">New Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input id="password" type={showPw ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400 transition-all" />
                <EyeBtn show={showPw} toggle={() => setShowPw(v => !v)} />
              </div>
              {form.password.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1 pl-1">
                  <Check pass={checks.length}    label="At least 6 characters" />
                  <Check pass={checks.uppercase} label="One uppercase letter" />
                  <Check pass={checks.special}   label="One special character" />
                </ul>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">Confirm New Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input id="confirm" type={showCf ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  className={`w-full pl-9 pr-10 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 placeholder-gray-400 transition-all
                    ${form.confirm && !matches ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100'}`} />
                <EyeBtn show={showCf} toggle={() => setShowCf(v => !v)} />
              </div>
              {form.confirm && !matches && <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>}
              {matches && <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Passwords match</p>}
            </div>

            <button type="submit" disabled={!canSubmit}
              className="w-full py-2.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Resetting...' : 'Set new password'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-4">
            Need help? Contact our{' '}
            <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">Security Center</a>
          </p>
        </div>

        {/* Security badges */}
        <div className="flex items-center gap-5 mt-4 text-gray-400 dark:text-slate-500 text-xs">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            SSL Secure
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            End-to-End Encrypted
          </span>
        </div>

      </div>
    </div>
  );
}
