export default function LiveSupportCard() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-slate-800 opacity-10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white dark:bg-slate-800 opacity-10 rounded-full -ml-12 -mb-12"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-white dark:bg-slate-800 bg-opacity-20 rounded-xl flex items-center justify-center text-2xl shrink-0">
            💬
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">Need Immediate Help?</h3>
            <p className="text-sm text-blue-100">Our support team is standing by</p>
          </div>
        </div>

        {/* Info boxes */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <span>✓</span>
            <span>Average response time: 5 minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>✓</span>
            <span>Available 24/7 for urgent issues</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>✓</span>
            <span>Expert technical support</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full px-4 py-3 bg-white dark:bg-slate-800 hover:bg-blue-50 text-blue-700 text-sm font-bold rounded-lg transition-colors shadow-lg">
          Start Live Chat →
        </button>

        {/* Footer note */}
        <div className="mt-4 pt-4 border-t border-white border-opacity-20">
          <p className="text-xs text-blue-100 text-center">
            📞 Or call us: <span className="font-semibold text-white">1-800-SUPPORT</span>
          </p>
        </div>
      </div>
    </div>
  );
}
