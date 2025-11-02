import React from 'react';

interface NeonToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

export const NeonToggleButton: React.FC<NeonToggleButtonProps> = ({ isOn, onToggle, isLoading }) => {
  if (isLoading) {
    return (
      <div className="relative flex items-center justify-center h-6 w-11">
        <div className="w-4 h-4 border-2 border-slate-400 dark:border-slate-500 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent card click when toggling
        onToggle();
      }}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 ${
        isOn ? 'bg-sky-500' : 'bg-slate-400 dark:bg-slate-600'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
          isOn ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      {isOn && (
        <span className="absolute inset-0 rounded-full ring-4 ring-sky-500/50 animate-pulse"></span>
      )}
    </button>
  );
};
