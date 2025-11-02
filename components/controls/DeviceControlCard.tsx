
import React from 'react';
import type { Device, DeviceType } from '../../types';
import { GlassCard } from '../GlassCard';
import { NeonToggleButton } from '../NeonToggleButton';

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
  );
const FanIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M10.82 16.37a5.002 5.002 0 0 0 6.53-7.56C15.44 7.7 13.3 7 12 7c-2.76 0-5 2.24-5 5 0 .22.18.4.4.4h.6c.22 0 .4-.18.4-.4 0-1.86 1.2-3.45 3-3.87"/><path d="M16.37 10.82a5.002 5.002 0 0 0-7.56 6.53C7.7 15.44 7 13.3 7 12c0-2.76 2.24-5 5-5 .22 0 .4.18.4.4v.6c0 .22-.18.4-.4.4 0 1.86-1.2 3.45-3 3.87"/><path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>
);
const AcIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M2 12h20"/><path d="m20 12-4.5-4.5"/><path d="M4 12l4.5 4.5"/><path d="M12 2v20"/><path d="m17.5 6.5-11 11"/><path d="m6.5 6.5 11 11"/></svg>
);
const CurtainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M12 22V2"/><path d="M4 2v20"/><path d="M20 2v20"/></svg>
);
  
const deviceIcons: Record<DeviceType, React.ReactNode> = {
  light: <LightbulbIcon />,
  fan: <FanIcon />,
  ac: <AcIcon />,
  curtain: <CurtainIcon />,
};

interface DeviceControlCardProps {
  device: Device;
  onToggle: (updates: Partial<Device>) => void;
  children: React.ReactNode;
}

export const DeviceControlCard: React.FC<DeviceControlCardProps> = ({ device, onToggle, children }) => {
    
    const handleToggle = () => {
        const newState = device.state === 'on' ? 'off' : 'on';
        // The `updates` object is built dynamically, which can be tricky for TypeScript's
        // discriminated union inference. We build the object first.
        const updates: Record<string, any> = { state: newState };
        
        if (newState === 'on') {
            if (device.type === 'light' && (device.brightness === 0 || !device.brightness)) updates.brightness = 75;
            if (device.type === 'fan' && (device.speed === 0 || !device.speed)) updates.speed = 3;
            if (device.type === 'curtain' && (device.position === 0 || !device.position)) updates.position = 50;
        } else {
            if (device.type === 'light') updates.brightness = 0;
            if (device.type === 'fan') updates.speed = 0;
        }
        
        // FIX: Explicitly cast the dynamically created `updates` object to `Partial<Device>`.
        // This satisfies TypeScript's strict checking for discriminated unions, as the logic
        // ensures a valid partial update for a specific device type is created at runtime.
        onToggle(updates as Partial<Device>);
    };

  return (
    <GlassCard className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full transition-all duration-300 ${device.state === 'on' ? 'bg-sky-500/20 text-sky-500 dark:text-sky-400 shadow-[0_0_15px_theme(colors.sky.500/0.5)]' : 'bg-slate-400/50 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
            {deviceIcons[device.type]}
          </div>
          <span className="font-semibold text-lg text-slate-800 dark:text-slate-200">{device.name}</span>
        </div>
        <NeonToggleButton 
          isOn={device.state === 'on'} 
          onToggle={handleToggle}
          isLoading={device.isLoading}
        />
      </div>
      <div className={`transition-all duration-300 ease-in-out ${device.state === 'on' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        {children}
      </div>
    </GlassCard>
  );
};
