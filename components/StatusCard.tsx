import React, { ReactNode } from 'react';

interface StatusCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  progress: number;
  color: 'orange' | 'sky' | 'green' | 'rose';
}

const colorMap = {
  orange: 'text-orange-500 dark:text-orange-400',
  sky: 'text-sky-500 dark:text-sky-400',
  green: 'text-green-500 dark:text-green-400',
  rose: 'text-rose-500 dark:text-rose-400',
};

const strokeColorMap = {
  orange: 'stroke-orange-500 dark:stroke-orange-400',
  sky: 'stroke-sky-500 dark:stroke-sky-400',
  green: 'stroke-green-500 dark:stroke-green-400',
  rose: 'stroke-rose-500 dark:stroke-rose-400',
};

export const StatusCard: React.FC<StatusCardProps> = ({ icon, label, value, progress, color }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const iconWithColor = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: `${((icon.props as { className?: string }).className || '')} ${colorMap[color]}`.trim(),
      })
    : icon;

  return (
    <div className="bg-slate-300/30 dark:bg-slate-800/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 transition-all duration-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 hover:scale-105 cursor-pointer">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-slate-400/50 dark:text-slate-700"
            strokeWidth="5"
            stroke="currentColor"
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            className={`${strokeColorMap[color]} transition-all duration-700 ease-out`}
            strokeWidth="5"
            strokeLinecap="round"
            stroke="currentColor"
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          {iconWithColor}
          <span className={`mt-1 text-lg font-bold ${colorMap[color]}`}>{value}</span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 px-1">{label}</p>
    </div>
  );
};