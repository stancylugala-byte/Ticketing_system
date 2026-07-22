import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { useSystemSettings } from '../context/SystemSettingsContext';
import AuthNavbar from '../components/AuthNavbar';
import heroBg from '../assets/hero.png';

function getStrength(pw) {
  if (!pw) return { label: '', color: '', width: '0%' };
  if (pw.length < 4) return { label: 'Weak',   color: 'bg-red-500',    width: '25%' };
  if (pw.length < 6) return { label: 'Fair',   color: 'bg-yellow-400', width: '55%' };
  return               { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
}

const EyeIcon = ({ open }) => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    {open
      ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
    }
  </svg>
);

export default function SignupPage() {
  const navigate = useNavigate();
  const { settings } = useSystemSettings();
  const [accountType, setAccountType] = useState('individual');
  const [form, setForm]       = useState({ full_name: '', email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,  setError]    = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = getStrength(form.password);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setFieldErrors(fe => ({ ...fe, [e.target.name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!agreed) { setError('Please agree to the Terms of Service.'); return; }
    if (submitting) return;
    setSubmitting(true);
    setError('');
    setFieldErrors({});
    try {
      await registerUser({ full_name: form.full_name, email: form.email, password: form.password, role: 'Client' });
      navigate('/login', { state: { message: 'Account created! Please sign in.' } });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        const fe = {};
        data.errors.forEach(e => { fe[e.field] = e.message; });
        setFieldErrors(fe);
      } else {
        setError(data?.message || 'Registration failed. Please try again.');
      }
    } finally { setSubmitting(false); }
  };

  // Reusable input class — dark mode aware
  const inp = field =>
    `w-full px-3 py-2 rounded-xl text-sm outline-none transition-all
     bg-white dark:bg-slate-900
     text-gray-900 dark:text-slate-100
     placeholder-gray-400 dark:placeholder-slate-500
     border ${fieldErrors[field]
       ? 'border-red-400 focus:border-red-400'
       : 'border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400'}
     focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20`;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AuthNavbar showLogin={false} showSignUp={false} />

      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: form ── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 sm:px-6 py-4 overflow-y-auto">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 px-7 py-5">

            {/* Heading */}
            <h1 className="text-lg font-extrabold text-gray-900 dark:text-white mb-0.5">Create your account</h1>
            <p className="text-gray-500 dark:text-slate-400 text-xs mb-3">Join thousands of teams managing incidents with JavaPA.</p>

            {/* Google SSO */}
            <button type="button"
              onClick={() => { window.location.href = 'http://localhost:5000/api/auth/google'; }}
              className="w-full py-2 border border-gray-200 dark:border-slate-600 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold
                text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors mb-3">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
              <span className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold tracking-wider">OR EMAIL</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
            </div>

            {/* Account type — both options create a Client account */}
            <div className="flex mb-3 border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
              {[{ val: 'individual', label: '👤 Individual' }, { val: 'company', label: '🏢 Company' }].map(t => (
                <button key={t.val} type="button"
                  onClick={() => setAccountType(t.val)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold transition-all
                    ${accountType === t.val
                      ? 'text-white border-b-2'
                      : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                  style={accountType === t.val ? { background: `${settings.primaryColor}20`, borderColor: settings.primaryColor || '#2563eb', color: settings.primaryColor || '#2563eb' } : {}}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-2 px-3 py-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-700 dark:text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Full Name</label>
                <input name="full_name" type="text" required placeholder="Jane Doe"
                  value={form.full_name} onChange={handleChange} className={inp('full_name')} />
                {fieldErrors.full_name && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.full_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Work Email</label>
                <input name="email" type="email" required placeholder="jane@company.com"
                  value={form.email} onChange={handleChange} className={inp('email')} />
                {fieldErrors.email && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <input name="password" type={showPw ? 'text' : 'password'} required
                    placeholder="Min 6 characters" value={form.password} onChange={handleChange}
                    className={inp('password') + ' pr-10'} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300">
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                {form.password && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} rounded-full transition-all`} style={{ width: strength.width }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer mt-0.5">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-blue-600 shrink-0" />
                <span className="text-xs text-gray-600 dark:text-slate-400">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Privacy Policy</a>.
                </span>
              </label>

              {/* Submit */}
              <button type="submit" disabled={submitting || !agreed}
                className="w-full py-2.5 text-white font-bold rounded-xl disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-sm mt-1"
                style={{ background: settings.primaryColor || '#2563eb' }}>
                {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {submitting ? 'Creating…' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 dark:text-slate-400 mt-3">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:opacity-80 transition-opacity"
                style={{ color: settings.primaryColor || '#2563eb' }}>Sign In</Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT: hero image ── */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img src={heroBg} alt="JavaPA" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900/40 to-slate-900/80" />
          <div className="absolute inset-0 flex flex-col justify-end px-10 py-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-2">Trusted by 10,000+ teams</p>
            <h2 className="text-2xl font-extrabold text-white leading-snug mb-3">
              The Enterprise Support<br />Platform Built for Scale
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Monitor, triage, and resolve incidents faster than ever with JavaPA's intelligent support hub.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
