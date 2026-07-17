import { useState, useEffect, useRef } from 'react';
import { createTicket, getCategories, uploadAttachments } from '../../api/clientApi';

const PRIORITIES = [
  { val: 'Low',      active: 'bg-green-600 text-white ring-2 ring-green-300 dark:ring-green-500/40' },
  { val: 'Medium',   active: 'bg-yellow-500 text-white ring-2 ring-yellow-300 dark:ring-yellow-500/40' },
  { val: 'High',     active: 'bg-orange-600 text-white ring-2 ring-orange-300 dark:ring-orange-500/40' },
  { val: 'Critical', active: 'bg-red-600    text-white ring-2 ring-red-300    dark:ring-red-500/40' },
];

// Shared input class
const inputCls = `
  w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors
  bg-white dark:bg-slate-900
  text-gray-900 dark:text-slate-100
  placeholder-gray-400 dark:placeholder-slate-500
  border-gray-300 dark:border-slate-600
  focus:border-blue-500 dark:focus:border-blue-400
  focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20
`;

export default function NewTicketModal({ isOpen, onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [formData,   setFormData]   = useState({ title: '', description: '', category_id: '', priority: 'Medium', organisation: '', system_name: '' });
  const [screenshots, setScreenshots] = useState([]); // File[]
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ title: '', description: '', category_id: '', priority: 'Medium', organisation: '', system_name: '' });
      setScreenshots([]);
      setError('');
      getCategories()
        .then(r => setCategories(r.data.data || []))
        .catch(() => {});
    }
  }, [isOpen]);

  const change = (field, val) => {
    setFormData(p => ({ ...p, [field]: val }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.title.trim())       { setError('Title is required');       return; }
    if (!formData.description.trim()) { setError('Description is required'); return; }
    if (!formData.category_id)        { setError('Category is required');    return; }

    setLoading(true);
    setError('');
    try {
      // Build optional tag from organisation + system_name
      const tagParts = [];
      if (formData.organisation.trim()) tagParts.push(`Organisation: ${formData.organisation.trim()}`);
      if (formData.system_name.trim())  tagParts.push(`System: ${formData.system_name.trim()}`);

      const res = await createTicket({
        title:       formData.title.trim(),
        description: formData.description.trim(),
        category_id: parseInt(formData.category_id),
        priority:    formData.priority,
        tag:         tagParts.length ? tagParts.join(' | ') : undefined,
      });

      // Upload screenshots if any (non-blocking — failure won't cancel ticket creation)
      if (screenshots.length > 0) {
        const ticketId = res.data.data.id;
        await uploadAttachments(ticketId, screenshots).catch(() => {});
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection — validate type & size client-side
  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const validTypes = ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'];
    const valid = newFiles.filter(f => validTypes.includes(f.type) && f.size <= 5 * 1024 * 1024);
    const invalid = newFiles.length - valid.length;
    if (invalid > 0) setError(`${invalid} file(s) skipped — only images up to 5MB are allowed.`);
    setScreenshots(prev => {
      const combined = [...prev, ...valid];
      return combined.slice(0, 5); // max 5 total
    });
    // Reset input so same file can be re-added after removal
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeScreenshot = (index) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">

      {/* Modal card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-slate-700">

        {/* ── Header ── */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Ticket</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Describe your issue and we'll help you resolve it</p>
          </div>
          <button onClick={onClose}
            className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-xl">
            ×
          </button>
        </div>

        {/* ── Form body ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Ticket Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              placeholder="Brief description of your issue"
              value={formData.title}
              onChange={e => change('title', e.target.value)}
              maxLength={200}
            />
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{formData.title.length}/200 characters</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className={inputCls}
              value={formData.category_id}
              onChange={e => change('category_id', e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
              ))}
            </select>
          </div>

          {/* Organisation & System — optional context */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Organisation
                <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-slate-500">optional</span>
              </label>
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. Acme Corporation"
                value={formData.organisation}
                onChange={e => change('organisation', e.target.value)}
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Affected System
                <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-slate-500">optional</span>
              </label>
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. Inventory Portal"
                value={formData.system_name}
                onChange={e => change('system_name', e.target.value)}
                maxLength={100}
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map(({ val, active }) => (
                <button key={val} type="button" onClick={() => change('priority', val)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    formData.priority === val
                      ? active
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}>
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className={inputCls + ' resize-none'}
              placeholder="Provide detailed information about your issue. Include steps to reproduce, error messages, or any relevant context."
              rows={6}
              value={formData.description}
              onChange={e => change('description', e.target.value)}
              maxLength={2000}
            />
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{formData.description.length}/2000 characters</p>
          </div>

          {/* Screenshots — optional */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Screenshots
              <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-slate-500">optional · up to 5 images · max 5MB each</span>
            </label>

            {/* Drop zone / click to upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFileSelect({ target: { files: e.dataTransfer.files } }); }}
              className="relative border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              {screenshots.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-3 text-center">
                  <span className="text-3xl">📎</span>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Click or drag images here
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">JPEG, PNG, GIF, WebP — up to 5 files, 5MB each</p>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {screenshots.map((file, i) => (
                    <div key={i} className="relative group/thumb">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-slate-600"
                      />
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); removeScreenshot(i); }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-md"
                      >×</button>
                      {/* File name tooltip */}
                      <p className="text-[9px] text-gray-400 dark:text-slate-500 truncate mt-0.5 text-center">{file.name}</p>
                    </div>
                  ))}
                  {/* Add more button */}
                  {screenshots.length < 5 && (
                    <div className="aspect-square border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                      <span className="text-xl text-gray-400 dark:text-slate-500">+</span>
                      <span className="text-[9px] text-gray-400 dark:text-slate-500">Add more</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {screenshots.length > 0 && (
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                {screenshots.length}/5 image{screenshots.length > 1 ? 's' : ''} selected ·{' '}
                <button type="button" onClick={() => setScreenshots([])} className="text-red-500 hover:text-red-600 dark:text-red-400">Remove all</button>
              </p>
            )}
          </div>

          {/* Tips box */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg px-4 py-3">
            <div className="flex gap-3">
              <span className="text-blue-600 dark:text-blue-400 text-lg shrink-0">💡</span>
              <div className="text-sm">
                <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Tips for faster resolution:</p>
                <ul className="list-disc list-inside space-y-0.5 text-blue-700 dark:text-blue-400">
                  <li>Be specific and detailed in your description</li>
                  <li>Include error messages or screenshots if applicable</li>
                  <li>Choose the correct category and priority level</li>
                </ul>
              </div>
            </div>
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between bg-gray-50 dark:bg-slate-900/50 shrink-0">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {screenshots.length > 0 ? 'Creating & uploading…' : 'Creating…'}
              </>
            ) : (
              <><span>✓</span> Create Ticket{screenshots.length > 0 ? ` + ${screenshots.length} image${screenshots.length > 1 ? 's' : ''}` : ''}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
