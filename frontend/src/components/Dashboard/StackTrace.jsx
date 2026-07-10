import React from 'react';

const StackTrace = ({ error, traces }) => {
  return (
    <div className="bg-[#0A1628] border border-[#2D3748] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium text-sm">Technical Stack Trace</h4>
        <span className="text-xs text-[#94A3B8]">Critical</span>
      </div>
      {error && (
        <p className="text-red-400 text-sm font-mono mb-2">{error}</p>
      )}
      {traces && traces.length > 0 && (
        <div className="space-y-1">
          {traces.map((trace, index) => (
            <p key={index} className="text-[#94A3B8] text-xs font-mono">
              {trace}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default StackTrace;