import { useState, useEffect } from 'react';
import { getAllArticles, searchArticles, getArticleById, createArticle } from '../api/knowledgeBase';

export default function KnowledgeBaseView() {
  const [articles, setArticles]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [query, setQuery]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [creating, setCreating]   = useState(false);
  const [form, setForm]           = useState({ title: '', content: '' });
  const [saving, setSaving]       = useState(false);
  const [searched, setSearched]   = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = () => {
    setLoading(true);
    getAllArticles().then(r => setArticles(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  const handleSearch = () => {
    if (!query.trim() || query.length < 2) { loadAll(); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    searchArticles(query).then(r => setArticles(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
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

  const recommendText = selected
    ? `📖 From Knowledge Base — "${selected.title}":\n\n${selected.content.slice(0, 300)}${selected.content.length > 300 ? '...' : ''}`
    : '';

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-sm text-gray-500 mt-0.5">Search articles and recommend solutions directly to clients</p>
        </div>
        <button
          onClick={() => { setCreating(true); setSelected(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Article
        </button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">

        {/* Left: search + article list */}
        <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white outline-none focus:border-blue-400 placeholder-gray-400"
                placeholder="Search operational database..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              />
              <button onClick={handleSearch} className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shrink-0">
                🔍
              </button>
            </div>
          </div>

          {/* Article list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="flex flex-col gap-2 p-3">
                {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-2xl mb-2">📭</p>
                <p className="text-xs">{searched ? `No results for "${query}"` : 'No articles yet'}</p>
              </div>
            ) : (
              articles.map(a => (
                <button
                  key={a.article_id}
                  onClick={() => handleSelect(a)}
                  className={`w-full text-left px-4 py-3.5 transition-colors
                    ${selected?.article_id === a.article_id ? 'bg-blue-50 border-l-2 border-blue-600' : 'hover:bg-gray-50 border-l-2 border-transparent'}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm shrink-0 mt-0.5">📄</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{a.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">KB-{a.article_id} · {a.author?.full_name || 'Unknown'}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: article view or create form */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          {creating ? (
            <div className="flex flex-col gap-4 p-6 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">New Article</h3>
                <button onClick={() => setCreating(false)} className="text-gray-400 hover:text-gray-600 text-xs">✕ Cancel</button>
              </div>
              <input
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-400 placeholder-gray-400"
                placeholder="Article title..."
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
              <textarea
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 resize-none leading-relaxed placeholder-gray-400"
                placeholder="Write detailed article content, step-by-step instructions, or solution guides..."
                rows={16}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setCreating(false)} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={saving || !form.title.trim() || !form.content.trim()} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {saving ? 'Publishing...' : '📤 Publish Article'}
                </button>
              </div>
            </div>
          ) : selected ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Article header */}
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">KB-{selected.article_id}</p>
                    <h2 className="text-lg font-bold text-gray-900">{selected.title}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      By <span className="font-medium">{selected.author?.full_name || 'Unknown'}</span>
                      <span className="mx-2 text-gray-300">·</span>
                      {new Date(selected.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(recommendText).catch(() => {});
                    }}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 border border-blue-200 text-blue-600 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    📋 Copy & Recommend
                  </button>
                </div>
              </div>
              {/* Article content */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="prose prose-sm max-w-none text-gray-700 leading-8 whitespace-pre-wrap text-sm">{selected.content}</div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <span className="text-5xl">📖</span>
              <p className="text-sm font-medium">Search articles or select one from the list</p>
              <p className="text-xs text-gray-300">Use "Copy & Recommend" to insert solutions into client replies</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
