import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DEFAULTS = {
  // Branding
  companyName:    'JavaPA',
  tagline:        'Support Hub',
  logoUrl:        '',           // base64 or URL
  faviconUrl:     '',

  // Colour palette — CSS custom property values
  primaryColor:   '#2563eb',    // blue-600
  accentColor:    '#7c3aed',    // violet-600
  sidebarBg:      '#0f1623',
  headerBg:       '#ffffff',

  // Contact & policies
  supportEmail:   'support@javapa.com',
  supportPhone:   '+1 (555) 000-0000',
  websiteUrl:     'https://javapa.com',
  privacyPolicyUrl: '#',
  termsUrl:         '#',
  slaPolicyUrl:     '#',

  // Footer
  footerText:     '© 2026 JavaPA Software Limited. All rights reserved.',
  copyrightYear:  '2026',
};

const SystemSettingsContext = createContext(null);

const STORAGE_KEY = 'jpa_system_settings';

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
};

const applyCssVars = (settings) => {
  const root = document.documentElement;
  root.style.setProperty('--color-primary',  settings.primaryColor);
  root.style.setProperty('--color-accent',   settings.accentColor);
  root.style.setProperty('--color-sidebar',  settings.sidebarBg);
  root.style.setProperty('--color-header',   settings.headerBg);
};

export function SystemSettingsProvider({ children }) {
  const [settings, setSettings] = useState(load);

  // Apply CSS vars whenever settings change
  useEffect(() => {
    applyCssVars(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply on mount immediately
  useEffect(() => { applyCssVars(load()); }, []);

  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULTS });
  }, []);

  return (
    <SystemSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SystemSettingsContext.Provider>
  );
}

export const useSystemSettings = () => {
  const ctx = useContext(SystemSettingsContext);
  if (!ctx) return { settings: DEFAULTS, updateSettings: () => {}, resetSettings: () => {} };
  return ctx;
};
