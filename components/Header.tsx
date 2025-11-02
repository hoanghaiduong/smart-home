import React, { useState } from 'react';
import type { Theme } from '../types';

const HomeIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-sky-500 dark:text-sky-400 w-7 h-7"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
)
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);
const SystemIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
)

interface HeaderProps {
  systemName: string;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ systemName, theme, onThemeChange }) => {
  return (
    <header className="sticky top-4 z-50 mx-4 sm:mx-6 lg:mx-8 mt-4">
      <div className="container mx-auto bg-slate-200/50 dark:bg-slate-900/40 backdrop-blur-lg border border-slate-300/50 dark:border-white/20 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-3">
            <HomeIcon />
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 tracking-wider">
              {systemName}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Switcher */}
            <div className="flex items-center space-x-1 bg-slate-300/50 dark:bg-slate-800/50 p-1 rounded-full">
              {(['light', 'dark', 'system'] as Theme[]).map(t => (
                <button 
                  key={t}
                  onClick={() => onThemeChange(t)}
                  className={`p-2 rounded-full transition-colors duration-300 ${theme === t ? 'bg-sky-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
                  title={`Switch to ${t} mode`}
                >
                  {t === 'light' && <SunIcon />}
                  {t === 'dark' && <MoonIcon />}
                  {t === 'system' && <SystemIcon />}
                </button>
              ))}
            </div>
            
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              <BellIcon />
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </button>

            <div className="w-10 h-10 bg-slate-700 rounded-full overflow-hidden border-2 border-sky-500 dark:border-sky-400">
               <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};