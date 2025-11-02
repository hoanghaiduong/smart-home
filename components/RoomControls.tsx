import React from 'react';
import { GlassCard } from './GlassCard';
import type { Room, DeviceType } from '../types';

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);
const FanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M10.82 16.37a5.002 5.002 0 0 0 6.53-7.56C15.44 7.7 13.3 7 12 7c-2.76 0-5 2.24-5 5 0 .22.18.4.4.4h.6c.22 0 .4-.18.4-.4 0-1.86 1.2-3.45 3-3.87"/><path d="M16.37 10.82a5.002 5.002 0 0 0-7.56 6.53C7.7 15.44 7 13.3 7 12c0-2.76 2.24-5 5-5 .22 0 .4.18.4.4v.6c0 .22-.18.4-.4.4 0 1.86-1.2 3.45-3 3.87"/><path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>
);
const AcIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 12h20"/><path d="m20 12-4.5-4.5"/><path d="M4 12l4.5 4.5"/><path d="M12 2v20"/><path d="m17.5 6.5-11 11"/><path d="m6.5 6.5 11 11"/></svg>
);
const CurtainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22V2"/><path d="M4 2v20"/><path d="M20 2v20"/></svg>
);
const LightOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16.23 16.23a2 2 0 1 0 2.83 2.83"/><path d="m2 2 20 20"/><path d="M12.3 9.7a6 6 0 0 0-4.04 4.04"/><path d="M10.73 6.09a6 6 0 0 1 8.18 8.18"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);


const deviceIcons: Record<DeviceType, React.ReactNode> = {
  light: <LightbulbIcon />,
  fan: <FanIcon />,
  ac: <AcIcon />,
  curtain: <CurtainIcon />,
};

interface RoomControlsProps {
  rooms: Room[];
  onSelectRoom: (roomId: number) => void;
  onTurnOffAllLights: () => void;
}

export const RoomControls: React.FC<RoomControlsProps> = ({ rooms, onSelectRoom, onTurnOffAllLights }) => {
  return (
    <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Điều khiển (Room Controls)</h2>
            <button 
                onClick={onTurnOffAllLights}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 hover:bg-rose-500/20 dark:hover:bg-rose-500/30 transition-colors"
                title="Tắt hết đèn trong nhà"
            >
                <LightOffIcon />
                <span className="text-sm font-semibold hidden sm:inline">Tắt hết đèn</span>
            </button>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {rooms.map((room) => (
                <GlassCard 
                  key={room.id} 
                  onClick={() => onSelectRoom(room.id)}
                  className="cursor-pointer hover:border-sky-500/50 dark:hover:border-sky-400/50 hover:scale-[1.02]"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200">{room.name}</h3>
                        <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400">
                            <span className="text-sm font-semibold">Chi tiết</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {room.devices.slice(0, 4).map((device) => ( // Show max 4 devices for preview
                            <div key={device.id} className="bg-slate-300/30 dark:bg-slate-800/50 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full transition-colors ${device.state === 'on' ? 'bg-sky-500/20 text-sky-500 dark:text-sky-400' : 'bg-slate-400/50 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                        {deviceIcons[device.type]}
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 text-sm">{device.name}</span>
                                </div>
                                <div className={`text-sm font-semibold ${device.state === 'on' ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {device.state === 'on' ? 'Bật' : 'Tắt'}
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            ))}
        </div>
    </section>
  );
};