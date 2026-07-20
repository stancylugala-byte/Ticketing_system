import { useState, useEffect } from 'react';
import { getAllArticles, searchArticles, getArticleById, createArticle } from '../api/knowledgeBase';

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ArticleIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const EmptyIcon = () => (
  <svg className="w-12 h-12 opacity-25" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const PublishIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export default function KnowledgeBaseView() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query,    setQuery]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [creating, setCreating] = useState(false);
  const [form,     setForm]     = useState({ title: '', content: '' });
  const [saving,   setSaving]   = useState(false);
  const [copied,   setCopied]   = useState(false);

  useEffect(() => { loadAll(); }, []);

  // Instant search — triggered on every query change
  useEffect(() => {
    if (!query.trim()) { loadAll(); return; }
    setLoading(true);
    searchArticles(query)
      .then(r => setArticles(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query]);

  const loadAll = () => {
    setLoading(true);
    getAllArticles().then(r => setArticles(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  const handleSelect = (a) => {
    setCreating(false);
    getArticleById(a.article_id).then(r => setSelected(r.data.data)).catch(() => setSelected(a));
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      await createArticle(form);
      setForm({ title: '', content: '' });
      setCreating(false);
      loadAll();
    } finally { setSaving(false); }
  };

  const handleCopy = () => {
    if (!selected) return;
    const text = `From Knowledge Base — "${selected.title}":\n\n${selected.content.slice(0, 300)}${selected.content.length > 300 ? '...' : ''}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-5">

      {/* Header */}
      <div className="flex items-start justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Knowledge Base</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Search articles and recommend solutions directly to clients</p>
        </div>
        <button
          onClick={() => { setCreating(true); setSelected(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shrink-0"
        >
          + New Article
        </button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">

        {/* ── Left: search + article list ── */}
        <div className="w-72 shrink-0 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">

          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 shrink-0">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-blue-400 placeholder-gray-400 dark:placeholder-slate-500"
                placeholder="Search knowledge base..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Article list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
            {loading ? (
              <div className="flex flex-col gap-2 p-3">
                {[1,2,3,4].map(i => <div key={i} className="h-14 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse" />)}
              </div>
            ) : articles.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-gray-400 dark:text-slate-500 gap-2">
                <EmptyIcon />
                <p className="text-xs">{query ? `No results for "${query}"` : 'No articles yet'}</p>
              </div>
            ) : (
              articles.map(a => (
                <button
                  key={a.article_id}
                  onClick={() => handleSelect(a)}
                  className={`w-full text-left px-4 py-3.5 transition-colors border-l-2 ${
                    selected?.article_id === a.article_id
                      ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-600'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`shrink-0 mt-0.5 ${selected?.article_id === a.article_id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'}`}>
                      <ArticleIcon />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{a.title}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
                        KB-{a.article_id} · {a.author?.full_name || 'System'}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Right: article view or create form ── */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">

          {creating ? (
            /* Create form */
            <div className="flex flex-col gap-4 p-6 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">New Article</h3>
                <button
                  onClick={() => setCreating(false)}
                  className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 border border-gray-200 dark:border-slate-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <input
                className="px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium bg-white dark:bg-slate-900 dark:text-slate-100 outline-none focus:border-blue-400 placeholder-gray-400 dark:placeholder-slate-500"
                placeholder="Article title..."
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
              <textarea
                className="px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-900 dark:text-slate-100 outline-none focus:border-blue-400 resize-none leading-relaxed placeholder-gray-400 dark:placeholder-slate-500"
                placeholder="Write detailed article content, step-by-step instructions, or solution guides..."
                rows={16}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setCreating(false)}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving || !form.title.trim() || !form.content.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <PublishIcon />
                  {saving ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </div>

          ) : selected ? (
            /* Article viewer */
            <div className="flex flex-col h-full overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/60 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      KB-{selected.article_id}
                    </p>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selected.title}</h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      By <span className="font-medium text-gray-700 dark:text-slate-300">{selected.author?.full_name || 'System'}</span>
                      <span className="mx-2 text-gray-300 dark:text-slate-600">·</span>
                      {new Date(selected.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      copied
                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                        : 'border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20'
                    }`}
                  >
                    <CopyIcon />
                    {copied ? 'Copied!' : 'Copy & Recommend'}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="text-sm text-gray-700 dark:text-slate-300 leading-8 whitespace-pre-wrap">
                  {selected.content}
                </div>
              </div>
            </div>

          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 gap-3">
              <EmptyIcon />
              <p className="text-sm font-medium">Search articles or select one from the list</p>
              <p className="text-xs text-gray-300 dark:text-slate-600">Use "Copy & Recommend" to insert solutions into client replies</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
