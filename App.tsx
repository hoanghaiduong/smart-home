



import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { StatusOverview } from './components/StatusOverview';
import { RoomControls } from './components/RoomControls';
import { CameraFeed } from './components/CameraFeed';
import { EnergyChart } from './components/EnergyChart';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { RoomDetailView } from './components/RoomDetailView';
import { RoomManagement } from './components/RoomManagement';
import { DeviceManagement } from './components/DeviceManagement';
import { ActivityLogView } from './components/ActivityLog';
import { Settings } from './components/Settings';
import { ToastContainer } from './components/common/ToastContainer';
import { CameraManagement } from './components/CameraManagement';
import { CameraGridView } from './components/CameraGridView';
import type { Room, Device, View, Theme, ToastMessage, ActivityLog, DeviceType, SystemSettings, LightDevice, Camera, FanDevice, CurtainDevice } from './types';

// Define the type for our status data for better type-checking
export type StatusColor = 'green' | 'orange' | 'sky' | 'rose';
export interface StatusData {
  temperature: { value: number; progress: number };
  humidity: { value: number; progress: number };
  gas: { value: number; label: string; color: StatusColor; progress: number };
  security: { label: string; progress: number };
}

// Mock API data for cameras
const mockCameras: Camera[] = [
    { id: 'cam-01', name: 'Camera Phòng Khách', roomId: 1, streamUrl: 'rtsp://192.168.1.50/stream1', type: 'rtsp', status: 'online', isDefault: true },
    { id: 'cam-02', name: 'Camera Nhà Bếp', roomId: 2, streamUrl: 'http://192.168.1.51/mjpeg', type: 'ip', status: 'online' },
    { id: 'cam-03', name: 'Camera Sân Vườn', roomId: 7, streamUrl: 'local://garden-cam', type: 'local', status: 'offline' },
    { id: 'cam-04', name: 'Camera Gara', roomId: 9, streamUrl: 'esp32://192.168.1.52', type: 'esp32', status: 'online' },
    { id: 'cam-05', name: 'Camera Cửa Trước', roomId: 8, streamUrl: 'rtsp://192.168.1.53/stream1', type: 'rtsp', status: 'online' },
    { id: 'cam-06', name: 'Camera Sân Thượng', roomId: 7, streamUrl: 'local://rooftop-cam', type: 'local', status: 'connecting' },
];


const App: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      name: 'Phòng khách (Living Room)',
      temperature: 24.5,
      alerts: [
        { id: 'alert-1', type: 'motion', message: 'Phát hiện chuyển động', timestamp: '2 phút trước' }
      ],
      devices: [
        { id: 'lr-light', name: 'Đèn (Light)', type: 'light', state: 'off', brightness: 75 },
        { id: 'lr-fan', name: 'Quạt (Fan)', type: 'fan', state: 'on', speed: 3 },
        { id: 'lr-ac', name: 'Máy lạnh (AC)', type: 'ac', state: 'on', temperature: 22, mode: 'cool' },
        { id: 'lr-curtain', name: 'Rèm cửa (Curtain)', type: 'curtain', state: 'off', position: 0 },
      ],
    },
    {
      id: 2,
      name: 'Nhà bếp (Kitchen)',
      temperature: 26.1,
      alerts: [
        { id: 'alert-2', type: 'gas', message: 'Cảnh báo rò rỉ gas!', timestamp: 'vừa xong' }
      ],
      devices: [
        { id: 'k-light', name: 'Đèn (Light)', type: 'light', state: 'on', brightness: 90 },
        { id: 'k-fan', name: 'Quạt hút (Vent)', type: 'fan', state: 'off', speed: 0 },
      ],
    },
    {
      id: 3,
      name: 'Phòng ngủ (Bedroom)',
      temperature: 23.8,
      devices: [
        { id: 'br-light', name: 'Đèn (Light)', type: 'light', state: 'off', brightness: 50 },
        { id: 'br-ac', name: 'Máy lạnh (AC)', type: 'ac', state: 'off', temperature: 24, mode: 'cool' },
      ],
    },
    { id: 4, name: 'Phòng làm việc (Office)', temperature: 25.0, devices: [{ id: 'of-light', name: 'Đèn bàn', type: 'light', state: 'on', brightness: 80 }] },
    { id: 5, name: 'Phòng tắm (Bathroom)', temperature: 27.2, devices: [{ id: 'bt-light', name: 'Đèn gương', type: 'light', state: 'off', brightness: 60 }] },
    { id: 6, name: 'Nhà kho (Storage)', temperature: 22.1, devices: [{ id: 'st-light', name: 'Đèn', type: 'light', state: 'off', brightness: 100 }] },
    { id: 7, name: 'Sân thượng (Rooftop)', temperature: 29.5, devices: [{ id: 'rt-light', name: 'Đèn dây', type: 'light', state: 'on', brightness: 70 }] },
    { id: 8, name: 'Hành lang (Hallway)', temperature: 24.0, devices: [{ id: 'hw-light', name: 'Đèn tường', type: 'light', state: 'on', brightness: 40 }] },
    { id: 9, name: 'Gara (Garage)', temperature: 23.5, devices: [{ id: 'gr-light', name: 'Đèn huỳnh quang', type: 'light', state: 'off', brightness: 100 }] },
    { id: 10, name: 'Phòng trẻ em (Kids Room)', temperature: 24.2, devices: [{ id: 'kr-light', name: 'Đèn ngủ', type: 'light', state: 'on', brightness: 20 }] },
    { id: 11, name: 'Phòng giải trí (Media Room)', temperature: 23.9, devices: [{ id: 'mr-light', name: 'Đèn LED', type: 'light', state: 'on', brightness: 60 }] },
    { id: 12, name: 'Ban công (Balcony)', temperature: 28.1, devices: [{ id: 'bc-light', name: 'Đèn', type: 'light', state: 'off', brightness: 50 }] },
  ]);
  
  const [statusData, setStatusData] = useState<StatusData>({
    temperature: { value: 24, progress: 60 },
    humidity: { value: 68, progress: 68 },
    gas: { value: 10, label: 'An toàn', color: 'green', progress: 10 },
    security: { label: 'Kích hoạt', progress: 100 },
  });
  
  const [cameras, setCameras] = useState<Camera[]>([]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => [
      { id: 'log-1', timestamp: new Date(Date.now() - 120000).toISOString(), user: 'Hệ thống', action: 'Security armed', details: 'All sensors are now active.' },
      { id: 'log-2', timestamp: new Date(Date.now() - 300000).toISOString(), user: 'Admin', action: 'Turned on', details: 'Living Room - AC' },
      { id: 'log-3', timestamp: new Date(Date.now() - 600000).toISOString(), user: 'Admin', action: 'Turned off', details: 'Kitchen - Light' }
  ]);
    
  const addActivityLog = useCallback((action: string, details: string, user: string = 'Admin') => {
      const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user,
          action,
          details,
      };
      setActivityLogs(prev => [newLog, ...prev]);
  }, []);

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // --- New State Management ---
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) || 'system'
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    systemName: 'Luxury Smart Home',
    network: {
        ipAddress: '192.168.1.100',
        connectionStatus: 'disconnected',
    },
  });

  // --- Toast Management ---
  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  // --- Theme Management ---
  const applyTheme = (t: Theme) => {
    const root = window.document.documentElement;
    const isDark =
      t === 'dark' ||
      (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(isDark ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  }, [theme]);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);


  useEffect(() => {
    // Initial load animation
    const timer = setTimeout(() => setIsLoaded(true), 100);

    // Mock fetch cameras
    setTimeout(() => {
        setCameras(mockCameras);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Effect for live data simulation
  useEffect(() => {
    const intervalId = setInterval(() => {
      setStatusData(prevData => {
        const tempFluctuation = (Math.random() - 0.5) * 1.5;
        const newTemp = parseFloat((prevData.temperature.value + tempFluctuation).toFixed(1));
        const clampedTemp = Math.min(35, Math.max(15, newTemp));
        const tempProgress = ((clampedTemp - 15) / (35 - 15)) * 100;

        const humidityFluctuation = (Math.random() - 0.5) * 3;
        const newHumidity = Math.round(prevData.humidity.value + humidityFluctuation);
        const clampedHumidity = Math.min(100, Math.max(20, newHumidity));

        const newGasValue = Math.floor(Math.random() * 35) + 5;
        const isGasWarning = newGasValue > 25;
        
        return {
          ...prevData,
          temperature: { value: clampedTemp, progress: tempProgress },
          humidity: { value: clampedHumidity, progress: clampedHumidity },
          gas: {
            value: newGasValue,
            label: isGasWarning ? 'Cảnh báo' : 'An toàn',
            color: isGasWarning ? 'orange' : 'green',
            progress: newGasValue * 2.5,
          }
        };
      });
    }, 3000);
    
    // Simulate camera status changes
    const cameraPingInterval = setInterval(() => {
        setCameras(prevCameras => prevCameras.map(cam => {
            const random = Math.random();
            if (random < 0.1) return {...cam, status: 'offline'};
            if (random < 0.15) return {...cam, status: 'connecting'};
            return {...cam, status: 'online'};
        }));
    }, 7000);

    return () => {
      clearInterval(intervalId);
      clearInterval(cameraPingInterval);
    }
  }, []);

  // Ref to store debounce timers for each device
  const deviceUpdateTimers = useRef<Record<string, number>>({});

  // FIX: This function was causing a complex TypeScript error due to spreading a `Partial<Device>`
  // onto a specific device type, which breaks the discriminated union. The fix involves explicitly
  // annotating the return type of the inner `map` as `Device` and then carefully updating
  // properties based on the original `device.type` to ensure type safety.
  const handleUpdateDevice = (roomId: number, deviceId: string, updates: Partial<Device>) => {
      const isContinuousChange = 'brightness' in updates || 'position' in updates || 'speed' in updates || 'temperature' in updates;

      // For continuous changes (sliders), update state optimistically without a loading spinner
      if (isContinuousChange) {
          setRooms(prevRooms => prevRooms.map(room => room.id === roomId ? {
              ...room,
              devices: room.devices.map((device): Device => {
                  if (device.id === deviceId) {
                      const updatedDevice = { ...device, ...updates };
                      // Keep state consistent (e.g., if brightness > 0, state is 'on')
                      if (device.type === 'light') {
                          const d = updatedDevice as LightDevice;
                          if (typeof d.brightness === 'number') d.state = d.brightness > 0 ? 'on' : 'off';
                      } else if (device.type === 'fan') {
                          const d = updatedDevice as FanDevice;
                          if (typeof d.speed === 'number') d.state = d.speed > 0 ? 'on' : 'off';
                      } else if (device.type === 'curtain') {
                          const d = updatedDevice as CurtainDevice;
                          if (typeof d.position === 'number') d.state = d.position > 0 ? 'on' : 'off';
                      }
                      return updatedDevice as Device;
                  }
                  return device;
              })
          } : room));
      } else {
          // For discrete changes (toggles), show a loading spinner for better feedback
          setRooms(prevRooms => prevRooms.map(r => r.id === roomId ? { ...r, devices: r.devices.map(d => d.id === deviceId ? { ...d, isLoading: true } : d) } : r));
      }

      // Clear any previous debounce timer for this specific device
      if (deviceUpdateTimers.current[deviceId]) {
          clearTimeout(deviceUpdateTimers.current[deviceId]);
      }

      // Set a new timer to simulate API call after a delay
      deviceUpdateTimers.current[deviceId] = window.setTimeout(() => {
          const isSuccess = Math.random() > 0.2; // 80% success rate

          if (isSuccess) {
              // On success, finalize the state update and remove the loading spinner
              setRooms(prevRooms =>
                  prevRooms.map(room => {
                      if (room.id === roomId) {
                          return {
                              ...room,
                              devices: room.devices.map((device): Device => {
                                  if (device.id === deviceId) {
                                      const finalDevice = { ...device, ...updates, isLoading: false };
                                      
                                      // Sync state again for consistency
                                      if (device.type === 'light') {
                                          const d = finalDevice as LightDevice;
                                          if (typeof d.brightness === 'number') d.state = d.brightness > 0 ? 'on' : 'off';
                                      } else if (device.type === 'fan') {
                                          const d = finalDevice as FanDevice;
                                          if (typeof d.speed === 'number') d.state = d.speed > 0 ? 'on' : 'off';
                                      } else if (device.type === 'curtain') {
                                          const d = finalDevice as CurtainDevice;
                                          if (typeof d.position === 'number') d.state = d.position > 0 ? 'on' : 'off';
                                      }

                                      const action = updates.state ? `Turned ${updates.state}` : 'Updated';
                                      addActivityLog(action, `${room.name} - ${finalDevice.name}`);
                                      return finalDevice as Device;
                                  }
                                  return device;
                              }),
                          };
                      }
                      return room;
                  })
              );
              // Show toast only after the debounce period and on success
              addToast('Device updated successfully', 'success');
          } else {
              addToast('Failed to update device', 'error');
              // On failure, just remove the loading state. The optimistic update might remain or could be reverted here.
              setRooms(prevRooms => prevRooms.map(r => r.id === roomId ? { ...r, devices: r.devices.map(d => d.id === deviceId ? { ...d, isLoading: false } : d) } : r));
          }
      }, isContinuousChange ? 400 : 1000); // 400ms debounce for sliders, 1s mock API for toggles
  };
  
  // --- CRUD Handlers ---

  // Rooms
  const handleAddRoom = (roomData: Omit<Room, 'id' | 'devices' | 'alerts'>) => {
    const newRoom: Room = {
        ...roomData,
        id: Date.now(),
        devices: [],
    };
    setRooms(prev => [...prev, newRoom]);
    addActivityLog('Created Room', newRoom.name);
    addToast('Room added successfully', 'success');
  };

  const handleUpdateRoom = (roomId: number, roomData: Partial<Omit<Room, 'id' | 'devices'>>) => {
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, ...roomData } : r));
      addActivityLog('Updated Room', roomData.name || `ID: ${roomId}`);
      addToast('Room updated successfully', 'success');
  };

  const handleDeleteRoom = (roomId: number) => {
      const roomName = rooms.find(r => r.id === roomId)?.name || `ID: ${roomId}`;
      setRooms(prev => prev.filter(r => r.id !== roomId));
      addActivityLog('Deleted Room', roomName);
      addToast('Room deleted successfully', 'success');
  };

  // Devices
  const handleAddDevice = (roomId: number, deviceData: { name: string, type: DeviceType }) => {
    const newDevice: Device = {
        id: `${deviceData.type}-${Date.now()}`,
        name: deviceData.name,
        type: deviceData.type,
        state: 'off',
        ... (deviceData.type === 'light' && { brightness: 0 }),
        ... (deviceData.type === 'fan' && { speed: 0 }),
        ... (deviceData.type === 'ac' && { temperature: 22, mode: 'cool' }),
        ... (deviceData.type === 'curtain' && { position: 0 }),
    } as Device;

    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, devices: [...r.devices, newDevice] } : r));
    const roomName = rooms.find(r => r.id === roomId)?.name;
    addActivityLog('Added Device', `${newDevice.name} to ${roomName}`);
    addToast('Device added successfully', 'success');
  };

  // FIX: Explicitly annotating the return type of the inner map as `Device` helps
  // TypeScript correctly handle the discriminated union after spreading `deviceData`.
  const handleUpdateDeviceCRUD = (roomId: number, deviceId: string, deviceData: Partial<Device>) => {
      setRooms(prev => prev.map(r => {
          if (r.id === roomId) {
              return { ...r, devices: r.devices.map((d): Device => d.id === deviceId ? { ...d, ...deviceData } as Device : d) };
          }
          return r;
      }));
      const roomName = rooms.find(r => r.id === roomId)?.name;
      addActivityLog('Updated Device', `${deviceData.name || `ID: ${deviceId}`} in ${roomName}`);
      addToast('Device updated successfully', 'success');
  };

  const handleDeleteDevice = (roomId: number, deviceId: string) => {
      const room = rooms.find(r => r.id === roomId);
      const device = room?.devices.find(d => d.id === deviceId);
      setRooms(prev => prev.map(r => {
          if (r.id === roomId) {
              return { ...r, devices: r.devices.filter(d => d.id !== deviceId) };
          }
          return r;
      }));
      addActivityLog('Deleted Device', `${device?.name || `ID: ${deviceId}`} from ${room?.name}`);
      addToast('Device deleted successfully', 'success');
  };

  const handleTurnOffAllLights = () => {
    setRooms(prevRooms =>
      prevRooms.map(room => ({
        ...room,
        // FIX: Explicitly annotating the return type of the inner map as `Device` helps
        // TypeScript correctly handle the discriminated union when using object spread.
        // This resolves a complex type error where the compiler would otherwise fail to
        // recognize the mapped array as a valid `Device[]`.
        devices: room.devices.map((device): Device => {
          if (device.type === 'light') {
            return { ...device, state: 'off', brightness: 0 };
          }
          return device;
        }),
      })),
    );
    addActivityLog('Turned off all lights', 'All rooms');
    addToast('All lights have been turned off', 'success');
  };
  
  // Settings Handler
  const handleUpdateSettings = (newSettings: SystemSettings) => {
    setSystemSettings(newSettings);
    addActivityLog('Updated Settings', `System name set to "${newSettings.systemName}"`);
    addToast('Settings saved successfully', 'success');
  };

  // --- NEW: Camera CRUD Handlers ---
  const handleAddCamera = (cameraData: Omit<Camera, 'id' | 'status'>) => {
      const newCamera: Camera = {
          ...cameraData,
          id: `cam-${Date.now()}`,
          status: 'connecting', // New cameras start as connecting
      };
      if (newCamera.isDefault) {
          setCameras(prev => [...prev.map(c => ({...c, isDefault: false})), newCamera]);
      } else {
          setCameras(prev => [...prev, newCamera]);
      }
      addActivityLog('Added Camera', newCamera.name);
      addToast('Camera added successfully', 'success');
  };

  const handleUpdateCamera = (cameraId: string, cameraData: Partial<Omit<Camera, 'id'>>) => {
      setCameras(prev => prev.map(cam => {
          if (cam.id === cameraId) {
              // If setting a new default, unset the old one
              if (cameraData.isDefault) {
                  prev.forEach(c => { if(c.isDefault) c.isDefault = false });
              }
              return { ...cam, ...cameraData };
          }
          // If setting a new default, ensure the old one is unset
          if (cameraData.isDefault && cam.isDefault) {
              return { ...cam, isDefault: false };
          }
          return cam;
      }));
      addActivityLog('Updated Camera', cameraData.name || `ID: ${cameraId}`);
      addToast('Camera updated successfully', 'success');
  };

  const handleDeleteCamera = (cameraId: string) => {
      const cameraName = cameras.find(c => c.id === cameraId)?.name || `ID: ${cameraId}`;
      setCameras(prev => prev.filter(c => c.id !== cameraId));
      addActivityLog('Deleted Camera', cameraName);
      addToast('Camera deleted successfully', 'success');
  };

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    setCurrentView('roomDetail');
  };

  const handleSelectCamera = () => {
    setCurrentView('cameraGrid');
  };

  const handleBackToDashboard = () => {
    setSelectedRoomId(null);
    setCurrentView('dashboard');
  }

  const selectedRoom = rooms.find(room => room.id === selectedRoomId) || null;
  const defaultCamera = cameras.find(c => c.isDefault) || cameras.find(c => c.status === 'online') || null;

  const renderView = () => {
    switch(currentView) {
      case 'roomDetail':
        return selectedRoom ? <RoomDetailView room={selectedRoom} onBack={handleBackToDashboard} onUpdateDevice={handleUpdateDevice} /> : <div />;
      case 'rooms':
        return <RoomManagement rooms={rooms} onAdd={handleAddRoom} onUpdate={handleUpdateRoom} onDelete={handleDeleteRoom} />;
      case 'devices':
        return <DeviceManagement rooms={rooms} onAdd={handleAddDevice} onUpdate={handleUpdateDeviceCRUD} onDelete={handleDeleteDevice} />;
      case 'activity':
        return <ActivityLogView logs={activityLogs} />;
      case 'settings':
        return <Settings settings={systemSettings} onUpdateSettings={handleUpdateSettings} />;
      case 'cameraGrid':
        return <CameraGridView cameras={cameras} onBack={handleBackToDashboard} addToast={addToast} />;
      case 'cameras':
        return <CameraManagement rooms={rooms} cameras={cameras} onAdd={handleAddCamera} onUpdate={handleUpdateCamera} onDelete={handleDeleteCamera} />;
      case 'dashboard':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <StatusOverview data={statusData} />
              <RoomControls rooms={rooms} onSelectRoom={handleSelectRoom} onTurnOffAllLights={handleTurnOffAllLights} />
            </div>
            <div className="space-y-6 lg:space-y-8">
              <CameraFeed camera={defaultCamera} onSelectCamera={handleSelectCamera} />
              <EnergyChart />
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(toast => toast.id !== id))} />
      <div className={`p-2 sm:p-4 min-h-screen transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-slate-300/10 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-400/20 dark:border-white/20 shadow-2xl dark:shadow-black/50 rounded-2xl sm:rounded-3xl min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] flex overflow-hidden">
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggleCollapse={() => setSidebarCollapsed(p => !p)}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
          <div className="flex-1 flex flex-col">
            <Header 
              systemName={systemSettings.systemName}
              theme={theme} 
              onThemeChange={setTheme}
            />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 relative overflow-y-auto">
              {renderView()}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;