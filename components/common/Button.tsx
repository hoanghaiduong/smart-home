import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] focus:ring-sky-500',
    outline: 'bg-transparent border border-sky-500 text-sky-500 hover:bg-sky-500/10 dark:border-sky-400 dark:text-sky-400 dark:hover:bg-sky-400/10 focus:ring-sky-500',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
