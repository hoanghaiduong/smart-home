
import React from 'react';
import type { View } from '../types';

const NavItem = ({ icon, label, isActive, isCollapsed, onClick }: { icon: React.ReactNode, label: string, isActive?: boolean, isCollapsed: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`relative flex items-center w-full p-3 rounded-lg transition-all duration-300 group ${isActive ? 'bg-sky-500/10 dark:bg-sky-500/20' : 'hover:bg-slate-500/10 dark:hover:bg-slate-700/50'}`}>
    <div className={`transition-all duration-300 ${isActive ? 'text-sky-500 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-sky-500 dark:group-hover:text-sky-400'}`}>
      {icon}
    </div>
    <span className={`text-sm font-medium whitespace-nowrap ml-4 transition-all duration-300 ${isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'} ${isCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>{label}</span>
    {isActive && <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sky-500 dark:bg-sky-400 rounded-r-full shadow-[0_0_10px_theme(colors.sky.400)] transition-all duration-300 ${isCollapsed ? 'scale-0' : 'scale-100'}`}></div>}
  </button>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 min-w-[24px]"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const RoomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 min-w-[24px]"><path d="M4 22h16"/><path d="M2 12h20"/><path d="M18 12v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><path d="M10 12v10"/><path d="M14 12v10"/><path d="M6 12v10"/><path d="M18 12v10"/></svg>
);
const DeviceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 min-w-[24px]"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);
const ActivityIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 min-w-[24px]"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 min-w-[24px]"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.12l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2.12l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const CollapseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m15 15-3-3 3-3"/></svg>
);
const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 min-w-[24px]"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
);


interface SidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    currentView: View;
    setCurrentView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse, currentView, setCurrentView }) => {
    const navItems = [
        { view: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { view: 'rooms', label: 'Phòng', icon: <RoomIcon /> },
        { view: 'devices', label: 'Thiết bị', icon: <DeviceIcon /> },
        { view: 'cameras', label: 'Cameras', icon: <VideoIcon /> },
        { view: 'activity', label: 'Hoạt động', icon: <ActivityIcon /> },
        { view: 'settings', label: 'Cài đặt', icon: <SettingsIcon /> },
    ] as const;

    return (
        <aside className={`flex flex-col border-r border-slate-300/30 dark:border-white/20 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-64'}`}>
           <div className={`flex items-center p-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
             <div className={`flex items-center space-x-3 transition-all duration-300 ${isCollapsed ? 'scale-0 w-0' : 'scale-100 w-auto'}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_theme(colors.sky.500)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><path d="M12 2v20"/><path d="m4.93 4.93 1.41 1.41"/><path d="M2 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M22 12h-2"/><path d="M12 2v20"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M22 12h-2"/><path d="m6.34 6.34-1.41-1.41"/><path d="m19.07 19.07-1.41-1.41"/></svg>
                </div>
                <span className="font-bold text-lg whitespace-nowrap text-slate-800 dark:text-slate-100">Home</span>
             </div>
             <button onClick={onToggleCollapse} className={`p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 dark:hover:bg-slate-700/50 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                <CollapseIcon/>
             </button>
           </div>
            <nav className="flex-1 flex flex-col space-y-2 p-4">
                {navItems.map(item => (
                    <NavItem 
                        key={item.view}
                        icon={item.icon} 
                        label={item.label}
                        isCollapsed={isCollapsed} 
                        isActive={currentView === item.view || (currentView === 'roomDetail' && item.view === 'dashboard') || (currentView === 'cameraGrid' && item.view === 'dashboard')}
                        onClick={() => setCurrentView(item.view)}
                    />
                ))}
            </nav>
        </aside>
    );
}
