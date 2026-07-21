import { useState, useRef } from 'react';
import { useSystemSettings } from '../../context/SystemSettingsContext';

const COLOR_PRESETS = [
  { label: 'Ocean Blue',   primary: '#2563eb', accent: '#7c3aed', sidebar: '#0f1623', header: '#ffffff' },
  { label: 'Forest Green', primary: '#16a34a', accent: '#d97706', sidebar: '#14532d', header: '#ffffff' },
  { label: 'Ruby Red',     primary: '#dc2626', accent: '#9333ea', sidebar: '#1c0a0a', header: '#ffffff' },
  { label: 'Midnight',     primary: '#6366f1', accent: '#ec4899', sidebar: '#1e1b4b', header: '#0f172a' },
  { label: 'Amber',        primary: '#d97706', accent: '#2563eb', sidebar: '#1c1400', header: '#ffffff' },
  { label: 'Teal',         primary: '#0891b2', accent: '#7c3aed', sidebar: '#0c2233', header: '#ffffff' },
];

function Section({ title, icon, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder-gray-400 transition-all";

export default function SystemSettingsView() {
  const { settings, updateSettings, resetSettings } = useSystemSettings();
  const [local, setLocal]     = useState({ ...settings });
  const [saved, setSaved]     = useState(false);
  const [logoPreview, setLogoPreview] = useState(settings.logoUrl || '');
  const logoInputRef = useRef(null);

  const handleChange = (field, value) => {
    setLocal(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Logo must be under 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setLogoPreview(dataUrl);
      handleChange('logoUrl', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (preset) => {
    setLocal(prev => ({
      ...prev,
      primaryColor: preset.primary,
      accentColor:  preset.accent,
      sidebarBg:    preset.sidebar,
      headerBg:     preset.header,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (!confirm('Reset all settings to default? This cannot be undone.')) return;
    resetSettings();
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">System Settings</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Configure global branding, colours, contact info, and policies. Changes apply system-wide.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset}
            className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            Reset to Defaults
          </button>
          <button onClick={handleSave}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2
              ${saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Branding */}
      <Section title="Branding & Identity" icon="🏢">
        <div className="grid grid-cols-2 gap-5">
          <Field label="Company Name" hint="Displayed in headers and emails">
            <input className={inputCls} value={local.companyName}
              onChange={e => handleChange('companyName', e.target.value)} placeholder="JavaPA" />
          </Field>
          <Field label="Tagline / Portal Name">
            <input className={inputCls} value={local.tagline}
              onChange={e => handleChange('tagline', e.target.value)} placeholder="Support Hub" />
          </Field>
          <Field label="Website URL">
            <input className={inputCls} value={local.websiteUrl}
              onChange={e => handleChange('websiteUrl', e.target.value)} placeholder="https://javapa.com" />
          </Field>
          <Field label="Copyright Year">
            <input className={inputCls} value={local.copyrightYear}
              onChange={e => handleChange('copyrightYear', e.target.value)} placeholder="2026" />
          </Field>

          {/* Logo upload — full width */}
          <div className="col-span-2">
            <Field label="Company Logo" hint="PNG/SVG recommended. Max 5 MB. Displayed in sidebars and navbars.">
              <div className="flex items-center gap-5">
                <div className="w-24 h-16 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 flex items-center justify-center bg-gray-50 dark:bg-slate-800 overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  <button onClick={() => logoInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
                    Upload Logo
                  </button>
                  {logoPreview && (
                    <button onClick={() => { setLogoPreview(''); handleChange('logoUrl', ''); }}
                      className="px-4 py-2 text-red-500 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </Field>
          </div>
        </div>
      </Section>

      {/* Colour Theme */}
      <Section title="Colour Theme" icon="🎨">
        <div className="flex flex-col gap-5">
          {/* Presets */}
          <Field label="Quick Presets" hint="Click a preset to apply it instantly">
            <div className="grid grid-cols-3 gap-3 mt-1">
              {COLOR_PRESETS.map(preset => (
                <button key={preset.label} onClick={() => applyPreset(preset)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all bg-white dark:bg-slate-800 group">
                  <div className="flex gap-1.5 shrink-0">
                    <span className="w-4 h-4 rounded-full border border-white/30 shadow-sm" style={{ background: preset.primary }} />
                    <span className="w-4 h-4 rounded-full border border-white/30 shadow-sm" style={{ background: preset.accent }} />
                    <span className="w-4 h-4 rounded-full border border-white/30 shadow-sm" style={{ background: preset.sidebar }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">{preset.label}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* Custom colours */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { field: 'primaryColor', label: 'Primary Colour',  hint: 'Buttons, links, highlights' },
              { field: 'accentColor',  label: 'Accent Colour',   hint: 'Secondary highlights' },
              { field: 'sidebarBg',    label: 'Sidebar Colour',  hint: 'Navigation background' },
              { field: 'headerBg',     label: 'Header Colour',   hint: 'Topbar background' },
            ].map(c => (
              <Field key={c.field} label={c.label} hint={c.hint}>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input type="color" value={local[c.field]}
                      onChange={e => handleChange(c.field, e.target.value)}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 dark:border-slate-600 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <input type="text" value={local[c.field]}
                    onChange={e => {
                      const v = e.target.value;
                      if (/^#[0-9a-fA-F]{0,6}$/.test(v)) handleChange(c.field, v);
                    }}
                    className="flex-1 px-2.5 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-xs font-mono outline-none focus:border-blue-400 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200"
                    maxLength={7}
                  />
                </div>
              </Field>
            ))}
          </div>

          {/* Live preview */}
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Live Preview</p>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 shadow-md">
              {/* Mock sidebar */}
              <div className="flex h-28">
                <div className="w-36 flex flex-col gap-1 p-3" style={{ background: local.sidebarBg }}>
                  <div className="flex items-center gap-2 mb-2">
                    {local.logoUrl
                      ? <img src={local.logoUrl} alt="" className="w-5 h-5 object-contain" />
                      : <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ background: local.primaryColor }}>▲</div>
                    }
                    <span className="text-white text-[10px] font-bold truncate">{local.companyName || 'JavaPA'}</span>
                  </div>
                  {['Dashboard','Tickets','Reports'].map(item => (
                    <div key={item} className="px-2 py-1 rounded text-[9px] font-medium text-white/60">{item}</div>
                  ))}
                </div>
                {/* Mock header + content */}
                <div className="flex-1 flex flex-col">
                  <div className="h-8 flex items-center px-3 justify-between" style={{ background: local.headerBg }}>
                    <span className="text-[9px] font-semibold text-gray-600 dark:text-slate-300">Management Portal</span>
                    <div className="w-16 h-4 rounded-full" style={{ background: local.primaryColor, opacity: 0.9 }} />
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-slate-900 p-2 flex gap-2">
                    {[local.primaryColor, local.accentColor, '#e5e7eb'].map((bg, i) => (
                      <div key={i} className="flex-1 rounded h-full" style={{ background: bg, opacity: i === 2 ? 1 : 0.15 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Contact & Support */}
      <Section title="Contact & Support" icon="📞">
        <div className="grid grid-cols-2 gap-5">
          <Field label="Support Email">
            <input className={inputCls} type="email" value={local.supportEmail}
              onChange={e => handleChange('supportEmail', e.target.value)} placeholder="support@javapa.com" />
          </Field>
          <Field label="Support Phone">
            <input className={inputCls} type="tel" value={local.supportPhone}
              onChange={e => handleChange('supportPhone', e.target.value)} placeholder="+1 (555) 000-0000" />
          </Field>
        </div>
      </Section>

      {/* Policies & Legal */}
      <Section title="Policies & Legal Links" icon="📋">
        <div className="grid grid-cols-2 gap-5">
          <Field label="Privacy Policy URL" hint="Linked in footers across all dashboards">
            <input className={inputCls} value={local.privacyPolicyUrl}
              onChange={e => handleChange('privacyPolicyUrl', e.target.value)} placeholder="https://javapa.com/privacy" />
          </Field>
          <Field label="Terms of Service URL">
            <input className={inputCls} value={local.termsUrl}
              onChange={e => handleChange('termsUrl', e.target.value)} placeholder="https://javapa.com/terms" />
          </Field>
          <Field label="SLA Policy URL">
            <input className={inputCls} value={local.slaPolicyUrl}
              onChange={e => handleChange('slaPolicyUrl', e.target.value)} placeholder="https://javapa.com/sla" />
          </Field>
          <Field label="Footer Copyright Text">
            <input className={inputCls} value={local.footerText}
              onChange={e => handleChange('footerText', e.target.value)}
              placeholder="© 2026 JavaPA Software Limited." />
          </Field>
        </div>
      </Section>

      {/* Danger zone */}
      <Section title="Reset & Maintenance" icon="⚠️">
        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Reset All Settings</p>
            <p className="text-xs text-red-500 dark:text-red-500 mt-0.5">Restore all system settings to factory defaults. Cannot be undone.</p>
          </div>
          <button onClick={handleReset}
            className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
            Reset Now
          </button>
        </div>
      </Section>
    </div>
  );
}

