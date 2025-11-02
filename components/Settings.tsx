import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Input } from './common/Input';
import { Button } from './common/Button';
import type { SystemSettings } from '../types';

const WifiIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>
);

const ConnectionStatusIndicator: React.FC<{ status: SystemSettings['network']['connectionStatus'] }> = ({ status }) => {
    const statusConfig = {
        disconnected: { text: 'Disconnected', color: 'text-slate-500', bgColor: 'bg-slate-500/20', indicatorColor: 'bg-slate-500' },
        connecting: { text: 'Connecting...', color: 'text-amber-500', bgColor: 'bg-amber-500/20', indicatorColor: 'bg-amber-500 animate-pulse' },
        connected: { text: 'Connected', color: 'text-green-500', bgColor: 'bg-green-500/20', indicatorColor: 'bg-green-500' },
        error: { text: 'Connection Failed', color: 'text-rose-500', bgColor: 'bg-rose-500/20', indicatorColor: 'bg-rose-500' },
    };
    const { text, color, bgColor, indicatorColor } = statusConfig[status];
    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${bgColor} ${color}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${indicatorColor}`}></span>
            {text}
        </div>
    );
};

interface SettingsProps {
    settings: SystemSettings;
    onUpdateSettings: (newSettings: SystemSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
    const [formData, setFormData] = useState(settings);
    const [isTesting, setIsTesting] = useState(false);
    const [testStatus, setTestStatus] = useState(settings.network.connectionStatus);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setFormData(settings);
        setTestStatus(settings.network.connectionStatus);
        setIsDirty(false); // Reset dirty state when props change
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDirty(true);
        const { name, value } = e.target;
        if (name === 'systemName') {
            setFormData(prev => ({ ...prev, systemName: value }));
        } else if (name === 'ipAddress') {
            setTestStatus('disconnected'); // Reset test status if IP changes
            setFormData(prev => ({ ...prev, network: { ...prev.network, ipAddress: value } }));
        }
    };

    const handleTestConnection = () => {
        setIsTesting(true);
        setTestStatus('connecting');
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% success rate
            setIsDirty(true); // Testing makes the form dirty
            setTestStatus(success ? 'connected' : 'error');
            setIsTesting(false);
        }, 1500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateSettings({
            ...formData,
            network: {
                ...formData.network,
                connectionStatus: testStatus
            }
        });
        setIsDirty(false);
    };

    return (
        <GlassCard>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">Cài đặt (Settings)</h2>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                {/* General Settings */}
                <section>
                    <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 border-b border-slate-400/30 dark:border-slate-600/50 pb-2 mb-4">
                        Cài đặt chung
                    </h3>
                    <div className="space-y-4">
                        <Input
                            label="Tên hệ thống"
                            id="systemName"
                            name="systemName"
                            value={formData.systemName}
                            onChange={handleChange}
                            placeholder="e.g., My Smart Home"
                        />
                    </div>
                </section>

                {/* Network Settings */}
                <section>
                    <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 border-b border-slate-400/30 dark:border-slate-600/50 pb-2 mb-4">
                        Kết nối mạng
                    </h3>
                    <div className="space-y-4">
                        <Input
                            label="Địa chỉ IP Hub"
                            id="ipAddress"
                            name="ipAddress"
                            value={formData.network.ipAddress}
                            onChange={handleChange}
                            placeholder="e.g., 192.168.1.100"
                        />
                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-300/30 dark:bg-slate-800/50 p-3 rounded-lg">
                            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                                <WifiIcon className="w-6 h-6 text-sky-500 dark:text-sky-400" />
                                <div>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">Trạng thái kết nối</p>
                                    <ConnectionStatusIndicator status={testStatus} />
                                </div>
                            </div>
                            <Button type="button" variant="outline" onClick={handleTestConnection} disabled={isTesting}>
                                {isTesting ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" disabled={!isDirty}>
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </GlassCard>
    );
};