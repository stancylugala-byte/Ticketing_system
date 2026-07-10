import React from 'react';
import { FiGitCommit, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const ActivityItem = ({ type, title, description, time, icon: Icon }) => {
  const getIcon = () => {
    switch (type) {
      case 'commit':
        return <FiGitCommit className="text-[#2563EB]" />;
      case 'ci':
        return <FiCheckCircle className="text-green-500" />;
      case 'alert':
        return <FiAlertTriangle className="text-yellow-500" />;
      default:
        return Icon || <FiGitCommit className="text-[#2563EB]" />;
    }
  };

  const getTimeColor = () => {
    const hours = parseInt(time);
    if (hours < 1) return 'text-green-500';
    if (hours < 3) return 'text-yellow-500';
    return 'text-[#94A3B8]';
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#2D3748] last:border-0">
      <div className="mt-1">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{title}</p>
        {description && (
          <p className="text-[#94A3B8] text-xs">{description}</p>
        )}
      </div>
      {time && (
        <span className={`text-xs ${getTimeColor()}`}>{time}</span>
      )}
    </div>
  );
};

export default ActivityItem;