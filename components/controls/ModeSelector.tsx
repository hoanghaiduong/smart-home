import React from 'react';

interface ModeSelectorProps {
  label: string;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

const modeIcons: Record<string, React.ReactNode> = {
    cool: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v20"/><path d="m17.5 6.5-11 11"/><path d="m6.5 6.5 11 11"/></svg>,
    heat: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
    fan: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M10.82 16.37a5.002 5.002 0 0 0 6.53-7.56C15.44 7.7 13.3 7 12 7"/><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5"/><path d="M16.37 10.82a5.002 5.002 0 0 0-7.56 6.53C7.7 15.44 7 13.3 7 12"/><path d="M7 12c0-2.76 2.24-5 5-5"/><path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>,
    dry: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.7-3.29C8.2 7.81 7 6.3 7 4.5c0-1.38 1.12-2.5 2.5-2.5S12 3.12 12 4.5c0 1.8-1.2 3.31-2.3 4.46"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.5 6.5 0 0 1-13 0"/></svg>,
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  label,
  options,
  selectedOption,
  onSelect,
}) => {
  return (
    <div className="space-y-2 pt-2">
      <div className="text-sm text-slate-600 dark:text-slate-300">{label}</div>
      <div className="grid grid-cols-4 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-300 border ${
              selectedOption === option
                ? 'bg-sky-500/20 border-sky-500/80 dark:border-sky-400/80 text-sky-600 dark:text-sky-400'
                : 'bg-slate-300/30 dark:bg-slate-800/50 border-transparent hover:bg-slate-400/30 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400'
            }`}
          >
            {modeIcons[option]}
            <span className="text-xs font-medium capitalize">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};