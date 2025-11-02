
import React from 'react';
import { GlassCard } from './GlassCard';
import type { Camera } from '../types';

interface CameraFeedProps {
    camera: Camera | null;
    onSelectCamera: () => void;
}

const NoCameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-slate-500"><path d="M14.53 4 5 13.53"/><path d="M14.5 4H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5L14.5 4z"/><path d="m2 2 20 20"/></svg>
);

const LoadingSpinner = () => (
    <div className="w-8 h-8 border-4 border-slate-400 dark:border-slate-500 border-t-sky-500 rounded-full animate-spin"></div>
);

export const CameraFeed: React.FC<CameraFeedProps> = ({ camera, onSelectCamera }) => {
    return (
        <GlassCard 
            onClick={camera ? onSelectCamera : undefined}
            className={`${camera ? 'cursor-pointer hover:border-sky-500/50 dark:hover:border-sky-400/50 hover:scale-[1.02]' : ''}`}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Camera an ninh</h2>
                {camera && <span className="text-sm font-medium text-sky-500 dark:text-sky-400 cursor-pointer">Xem tất cả</span>}
            </div>
            
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative group">
                {!camera ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-300/30 dark:bg-slate-800/50">
                        { camera === null ? <LoadingSpinner /> : <NoCameraIcon /> }
                        <p className="text-slate-500 mt-2">{camera === null ? 'Đang tải camera...' : 'Không có camera'}</p>
                    </div>
                ) : (
                    <>
                        <img 
                            src={`https://source.unsplash.com/random/800x450?interior,living-room&sig=${camera.id}`}
                            alt={`${camera.name} feed`} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        {camera.status === 'online' && (
                            <div className="absolute top-3 left-3 flex items-center space-x-2 bg-red-600/80 px-2 py-1 rounded-md text-white text-xs font-bold animate-pulse">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>LIVE</span>
                            </div>
                        )}
                         <div className="absolute bottom-3 left-3">
                            <p className="text-white font-semibold">{camera.name}</p>
                            <p className="text-slate-300 text-sm capitalize">{camera.status}</p>
                        </div>
                    </>
                )}
            </div>
        </GlassCard>
    )
}
