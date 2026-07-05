import { Link } from 'react-router-dom';

const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'SLA Compliance',
    desc: 'Automated alerts and escalation rules ensure you never miss a contractual deadline or critical response window.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Automated Routing',
    desc: 'Intelligent ticket assignment based on engineer workload, expertise, and timezone for maximum efficiency.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Deep Analytics',
    desc: 'Visualize mean-time-to-resolution (MTTR), ticket volume trends, and team performance with one-click reports.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Team Collaboration',
    desc: 'Shared workspaces and internal notes allow your team to solve complex problems together in real-time.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Omnichannel Support',
    desc: 'Ingest tickets from email, chat, API, and social media into a single, unified command center.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Smart Responses',
    desc: 'AI-driven suggestions and canned responses to help your agents close tickets 40% faster than before.',
  },
];

const steps = [
  { num: '01', title: 'Connect Sources', desc: 'Link your email, monitoring tools, and chat channels to our unified API.' },
  { num: '02', title: 'Define Rules', desc: 'Set up escalation paths, SLAs, and automated assignment policies.' },
  { num: '03', title: 'Triage & Solve', desc: 'Manage incidents in real-time with our high-performance dashboard.' },
  { num: '04', title: 'Analyze & Optimize', desc: 'Use our reporting engine to identify bottlenecks and improve performance.' },
];

const testimonials = [
  { quote: '"JavaPA transformed how we handle outages. Our MTTR dropped by 60% in the first quarter alone. The automation rules and SLA tracking are game-changers for our team."', author: 'Marcus T.', role: 'VP Engineering, TechCorp' },
  { quote: '"The best ticketing system we\'ve used in a decade. It\'s fast, intuitive, and the Slack integration is second to none. Our agents love it."', author: 'Priya S.', role: 'Head of Support, CloudBase' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ── */}
      <nav className="bg-[#0f1623] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold text-[15px]">JavaPA</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Home','Features','Pricing','Testimonials','Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-white/70 text-sm hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-white/80 text-sm font-medium hover:text-white transition-colors px-2">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="home" className="bg-[#f1f4f9] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              New: AI-Powered Incident Resolution v2.4
            </span>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Master Your<br />
              <span className="text-blue-600">Incident<br />Lifecycle</span> with<br />
              Enterprise Ease.
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
              JavaPA Software Limited provides a modern, high-performance SaaS platform for support ticketing, automated incident response, and SLA management.
            </p>
            <div className="flex items-center gap-4 mb-10">
              <Link to="/signup" className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-sm">
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <button className="flex items-center gap-2 text-gray-700 font-semibold text-sm hover:text-blue-600 transition-colors">
                <div className="w-9 h-9 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-blue-400 transition-colors">
                  <svg className="w-3.5 h-3.5 text-gray-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                Explore Demo
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['bg-blue-400','bg-blue-500','bg-blue-600','bg-blue-700'].map((c,i) => (
                  <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>{String.fromCharCode(65+i)}</div>
                ))}
              </div>
              <p className="text-sm text-gray-500">Trusted by <span className="font-bold text-gray-800">500+</span> teams worldwide</p>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-full max-w-lg">
              <div className="bg-[#0f1623] rounded-xl p-4 aspect-video flex items-center justify-center">
                <div className="grid grid-cols-2 gap-3 w-full">
                  {['bg-teal-400','bg-blue-400','bg-purple-400','bg-indigo-400'].map((c,i) => (
                    <div key={i} className={`${c} bg-opacity-20 border border-white/10 rounded-lg p-3 h-20 flex flex-col justify-between`}>
                      <div className="h-1.5 bg-white/30 rounded w-3/4" />
                      <div className="h-8 bg-white/20 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                <div className="flex gap-1">{[1,2,3].map(i => <div key={i} className="w-16 h-2 bg-gray-200 rounded" />)}</div>
                <div className="text-xs text-gray-400 font-medium">Live Dashboard</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12 text-xs font-bold text-gray-400 tracking-[0.25em] uppercase">Powering Global Leaders</div>
      </section>

      {/* ── Core Capabilities ── */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Core Capabilities</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Everything you need to manage incidents from discovery to post-mortem analysis without the friction.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Simplify Workflow ── */}
      <section className="py-20 bg-[#f1f4f9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Simplify Your Workflow</h2>
            <p className="text-gray-500 text-lg">From onboarding to operational excellence in four simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.num} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-4">Step {s.num}</span>
                <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="w-1 h-8 bg-blue-600 rounded inline-block mr-4 align-middle" />
              <h2 className="text-3xl font-extrabold text-gray-900 inline">What Our Clients Say</h2>
              <p className="text-gray-500 mt-2 ml-5">Join thousands of companies who trust JavaPA for their mission-critical support.</p>
            </div>
            <a href="#" className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View Case Studies
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{t.author[1]}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-[#0f1623] rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to streamline your support?</h2>
          <p className="text-white/60 text-lg mb-8">Start your 14-day free trial today. No credit card required. Cancel anytime.</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link to="/signup" className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm">Get Started Now</Link>
            <button className="px-8 py-3.5 border-2 border-white/30 text-white font-bold rounded-xl hover:border-white/60 transition-colors text-sm">Contact Sales</button>
          </div>
          <p className="text-white/40 text-xs">Free forever for teams up to 3 users. Explore our enterprise plans for more.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0f1623] pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-white font-bold">JavaPA</span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed mb-4">Enterprise-grade incident management and support ticketing system for modern teams.</p>
              <div className="flex gap-3">
                {['T','in','G'].map(s => <div key={s} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 text-xs font-bold hover:bg-white/20 cursor-pointer transition-colors">{s}</div>)}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features','Pricing','Integrations','Changelog'] },
              { title: 'Company', links: ['About Us','Careers','Legal','Privacy Policy'] },
              { title: 'Contact', links: ['support@javapa.com','+1 (555) 000-0000','24/7 Support'] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-white font-semibold text-sm mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(l => <li key={l}><a href="#" className="text-white/40 text-xs hover:text-white/80 transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">© 2026 JavaPA Software Limited. Modern Ticketing Solutions.</p>
            <div className="flex gap-5">
              {['Terms of Service','Security','Cookies'].map(l => <a key={l} href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
