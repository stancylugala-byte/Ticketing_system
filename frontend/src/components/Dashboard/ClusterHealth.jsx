import React from 'react';
import { FiActivity } from 'react-icons/fi';

const ClusterHealth = ({ status, label }) => {
  const statusColors = {
    Optimal: 'text-green-500',
    Warning: 'text-yellow-500',
    Critical: 'text-red-500',
  };

  const dotColor = statusColors[status] || 'text-green-500';

  return (
    <div className="flex items-center gap-2 bg-[#1A202C] border border-[#2D3748] rounded-lg px-4 py-2">
      <FiActivity className={dotColor} size={16} />
      <span className="text-[#94A3B8] text-sm">Cluster Health:</span>
      <span className={`text-sm font-medium ${dotColor}`}>{status}</span>
      {label && <span className="text-[#94A3B8] text-sm">| {label}</span>}
    </div>
  );
};

export default ClusterHealth;