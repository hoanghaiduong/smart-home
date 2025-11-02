import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center py-8 px-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Smart Home Dashboard. All rights reserved.
      </p>
    </footer>
  );
};