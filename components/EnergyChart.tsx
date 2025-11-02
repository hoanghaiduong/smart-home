import React from 'react';
import { GlassCard } from './GlassCard';

const ZapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-500 dark:text-yellow-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

export const EnergyChart: React.FC = () => {
    return (
        <GlassCard>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Năng lượng (Energy)</h2>
                <ZapIcon />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Tiêu thụ hôm nay (Today's Usage)</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    12.5 <span className="text-xl font-medium text-slate-600 dark:text-slate-300">kWh</span>
                </p>
            </div>
            <div className="mt-4 h-40">
                {/* Placeholder for Chart.js canvas */}
                <div className="w-full h-full bg-slate-300/30 dark:bg-slate-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-400/50 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-500 text-center">Biểu đồ năng lượng<br/>(Chart Placeholder)</p>
                </div>
            </div>
        </GlassCard>
    );
};