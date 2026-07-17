import { useTheme } from '../context/ThemeContext';

export default function DarkModeToggle({ className = '' }) {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 shrink-0 cursor-pointer
        ${dark
          ? 'bg-slate-700 border-slate-600 text-yellow-400 hover:bg-slate-600'
          : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
        } ${className}`}
    >
      {dark ? (
        /* Sun — switch to light */
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        /* Moon — switch to dark */
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
      <span className="text-xs font-medium">{dark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
