import { Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const features = [
  { icon: '🛡', title: 'SLA Compliance', desc: 'Automated alerts and escalation rules ensure you never miss a contractual deadline or critical response window.' },
  { icon: '⚡', title: 'Automated Routing', desc: 'Intelligent ticket assignment based on engineer workload, expertise, and timezone for maximum efficiency.' },
  { icon: '📊', title: 'Deep Analytics', desc: 'Visualize MTTR, ticket volume trends, and team performance with one-click reports.' },
  { icon: '👥', title: 'Team Collaboration', desc: 'Shared workspaces and internal notes allow your team to solve complex problems together in real-time.' },
  { icon: '🌐', title: 'Omnichannel Support', desc: 'Ingest tickets from email, chat, API, and social media into a single, unified command center.' },
  { icon: '🤖', title: 'Smart Responses', desc: 'AI-driven suggestions and canned responses to help your agents close tickets 40% faster.' },
];

const steps = [
  { num: '01', title: 'Connect Sources',    desc: 'Link your email, monitoring tools, and chat channels to our unified API.' },
  { num: '02', title: 'Define Rules',       desc: 'Set up escalation paths, SLAs, and automated assignment policies.' },
  { num: '03', title: 'Triage & Solve',     desc: 'Manage incidents in real-time with our high-performance dashboard.' },
  { num: '04', title: 'Analyze & Optimize', desc: 'Use our reporting engine to identify bottlenecks and improve performance.' },
];

const testimonials = [
  { quote: '"JavaPA transformed how we handle outages. Our MTTR dropped by 60% in the first quarter alone. The automation rules and SLA tracking are game-changers."', author: 'Marcus T.', role: 'VP Engineering, TechCorp' },
  { quote: '"The best ticketing system we\'ve used in a decade. It\'s fast, intuitive, and the integration is second to none. Our agents love it."', author: 'Priya S.', role: 'Head of Support, CloudBase' },
];

const pricing = [
  {
    name: 'Starter',
    price: 'Free',
    sub: 'Up to 3 users · forever',
    color: 'border-gray-200 dark:border-slate-700',
    btn: 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600',
    features: ['Unlimited tickets', '1 support inbox', 'Basic SLA policies', 'Email notifications'],
  },
  {
    name: 'Professional',
    price: '$29',
    sub: 'per agent / month',
    color: 'border-blue-500 ring-2 ring-blue-500/20',
    badge: 'Most Popular',
    btn: 'bg-blue-600 text-white hover:bg-blue-700',
    features: ['Everything in Starter', 'Unlimited agents', 'Custom SLA rules', 'Analytics dashboard', 'Developer escalation', 'Priority support'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    sub: 'contact us for pricing',
    color: 'border-gray-200 dark:border-slate-700',
    btn: 'bg-gray-900 dark:bg-slate-600 text-white hover:bg-gray-800',
    features: ['Everything in Pro', 'SSO / SAML', 'Dedicated account manager', 'Custom integrations', 'SLA guarantees', 'On-premise option'],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">

      {/* ── Navbar ── */}
      <nav className="bg-gray-900 dark:bg-slate-950 sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold text-[15px]">JavaPA</span>
          </div>

          {/* Nav links — each href matches a section id below */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home',         href: '#home' },
              { label: 'Features',     href: '#features' },
              { label: 'Pricing',      href: '#pricing' },
              { label: 'Testimonials', href: '#testimonials' },
              { label: 'Contact',      href: '#contact' },
            ].map(({ label, href }) => (
              <a key={label} href={href}
                className="text-white/70 text-sm hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link to="/login"  className="text-white/80 text-sm font-medium hover:text-white transition-colors px-2">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="home" className="bg-gray-50 dark:bg-slate-900 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              New: AI-Powered Incident Resolution v2.4
            </span>
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
              Master Your<br />
              <span className="text-blue-600">Incident<br />Lifecycle</span> with<br />
              Enterprise Ease.
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
              JavaPA Software Limited provides a modern, high-performance SaaS platform for support ticketing, automated incident response, and SLA management.
            </p>
            <div className="flex items-center gap-4 mb-10">
              <Link to="/signup" className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200/50 text-sm">
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <button className="flex items-center gap-2 text-gray-700 dark:text-slate-300 font-semibold text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <div className="w-9 h-9 border-2 border-gray-300 dark:border-slate-600 rounded-full flex items-center justify-center hover:border-blue-400 transition-colors">
                  <svg className="w-3.5 h-3.5 text-gray-600 dark:text-slate-400 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                Explore Demo
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['bg-blue-400','bg-blue-500','bg-blue-600','bg-blue-700'].map((c,i) => (
                  <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px] font-bold`}>
                    {String.fromCharCode(65+i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Trusted by <span className="font-bold text-gray-800 dark:text-white">500+</span> teams worldwide</p>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-4 w-full max-w-lg">
              <div className="bg-gray-900 dark:bg-slate-900 rounded-xl p-4 aspect-video flex items-center justify-center">
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
                <div className="flex gap-1">{[1,2,3].map(i => <div key={i} className="w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded" />)}</div>
                <div className="text-xs text-gray-400 dark:text-slate-500 font-medium">Live Dashboard</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12 text-xs font-bold text-gray-400 dark:text-slate-600 tracking-[0.25em] uppercase">Powering Global Leaders</div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Core Capabilities</h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to manage incidents from discovery to post-mortem analysis without the friction.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-xl">{f.icon}</div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow steps ── */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Simplify Your Workflow</h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg">From onboarding to operational excellence in four simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.num} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-all">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-4">Step {s.num}</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="w-1 h-8 bg-blue-600 rounded inline-block mr-4 align-middle" />
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white inline">What Our Clients Say</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2 ml-5">Join thousands of companies who trust JavaPA for mission-critical support.</p>
            </div>
            <a href="#contact" className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Contact Us
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed mb-4 italic">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{t.author[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.author}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg">No hidden fees. Cancel anytime. Start free, scale as you grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map(p => (
              <div key={p.name} className={`bg-white dark:bg-slate-800 rounded-2xl border p-6 flex flex-col relative ${p.color}`}>
                {p.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">{p.badge}</span>
                )}
                <p className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">{p.name}</p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">{p.price}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mb-6">{p.sub}</p>
                <ul className="flex-1 space-y-2.5 mb-6">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`block text-center py-2.5 rounded-xl text-sm font-bold transition-colors ${p.btn}`}>
                  {p.price === 'Free' ? 'Get Started' : p.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
          <p className="text-gray-500 dark:text-slate-400 text-lg mb-10">Have questions? Our team is available 24/7 to help you get up and running.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '📧', label: 'Email Us', value: 'support@javapa.com' },
              { icon: '📞', label: 'Call Us', value: '+1 (555) 000-0000' },
              { icon: '💬', label: 'Live Chat', value: 'Available 24/7' },
            ].map(c => (
              <div key={c.label} className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
                <div className="text-2xl mb-2">{c.icon}</div>
                <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">{c.label}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{c.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup" className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm">Get Started Now</Link>
            <a href="mailto:support@javapa.com" className="px-8 py-3.5 border-2 border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-200 font-bold rounded-xl hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Email Sales</a>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto bg-gray-900 dark:bg-slate-800 rounded-3xl p-12 text-center border border-white/10">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to streamline your support?</h2>
          <p className="text-white/60 text-lg mb-8">Start your 14-day free trial today. No credit card required. Cancel anytime.</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link to="/signup" className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm">Get Started Now</Link>
            <a href="#contact" className="px-8 py-3.5 border-2 border-white/30 text-white font-bold rounded-xl hover:border-white/60 transition-colors text-sm">Contact Sales</a>
          </div>
          <p className="text-white/40 text-xs">Free forever for teams up to 3 users.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 dark:bg-slate-950 pt-12 pb-6">
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
              <p className="text-white/40 text-xs leading-relaxed mb-4">Enterprise-grade incident management and support ticketing for modern teams.</p>
              <div className="flex gap-3">
                {['T','in','G'].map(s => (
                  <div key={s} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 text-xs font-bold hover:bg-white/20 cursor-pointer transition-colors">{s}</div>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features','Pricing','Integrations','Changelog'] },
              { title: 'Company', links: ['About Us','Careers','Legal','Privacy Policy'] },
              { title: 'Contact', links: ['support@javapa.com','+1 (555) 000-0000','24/7 Live Chat'] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-white font-semibold text-sm mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}><a href="#contact" className="text-white/40 text-xs hover:text-white/80 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">© 2026 JavaPA Software Limited. Modern Ticketing Solutions.</p>
            <div className="flex gap-5">
              {['Terms of Service','Security','Cookies'].map(l => (
                <a key={l} href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
