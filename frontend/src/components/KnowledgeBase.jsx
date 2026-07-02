import { useState, useEffect } from 'react';
import { getAllArticles, searchArticles, getArticleById, createArticle } from '../api/knowledgeBase';

export default function KnowledgeBase() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = () => {
    setLoading(true);
    getAllArticles().then(r => setArticles(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.trim().length < 2) { loadAll(); return; }
    clearTimeout(window._kbTimer);
    window._kbTimer = setTimeout(() => {
      searchArticles(q).then(r => setArticles(r.data.data || [])).catch(() => {});
    }, 300);
  };

  const handleSelect = (a) => {
    getArticleById(a.article_id).then(r => setSelected(r.data.data)).catch(() => {});
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

  return (
    <div className="flex bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">

      {/* Sidebar */}
      <div className="w-64 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-800">Knowledge Base</h3>
          <button
            onClick={() => { setCreating(true); setSelected(null); }}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >+ New</button>
        </div>
        <div className="px-3 py-2.5 border-b border-gray-200">
          <input
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 placeholder-gray-400"
            placeholder="Search articles..."
            value={query}
            onChange={handleSearch}
          />
        </div>
        <ul className="flex-1 overflow-y-auto">
          {loading ? (
            <li className="text-center text-gray-400 text-sm py-8">Loading...</li>
          ) : articles.length === 0 ? (
            <li className="text-center text-gray-400 text-sm py-8">No articles found</li>
          ) : (
            articles.map(a => (
              <li
                key={a.article_id}
                onClick={() => { handleSelect(a); setCreating(false); }}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors
                  ${selected?.article_id === a.article_id ? 'bg-blue-50 border-l-2 border-blue-600' : 'hover:bg-gray-100'}`}
              >
                <p className="text-sm font-medium text-gray-800 truncate">{a.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">By {a.author?.full_name || 'Unknown'}</p>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {creating ? (
          <div className="flex flex-col gap-4 p-6 overflow-y-auto">
            <h3 className="text-base font-bold text-gray-900">New Article</h3>
            <input
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
              placeholder="Article title..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <textarea
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none leading-relaxed"
              placeholder="Write article content..."
              rows={14}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setCreating(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={saving} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {saving ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>
          </div>
        ) : selected ? (
          <div className="p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{selected.title}</h2>
            <p className="text-xs text-gray-400 mb-6">
              By {selected.author?.full_name || 'Unknown'} · {new Date(selected.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
            </p>
            <div className="text-sm text-gray-700 leading-8 whitespace-pre-wrap">{selected.content}</div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <span className="text-5xl">📖</span>
            <p className="text-sm">Select an article or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
