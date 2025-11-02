
import React from 'react';
import type { Camera } from '../../types';
import { CameraStatusBadge } from './CameraStatusBadge';

interface CameraTileProps {
  camera: Camera;
  onClick: () => void;
}

const OfflineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-slate-600 dark:text-slate-500"><path d="M9.06 7.94A5.99 5.99 0 0 1 12 6a6 6 0 0 1 6 6 5.99 5.99 0 0 1-.51 2.52"/><path d="M2 2 22 22"/><path d="M12 18a6 6 0 0 1-6-6c0-.9.2-1.75.53-2.52L2.5 3.5"/><path d="M7 13a2 2 0 0 0-2-2 2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-.42"/></svg>
);
const ConnectingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-slate-600 dark:text-slate-500 animate-pulse"><path d="M20 12c0-4.4-3.6-8-8-8"/><path d="M5 12A8 8 0 0 1 12 4"/></svg>
);


export const CameraTile: React.FC<CameraTileProps> = ({ camera, onClick }) => {
  return (
    <div
      className="aspect-video bg-black rounded-lg overflow-hidden relative group cursor-pointer"
      onClick={onClick}
    >
      {camera.status === 'online' ? (
        <img
          src={`https://source.unsplash.com/random/800x450?interior,modern&sig=${camera.id}`}
          alt={`${camera.name} feed`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      ) : (
          <div className="w-full h-full bg-slate-400/20 dark:bg-slate-800/30 flex items-center justify-center">
            {camera.status === 'offline' && <OfflineIcon />}
            {camera.status === 'connecting' && <ConnectingIcon />}
          </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="absolute top-2 right-2">
        <CameraStatusBadge status={camera.status} />
      </div>

      <div className="absolute bottom-2 left-3 transition-transform translate-y-10 group-hover:translate-y-0 duration-300">
        <p className="text-white font-semibold text-lg">{camera.name}</p>
        <p className="text-slate-300 text-sm">{camera.type.toUpperCase()}</p>
      </div>
    </div>
  );
};
