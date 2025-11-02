import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>}
      <input
        id={id}
        className={`w-full px-3 py-2 bg-slate-300/30 dark:bg-slate-800/50 border border-slate-400/50 dark:border-slate-700/50 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${className}`}
        {...props}
      />
    </div>
  );
};
