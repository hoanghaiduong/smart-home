
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Updated onClick prop to accept a mouse event. This allows parent
  // components to use event properties like stopPropagation(), fixing a
  // type mismatch in Modal.tsx.
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-slate-200/20 dark:bg-white/10 
        backdrop-blur-xl 
        border border-slate-300/30 dark:border-white/20 
        shadow-lg dark:shadow-black/20
        rounded-2xl p-6 
        transition-all duration-300 
        ${className}
      `}
    >
      {children}
    </div>
  );
};
