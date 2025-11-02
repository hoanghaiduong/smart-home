import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, id, options, className, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>}
      <select
        id={id}
        className={`w-full px-3 py-2 bg-slate-300/30 dark:bg-slate-800/50 border border-slate-400/50 dark:border-slate-700/50 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all appearance-none bg-no-repeat bg-right pr-8 bg-[url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-slate-200 dark:bg-slate-800">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
