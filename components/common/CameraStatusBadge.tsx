
import React from 'react';
import type { CameraStatus } from '../../types';

interface CameraStatusBadgeProps {
  status: CameraStatus;
  isLarge?: boolean;
}

export const CameraStatusBadge: React.FC<CameraStatusBadgeProps> = ({ status, isLarge = false }) => {
  const statusConfig = {
    online: { text: 'Online', color: 'text-green-400', bgColor: 'bg-green-500/20', indicatorColor: 'bg-green-500' },
    offline: { text: 'Offline', color: 'text-rose-400', bgColor: 'bg-rose-500/20', indicatorColor: 'bg-rose-500' },
    connecting: { text: 'Connecting', color: 'text-amber-400', bgColor: 'bg-amber-500/20', indicatorColor: 'bg-amber-500 animate-pulse' },
  };

  const { text, color, bgColor, indicatorColor } = statusConfig[status];

  const sizeClasses = isLarge 
    ? 'px-4 py-2 text-base'
    : 'px-2 py-1 text-xs';

  return (
    <div className={`inline-flex items-center rounded-full font-semibold backdrop-blur-sm ${sizeClasses} ${bgColor} ${color}`}>
      <span className={`w-2 h-2 mr-2 rounded-full ${indicatorColor}`}></span>
      <span className="capitalize">{text}</span>
    </div>
  );
};
