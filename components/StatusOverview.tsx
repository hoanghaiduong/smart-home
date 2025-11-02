import React from 'react';
import type { StatusData } from '../App';
import { StatusCard } from './StatusCard';
import { GlassCard } from './GlassCard';


// Icon components are now stateless and don't contain hardcoded colors
const ThermometerIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={['w-8 h-8', className].filter(Boolean).join(' ')}><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>
);
const DropletsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={['w-8 h-8', className].filter(Boolean).join(' ')}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.7-3.29C8.2 7.81 7 6.3 7 4.5c0-1.38 1.12-2.5 2.5-2.5S12 3.12 12 4.5c0 1.8-1.2 3.31-2.3 4.46-1.13 1.03-1.7 2.13-1.7 3.29 0 2.22 1.8 4.05 4 4.05Z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.5 6.5 0 0 1-13 0c0-1.5.5-3 1.5-4.5Z"/></svg>
);
const ShieldAlertIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={['w-8 h-8', className].filter(Boolean).join(' ')}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
);
const VideoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={['w-8 h-8', className].filter(Boolean).join(' ')}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);

interface StatusOverviewProps {
  data: StatusData;
}

export const StatusOverview: React.FC<StatusOverviewProps> = ({ data }) => {
  return (
    <GlassCard>
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Tổng quan (Home Status)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatusCard 
          icon={<ThermometerIcon />}
          label="Nhiệt độ (Temperature)"
          value={`${data.temperature.value.toFixed(1)}°C`}
          progress={data.temperature.progress}
          color="orange"
        />
        <StatusCard 
          icon={<DropletsIcon />}
          label="Độ ẩm (Humidity)"
          value={`${data.humidity.value}%`}
          progress={data.humidity.progress}
          color="sky"
        />
        <StatusCard 
          icon={<ShieldAlertIcon />}
          label="Mức gas (Gas Level)"
          value={data.gas.label}
          progress={data.gas.progress}
          color={data.gas.color}
        />
        <StatusCard 
          icon={<VideoIcon />}
          label="An ninh (Security)"
          value={data.security.label}
          progress={data.security.progress}
          color="rose"
        />
      </div>
    </GlassCard>
  );
};