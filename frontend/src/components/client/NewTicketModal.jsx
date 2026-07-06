import { useState, useEffect } from 'react';
import { createTicket, getCategories } from '../../api/clientApi';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function NewTicketModal({ isOpen, onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      // Reset form
      setFormData({
        title: '',
        description: '',
        category_id: '',
        priority: 'Medium'
      });
      setError('');
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.category_id) {
      setError('Category is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createTicket({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category_id: parseInt(formData.category_id),
        priority: formData.priority
      });
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Ticket</h2>
            <p className="text-sm text-gray-500 mt-1">Describe your issue and we'll help you resolve it</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ticket Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                placeholder="Brief description of your issue"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200 characters</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors bg-white"
                value={formData.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITIES.map(priority => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => handleChange('priority', priority)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${formData.priority === priority
                        ? priority === 'Critical' ? 'bg-red-600 text-white ring-2 ring-red-300'
                        : priority === 'High' ? 'bg-orange-600 text-white ring-2 ring-orange-300'
                        : priority === 'Medium' ? 'bg-yellow-500 text-white ring-2 ring-yellow-300'
                        : 'bg-gray-600 text-white ring-2 ring-gray-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors resize-none"
                placeholder="Provide detailed information about your issue. Include steps to reproduce, error messages, or any relevant context."
                rows={8}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/2000 characters</p>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <div className="flex gap-3">
                <span className="text-blue-600 text-lg shrink-0">💡</span>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Tips for faster resolution:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-blue-700">
                    <li>Be specific and detailed in your description</li>
                    <li>Include error messages or screenshots if applicable</li>
                    <li>Choose the correct category and priority level</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating...
              </>
            ) : (
              <>
                <span>✓</span>
                Create Ticket
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
