import React from 'react';

const StatCard = ({ label, value, change, changeLabel, icon: Icon, trend }) => {
  const isPositive = trend === 'up';
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';
  const trendIcon = isPositive ? '↑' : '↓';

  return (
    <div className="bg-[#111827] border border-[#2D3748] rounded-xl p-6 hover:border-[#2563EB]/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[#94A3B8] text-sm font-medium">{label}</p>
        {Icon && <Icon className="text-[#2563EB]" size={20} />}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${trendColor}`}>
              {trendIcon} {change} {changeLabel && `vs last week`}
            </p>
          )}
        </div>
        {changeLabel && (
          <span className="text-xs text-[#94A3B8]">{changeLabel}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;