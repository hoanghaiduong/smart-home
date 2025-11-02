

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './common/Button';
import { CameraTile } from './common/CameraTile';
import { CameraFullscreenModal } from './common/CameraFullscreenModal';
import type { Camera, ToastMessage } from '../types';

// Icons for controls
const Grid2x2Icon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/></svg>);
const Grid3x3Icon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>);
const CycleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M4.5 2.5c-2.4 2.8-2.2 7.1.6 9.7"/><path d="m2.6 10.3 2.5.2.2-2.5"/><path d="M19.5 21.5c-2.4-2.8 2.2-7.1-.6-9.7"/><path d="m21.4 13.7-2.5-.2-.2 2.5"/><path d="M11 6.8a5.8 5.8 0 0 0-4.3 9.4"/><path d="M13 17.2a5.8 5.8 0 0 0 4.3-9.4"/></svg>);

interface CameraGridViewProps {
  cameras: Camera[];
  onBack: () => void;
  addToast: (message: string, type?: ToastMessage['type']) => void;
}

type GridLayout = '2x2' | '3x3';

export const CameraGridView: React.FC<CameraGridViewProps> = ({ cameras, onBack, addToast }) => {
    const [gridLayout, setGridLayout] = useState<GridLayout>('2x2');
    const [isCycling, setIsCycling] = useState(false);
    const [fullscreenCameraId, setFullscreenCameraId] = useState<string | null>(null);

    const openFullscreen = (cameraId: string) => {
        setIsCycling(false); // Stop cycling when opening fullscreen
        setFullscreenCameraId(cameraId);
    };

    const closeFullscreen = () => setFullscreenCameraId(null);
    
    // Auto-cycle effect
    useEffect(() => {
        if (!isCycling) return;
        const onlineCameras = cameras.filter(c => c.status === 'online');
        if (onlineCameras.length === 0) return;

        // Open the first online camera in fullscreen
        openFullscreen(onlineCameras[0].id);

        const cycleInterval = setInterval(() => {
            setFullscreenCameraId(currentId => {
                const currentIndex = onlineCameras.findIndex(c => c.id === currentId);
                const nextIndex = (currentIndex + 1) % onlineCameras.length;
                return onlineCameras[nextIndex].id;
            });
        }, 10000); // Cycle every 10 seconds

        return () => clearInterval(cycleInterval);
    }, [isCycling, cameras]);
    
    const handleToggleCycle = () => {
        if (!isCycling && cameras.length > 0) {
            setIsCycling(true);
        } else {
            setIsCycling(false);
            closeFullscreen();
        }
    };

    const gridClasses = {
        '2x2': 'grid-cols-1 md:grid-cols-2',
        '3x3': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    };
    
    const fullscreenCamera = cameras.find(c => c.id === fullscreenCameraId) || null;

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <button onClick={onBack} className="p-2 rounded-full bg-slate-300/30 dark:bg-white/10 hover:bg-slate-400/30 dark:hover:bg-white/20 transition-colors mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-slate-800 dark:text-slate-100"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-wider">Live View</h2>
          </div>
          <div className="flex items-center space-x-2">
                <Button variant={isCycling ? 'primary' : 'outline'} onClick={handleToggleCycle}><CycleIcon />{isCycling ? 'Dừng' : 'Tự động xoay'}</Button>
                <div className="flex items-center space-x-1 bg-slate-300/50 dark:bg-slate-800/50 p-1 rounded-lg">
                    <button onClick={() => setGridLayout('2x2')} className={`p-2 rounded-md ${gridLayout === '2x2' ? 'bg-sky-500/20 text-sky-500' : 'text-slate-500'}`}><Grid2x2Icon /></button>
                    <button onClick={() => setGridLayout('3x3')} className={`p-2 rounded-md ${gridLayout === '3x3' ? 'bg-sky-500/20 text-sky-500' : 'text-slate-500'}`}><Grid3x3Icon /></button>
                </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
            <div className={`grid ${gridClasses[gridLayout]} gap-4`}>
                {cameras.map(camera => (
                    <CameraTile key={camera.id} camera={camera} onClick={() => openFullscreen(camera.id)} />
                ))}
            </div>
        </div>
      </div>

      {fullscreenCamera && (
          <CameraFullscreenModal
            camera={fullscreenCamera}
            cameras={cameras}
            onClose={closeFullscreen}
            onNavigate={setFullscreenCameraId}
            addToast={addToast}
          />
      )}
    </>
  );
};