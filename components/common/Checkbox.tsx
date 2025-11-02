
import React, { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, id, className, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className={`h-4 w-4 rounded border-slate-400/50 dark:border-slate-700/50 bg-slate-300/30 dark:bg-slate-800/50 text-sky-600 focus:ring-sky-500 transition ${className}`}
        {...props}
      />
      <label htmlFor={id} className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
        {label}
      </label>
    </div>
  );
};
