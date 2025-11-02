

import React, { useEffect, useCallback, useState } from 'react';
import type { Camera, ToastMessage } from '../../types';
import { CameraStatusBadge } from './CameraStatusBadge';

// --- SVG Icons for PTZ Controls ---
const ChevronUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m18 15-6-6-6 6"/></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m6 9 6 6 6-6"/></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m9 18 6-6-6-6"/></svg>;
const ZoomInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>;
const ZoomOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>;
const CircleDotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>;

interface CameraFullscreenModalProps {
  camera: Camera;
  cameras: Camera[];
  onClose: () => void;
  onNavigate: (newCameraId: string) => void;
  addToast: (message: string, type?: ToastMessage['type']) => void;
}

const NavButton: React.FC<{ onClick: () => void; children: React.ReactNode; position: 'left' | 'right' }> = ({ onClick, children, position }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`absolute top-1/2 -translate-y-1/2 p-3 bg-black/30 text-white/70 hover:text-white hover:bg-black/50 rounded-full transition-all backdrop-blur-sm ${position === 'left' ? 'left-4' : 'right-4'}`}
    >
        {children}
    </button>
);

const PtzButton: React.FC<{onClick: () => void; children: React.ReactNode}> = ({ onClick, children }) => (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors w-8 h-8">
        {children}
    </button>
);

export const CameraFullscreenModal: React.FC<CameraFullscreenModalProps> = ({ camera, cameras, onClose, onNavigate, addToast }) => {
    const [isHovering, setIsHovering] = useState(false);
    
    const navigate = useCallback((direction: 'next' | 'prev') => {
        const currentIndex = cameras.findIndex(c => c.id === camera.id);
        if (currentIndex === -1) return;
        
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % cameras.length
            : (currentIndex - 1 + cameras.length) % cameras.length;
            
        onNavigate(cameras[newIndex].id);
    }, [camera, cameras, onNavigate]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') navigate('next');
            if (e.key === 'ArrowLeft') navigate('prev');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, navigate]);

    const handlePtzAction = (action: string) => {
        addToast(`Camera action: ${action}`, 'info');
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={onClose}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
             <style>{`
              @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
              .animate-fade-in { animation: fade-in 0.2s ease-out; }
            `}</style>

            <div className="relative w-full h-full flex flex-col items-center justify-center p-4" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white">
                    <div className="bg-black/30 p-2 rounded-lg backdrop-blur-sm">
                        <h2 className="text-xl font-bold">{camera.name}</h2>
                        <p className="text-sm text-slate-300">{camera.streamUrl}</p>
                    </div>
                    <CameraStatusBadge status={camera.status} isLarge />
                </div>

                {/* Main Content */}
                <div className="w-full max-w-7xl aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    <img 
                        src={`https://source.unsplash.com/random/1920x1080?interior,modern,home&sig=${camera.id}`}
                        alt={camera.name}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* PTZ Controls */}
                <div className={`absolute bottom-6 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="flex items-center space-x-4 bg-black/30 backdrop-blur-md p-3 rounded-full">
                        <div className="grid grid-cols-3 gap-1 w-24 h-24">
                            <div/>
                            <PtzButton onClick={() => handlePtzAction('Pan Up')}><ChevronUpIcon /></PtzButton>
                            <div/>
                            <PtzButton onClick={() => handlePtzAction('Pan Left')}><ChevronLeftIcon /></PtzButton>
                            <div className="flex items-center justify-center text-white/50"><CircleDotIcon /></div>
                            <PtzButton onClick={() => handlePtzAction('Pan Right')}><ChevronRightIcon /></PtzButton>
                            <div/>
                            <PtzButton onClick={() => handlePtzAction('Pan Down')}><ChevronDownIcon /></PtzButton>
                            <div/>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <PtzButton onClick={() => handlePtzAction('Zoom In')}><ZoomInIcon /></PtzButton>
                            <PtzButton onClick={() => handlePtzAction('Zoom Out')}><ZoomOutIcon /></PtzButton>
                        </div>
                    </div>
                </div>


                {/* Navigation */}
                <NavButton position="left" onClick={() => navigate('prev')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m15 18-6-6 6-6"/></svg>
                </NavButton>
                <NavButton position="right" onClick={() => navigate('next')}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m9 18 6-6-6-6"/></svg>
                </NavButton>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-3 bg-black/30 text-white/70 hover:text-white hover:bg-black/50 rounded-full transition-all backdrop-blur-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
        </div>
    );
};