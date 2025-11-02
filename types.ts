
export type DeviceState = 'on' | 'off';

// Base interface for all devices
interface BaseDevice {
  id: string;
  name: string;
  state: DeviceState;
  isLoading?: boolean; // Added for async UI feedback
}

// Specific device types with their unique properties
export interface LightDevice extends BaseDevice {
  type: 'light';
  brightness: number; // 0-100
}

export interface FanDevice extends BaseDevice {
  type: 'fan';
  speed: number; // 0 for off, 1-5 for on
}

export interface ACDevice extends BaseDevice {
  type: 'ac';
  temperature: number; // e.g., 16-30
  mode: 'cool' | 'heat' | 'fan' | 'dry';
}

export interface CurtainDevice extends BaseDevice {
  type: 'curtain';
  position: number; // 0-100 (0=closed, 100=open)
}

// A union type for any possible device
export type Device = LightDevice | FanDevice | ACDevice | CurtainDevice;
export type DeviceType = Device['type'];

// Room interface with added sensor data
export interface Room {
  id: number;
  name:string;
  devices: Device[];
  // Mini-dashboard data for detail view
  temperature?: number;
  energyUsage?: {
    today: number;
    last7days: number[];
  };
  alerts?: {
    id: string;
    type: 'gas' | 'smoke' | 'motion';
    message: string;
    timestamp: string;
  }[];
}

// --- NEW: Multi-Camera System Types ---
export type CameraStatus = 'online' | 'offline' | 'connecting';
export type CameraType = 'rtsp' | 'ip' | 'esp32' | 'local';

export interface Camera {
  id: string;
  name: string;
  roomId: number;
  streamUrl: string;
  type: CameraType;
  status: CameraStatus;
  isDefault?: boolean;
}

// New types for App state
export type View = 'dashboard' | 'roomDetail' | 'rooms' | 'devices' | 'activity' | 'settings' | 'cameraGrid' | 'cameras';
export type Theme = 'light' | 'dark' | 'system';

// Type for Toast Notifications
export type ToastType = 'success' | 'error' | 'info';
export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Type for Activity Logs
export interface ActivityLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details?: string;
}

// Type for System Settings
export interface SystemSettings {
    systemName: string;
    network: {
        ipAddress: string;
        connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
    };
}
