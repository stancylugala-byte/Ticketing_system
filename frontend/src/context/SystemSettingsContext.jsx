import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveBlob, loadBlob } from '../utils/logoStorage';

// ── Defaults ──────────────────────────────────────────────────────────────────
const DEFAULTS = {
  // Branding
  companyName:    'JavaPA',
  tagline:        'Support Hub',
  logoUrl:        '',           // stored in IndexedDB, NOT localStorage
  faviconUrl:     '',           // stored in IndexedDB, NOT localStorage

  // Colour palette
  primaryColor:   '#2563eb',
  accentColor:    '#7c3aed',
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

// Keys that are large blobs — stored in IndexedDB, not localStorage
const BLOB_KEYS = ['logoUrl', 'faviconUrl'];

const STORAGE_KEY = 'jpa_system_settings';

// ── Helpers ───────────────────────────────────────────────────────────────────
const applyCssVars = (s) => {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', s.primaryColor);
  root.style.setProperty('--color-accent',  s.accentColor);
  root.style.setProperty('--color-sidebar', s.sidebarBg);
  root.style.setProperty('--color-header',  s.headerBg);
};

/** Load non-blob settings from localStorage */
const loadSmall = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    // Strip any old blob values that may have leaked into localStorage
    BLOB_KEYS.forEach(k => delete saved[k]);
    return { ...DEFAULTS, ...saved };
  } catch {
    return { ...DEFAULTS };
  }
};

/** Persist non-blob settings to localStorage (blobs excluded) */
const saveSmall = (settings) => {
  try {
    const small = { ...settings };
    BLOB_KEYS.forEach(k => delete small[k]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(small));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
};

// ── Context ───────────────────────────────────────────────────────────────────
const SystemSettingsContext = createContext(null);

export function SystemSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadSmall());
  const [ready,    setReady]    = useState(false);

  // On mount: load blob values from IndexedDB then mark ready
  useEffect(() => {
    Promise.all([
      loadBlob('logoUrl'),
      loadBlob('faviconUrl'),
    ]).then(([logoUrl, faviconUrl]) => {
      setSettings(prev => ({ ...prev, logoUrl, faviconUrl }));
      setReady(true);
    });
  }, []);

  // Whenever settings change: apply CSS vars + persist
  useEffect(() => {
    applyCssVars(settings);
    if (ready) saveSmall(settings);
  }, [settings, ready]);

  const updateSettings = useCallback((updates) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      // Persist any blob updates to IndexedDB immediately
      BLOB_KEYS.forEach(k => {
        if (k in updates) {
          saveBlob(k, updates[k] ?? '').catch(console.error);
        }
      });
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    // Clear blobs from IndexedDB too
    BLOB_KEYS.forEach(k => saveBlob(k, '').catch(console.error));
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
