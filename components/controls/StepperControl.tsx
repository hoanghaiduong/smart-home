import React from 'react';

interface StepperControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode, disabled?: boolean }> = ({ onClick, children, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-10 h-10 flex items-center justify-center bg-slate-400/30 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-md transition-colors hover:bg-slate-400/50 dark:hover:bg-slate-600/50 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {children}
    </button>
)

export const StepperControl: React.FC<StepperControlProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  return (
    <div className="space-y-2 pt-2">
      <div className="text-sm text-slate-600 dark:text-slate-300">{label}</div>
      <div className="flex items-center justify-between bg-slate-300/30 dark:bg-slate-800/50 p-2 rounded-lg">
        <ControlButton onClick={handleDecrement} disabled={value <= min}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14"/></svg>
        </ControlButton>
        <span className="text-xl font-bold text-sky-600 dark:text-sky-400 w-20 text-center">{value}{unit}</span>
        <ControlButton onClick={handleIncrement} disabled={value >= max}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </ControlButton>
      </div>
    </div>
  );
};