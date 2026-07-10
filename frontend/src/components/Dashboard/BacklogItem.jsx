import React from 'react';
import { FiUser, FiTag, FiClock } from 'react-icons/fi';

const BacklogItem = ({
  priority,
  title,
  tag,
  assignee,
  time,
  status,
  component
}) => {
  const priorityColors = {
    Critical: 'text-red-500 bg-red-500/10 border-red-500',
    High: 'text-orange-500 bg-orange-500/10 border-orange-500',
    Medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500',
    Low: 'text-green-500 bg-green-500/10 border-green-500',
  };

  const priorityBadge = priorityColors[priority] || priorityColors.Medium;

  return (
    <div className="bg-[#1A202C] border border-[#2D3748] rounded-lg p-4 hover:border-[#2563EB]/30 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${priorityBadge}`}>
              {priority}
            </span>
            {status && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#2563EB]/20 text-[#2563EB]">
                {status}
              </span>
            )}
            {component && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#0A1628] border border-[#2D3748] text-[#94A3B8]">
                {component}
              </span>
            )}
          </div>
          <p className="text-white font-medium text-sm">{title}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-[#94A3B8]">
            {assignee && (
              <span className="flex items-center gap-1">
                <FiUser size={12} />
                {assignee}
              </span>
            )}
            {tag && (
              <span className="flex items-center gap-1 bg-[#0A1628] px-2 py-0.5 rounded-full border border-[#2D3748]">
                <FiTag size={12} />
                {tag}
              </span>
            )}
            {time && (
              <span className="flex items-center gap-1">
                <FiClock size={12} />
                {time}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklogItem;