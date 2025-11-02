import React from 'react';
import type { Room, Device } from '../types';
import { GlassCard } from './GlassCard';
import { DeviceControlCard } from './controls/DeviceControlCard';
import { SliderControl } from './controls/SliderControl';
import { StepperControl } from './controls/StepperControl';
import { ModeSelector } from './controls/ModeSelector';


interface RoomDetailViewProps {
  room: Room;
  onBack: () => void;
  onUpdateDevice: (roomId: number, deviceId: string, updates: Partial<Device>) => void;
}

const ThermometerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-500 dark:text-orange-400"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>
);
const AlertIcon = ({type}: {type: 'gas' | 'smoke' | 'motion'}) => {
    const color = type === 'gas' ? 'text-red-500' : type === 'smoke' ? 'text-yellow-500' : 'text-blue-500';
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-6 h-6 ${color}`}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
    )
};

export const RoomDetailView: React.FC<RoomDetailViewProps> = ({ room, onBack, onUpdateDevice }) => {

  const handleDeviceChange = (deviceId: string, updates: Partial<Device>) => {
    onUpdateDevice(room.id, deviceId, updates);
  };
  
  const renderDeviceControl = (device: Device) => {
    switch (device.type) {
      case 'light':
        return <SliderControl label="Độ sáng" value={device.brightness} onChange={(val) => handleDeviceChange(device.id, { brightness: val })} min={0} max={100} unit="%" />;
      case 'fan':
        return <StepperControl label="Tốc độ quạt" value={device.speed} onChange={(val) => handleDeviceChange(device.id, { speed: val })} min={0} max={5} unit="Mức" />;
      case 'ac':
        return (
          <>
            <StepperControl label="Nhiệt độ" value={device.temperature} onChange={(val) => handleDeviceChange(device.id, { temperature: val })} min={16} max={30} unit="°C" />
            <ModeSelector label="Chế độ" options={['cool', 'heat', 'fan', 'dry']} selectedOption={device.mode} onSelect={(val) => handleDeviceChange(device.id, { mode: val as any })} />
          </>
        );
      case 'curtain':
        return <SliderControl label="Độ mở rèm" value={device.position} onChange={(val) => handleDeviceChange(device.id, { position: val })} min={0} max={100} unit="%" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 rounded-full bg-slate-300/30 dark:bg-white/10 hover:bg-slate-400/30 dark:hover:bg-white/20 transition-colors mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-slate-800 dark:text-slate-100"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-wider">{room.name}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 flex-1 overflow-y-auto pr-2">
        {/* Left Column: Device Controls */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Thiết bị (Devices)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {room.devices.map(device => (
              <DeviceControlCard key={device.id} device={device} onToggle={(updates) => handleDeviceChange(device.id, updates)}>
                {renderDeviceControl(device)}
              </DeviceControlCard>
            ))}
          </div>
        </div>

        {/* Right Column: Mini Dashboard */}
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Trạng thái phòng</h3>
            <GlassCard>
                <div className="flex items-center space-x-4">
                    <ThermometerIcon/>
                    <div>
                        <p className="text-slate-600 dark:text-slate-300">Nhiệt độ phòng</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{room.temperature}°C</p>
                    </div>
                </div>
            </GlassCard>
            <GlassCard>
                 <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Cảnh báo (Alerts)</h4>
                 <div className="space-y-3">
                    {(room.alerts && room.alerts.length > 0) ? room.alerts.map(alert => (
                        <div key={alert.id} className="flex items-start space-x-3 bg-slate-300/30 dark:bg-slate-800/50 p-3 rounded-lg">
                            <AlertIcon type={alert.type} />
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{alert.message}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{alert.timestamp}</p>
                            </div>
                        </div>
                    )) : <p className="text-slate-500 dark:text-slate-400 text-sm">Không có cảnh báo.</p>}
                 </div>
            </GlassCard>
             <GlassCard>
                 <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Năng lượng</h4>
                <div className="w-full h-32 bg-slate-300/30 dark:bg-slate-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-400/50 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-500 text-center">Biểu đồ phòng<br/>(Chart Placeholder)</p>
                </div>
            </GlassCard>
        </div>
      </div>
    </div>
  );
};