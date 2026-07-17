import { Link } from 'react-router-dom';

export default function KnowledgeBaseCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 hover:shadow-md transition-shadow">
      {/* Icon and Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
          📚
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Knowledge Base</h3>
          <p className="text-sm text-gray-600 dark:text-slate-300">Find answers to common questions</p>
        </div>
      </div>

      {/* Quick Topics */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200 hover:text-blue-600 cursor-pointer transition-colors">
          <span className="text-blue-600">•</span>
          <span>Getting Started Guide</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200 hover:text-blue-600 cursor-pointer transition-colors">
          <span className="text-blue-600">•</span>
          <span>Account Management</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200 hover:text-blue-600 cursor-pointer transition-colors">
          <span className="text-blue-600">•</span>
          <span>Troubleshooting Tips</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200 hover:text-blue-600 cursor-pointer transition-colors">
          <span className="text-blue-600">•</span>
          <span>Billing & Subscriptions</span>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        to="/kb"
        className="block w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg text-center transition-colors"
      >
        Browse All Articles →
      </Link>

      {/* Footer hint */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
        <p className="text-xs text-gray-500 dark:text-slate-400 text-center">
          💡 Can't find what you're looking for? <span className="text-blue-600 font-medium cursor-pointer hover:underline">Create a ticket</span>
        </p>
      </div>
    </div>
  );
}
