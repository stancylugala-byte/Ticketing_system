import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import AuthNavbar from '../components/AuthNavbar';

function getStrength(pw) {
  if (!pw) return { label: '', color: '', width: '0%' };
  if (pw.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
  if (pw.length < 10 || !/[!@#$%^&*]/.test(pw)) return { label: 'Fair', color: 'bg-yellow-400', width: '55%' };
  return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', password: '', role: 'Client' });
  const [showPw, setShowPw]     = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = getStrength(form.password);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setFieldErrors(fe => ({ ...fe, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError('You must agree to the Terms of Service and Privacy Policy.'); return; }
    setLoading(true);
    setError('');
    setFieldErrors({});
    try {
      await registerUser({ full_name: form.full_name, email: form.email, password: form.password, role: form.role });
      navigate('/login', { state: { message: 'Account created successfully! Please sign in.' } });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        const fe = {};
        data.errors.forEach(e => { fe[e.field] = e.message; });
        setFieldErrors(fe);
      } else {
        setError(data?.message || 'Registration failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  const Field = ({ id, label, type = 'text', placeholder, name, children }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children || (
        <input id={id} name={name || id} type={type} placeholder={placeholder} required
          value={form[name || id]} onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400
            ${fieldErrors[name || id] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
        />
      )}
      {fieldErrors[name || id] && <p className="mt-1 text-xs text-red-500">{fieldErrors[name || id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f4f9]">
      <AuthNavbar showLogin={false} showSignUp={false} />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex">

          {/* ── Left: form ── */}
          <div className="flex-1 px-10 py-10">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm mb-6">Join thousands of teams managing incidents with JavaPA.</p>

            {/* Google button */}
            <button className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-4">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] text-gray-400 font-semibold tracking-wider">OR REGISTER WITH EMAIL</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Account type toggle */}
            <div className="flex mb-5 border border-gray-200 rounded-xl overflow-hidden">
              {[{ val: 'Client', icon: '👤', label: 'Individual' }, { val: 'SupportOfficer', icon: '🏢', label: 'Company' }].map(t => (
                <button key={t.val} type="button"
                  onClick={() => setForm(f => ({ ...f, role: t.val }))}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all
                    ${form.role === t.val ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>

            {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field id="full_name" label="Full Name" placeholder="Jane Doe" />
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000"
                    value={form.phone} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
                  />
                </div>
              </div>

              <Field id="email" label="Work Email" type="email" placeholder="jane@company.com" />

              {/* Password with strength */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={showPw ? 'text' : 'password'} required
                    placeholder="••••••••" value={form.password} onChange={handleChange}
                    className={`w-full pl-4 pr-11 py-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400
                      ${fieldErrors.password ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'}`}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {showPw
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                      }
                    </svg>
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Strength: {strength.label}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} rounded-full transition-all duration-300`} style={{ width: strength.width }} />
                    </div>
                  </div>
                )}
                {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-blue-600 shrink-0" />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">Privacy Policy</a>.
                </span>
              </label>

              <button type="submit" disabled={loading || !agreed}
                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">Sign In</Link>
            </p>
          </div>

          {/* ── Right: info panel ── */}
          <div className="w-72 bg-[#eef2ff] px-8 py-10 flex flex-col gap-6 shrink-0">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">The Engine Behind Reliable Teams</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Join 10,000+ organizations that trust JavaPA to monitor, triage, and resolve incidents faster than ever.</p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { icon: '⚡', title: 'Real-time Coordination', desc: 'Collaborate seamlessly across Slack, Teams, and Zoom.' },
                { icon: '🤖', title: 'Automated Triage', desc: 'Route incidents to the right person instantly with AI.' },
                { icon: '🌍', title: 'Global Compliance', desc: 'SOC 2 Type II and GDPR compliant infrastructure.' },
              ].map(f => (
                <div key={f.title} className="flex gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#0f1623] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-white text-xs font-bold uppercase tracking-wider">Enterprise Security</span>
              </div>
              <p className="text-white/40 text-[11px]">Encryption at rest &amp; in transit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
