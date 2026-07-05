import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordReq } from '../api/auth';
import AuthNavbar from '../components/AuthNavbar';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await forgotPasswordReq(email);
      setSent(true);
      // dev only — backend returns reset_url so we can test without email
      setResetUrl(res.data.data?.reset_url || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f4f9]">
      <AuthNavbar showLogin={false} showSignUp showOnlySignUp />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Shield icon above card */}
        <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 px-10 py-10">
          {!sent ? (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Forgot password?</h1>
              <p className="text-gray-500 text-sm mb-7 leading-relaxed">
                No worries! Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      id="email" type="email" required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to sign in
                </Link>
              </div>
            </>
          ) : (
            /* Success state */
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                We've sent a password reset link to <span className="font-semibold text-gray-800">{email}</span>.
                The link expires in 1 hour.
              </p>

              {/* Dev helper — shows reset link */}
              {resetUrl && (
                <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-xl text-left">
                  <p className="text-xs font-bold text-blue-600 mb-1.5">DEV MODE — Reset Link:</p>
                  <Link
                    to={resetUrl.replace('http://localhost:5173', '')}
                    className="text-xs text-blue-700 underline break-all leading-relaxed"
                  >
                    {resetUrl}
                  </Link>
                </div>
              )}

              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to sign in
              </Link>
            </div>
          )}
        </div>

        {/* Support footer */}
        <p className="mt-6 text-xs text-gray-400 text-center">
          Trouble signing in? Contact our 24/7 technical support<br />
          team at{' '}
          <a href="mailto:support@javapa.com" className="text-blue-600 hover:text-blue-700 font-medium">
            support@javapa.com
          </a>
        </p>
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-200 text-center text-xs text-gray-400">
        © 2026 JavaPA Software Limited. All rights reserved.
      </footer>
    </div>
  );
}
