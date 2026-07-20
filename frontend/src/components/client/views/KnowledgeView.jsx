import { useEffect, useState } from 'react';
import { getKbArticles } from '../../../api/clientApi';

const TYPE_CONFIG = {
  faqs: {
    title: 'FAQs',
    subtitle: 'Frequently asked questions and quick answers.',
    icon: '❓',
    emptyMsg: 'No FAQ articles found.',
    searchPlaceholder: 'Search FAQs...',
  },
  manuals: {
    title: 'User Manuals',
    subtitle: 'Comprehensive guides for using the JavaPA platform.',
    icon: '📖',
    emptyMsg: 'No user manuals found.',
    searchPlaceholder: 'Search manuals...',
  },
  troubleshooting: {
    title: 'Troubleshooting Guides',
    subtitle: 'Step-by-step solutions for common technical issues.',
    icon: '🔧',
    emptyMsg: 'No troubleshooting guides found.',
    searchPlaceholder: 'Search troubleshooting guides...',
  },
};

export default function KnowledgeView({ type = 'faqs' }) {
  const [articles, setArticles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(null);

  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.faqs;

  const load = (q = '') => {
    setLoading(true);
    getKbArticles(q || undefined)
      .then(r => setArticles(r.data.data || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setSearch('');
    setSelected(null);
    load();
  }, [type]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    load(q); // instant — no debounce
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Article list */}
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">{cfg.title}</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{cfg.subtitle}</p>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-sm pointer-events-none">🔍</span>
          <input
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 transition-all placeholder-gray-400"
            placeholder={cfg.searchPlaceholder}
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* Articles */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400 dark:text-slate-500 gap-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <span className="text-3xl">{cfg.icon}</span>
            <p className="text-sm font-medium">{cfg.emptyMsg}</p>
            {search && <p className="text-xs text-gray-400 dark:text-slate-500">Try a different search term.</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {articles.map(a => (
              <button
                key={a.article_id || a.id}
                onClick={() => setSelected(selected?.article_id === a.article_id ? null : a)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all
                  ${selected?.article_id === a.article_id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{cfg.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{a.title}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 line-clamp-2">{a.content?.slice(0, 100)}...</p>
                  </div>
                  <svg className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform shrink-0 mt-1 ${selected?.article_id === a.article_id ? 'rotate-90' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Article reader */}
      {selected && (
        <div className="w-96 shrink-0 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 shrink-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 pr-4 truncate">{selected.title}</h3>
            <button onClick={() => setSelected(null)}
              className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shrink-0">
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-8 whitespace-pre-wrap">{selected.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}

