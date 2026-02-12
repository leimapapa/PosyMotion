
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, Link, Settings, RefreshCw, Play, Pause, Maximize } from 'lucide-react';
import { VideoSourceType, MotionConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import VideoProcessor from './components/VideoProcessor';
import ControlPanel from './components/ControlPanel';
import SourceSelector from './components/SourceSelector';

const App: React.FC = () => {
  const [sourceType, setSourceType] = useState<VideoSourceType | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [config, setConfig] = useState<MotionConfig>(DEFAULT_CONFIG);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSourceSelect = (type: VideoSourceType, payload?: string | File) => {
    if (sourceUrl && sourceType !== 'camera') {
      URL.revokeObjectURL(sourceUrl);
    }

    setSourceType(type);
    if (type === 'file' && payload instanceof File) {
      setSourceUrl(URL.createObjectURL(payload));
    } else if (type === 'url' && typeof payload === 'string') {
      setSourceUrl(payload);
    } else {
      setSourceUrl(null);
    }
    setIsPlaying(true);
  };

  const resetSource = () => {
    if (sourceUrl && sourceType !== 'camera') {
      URL.revokeObjectURL(sourceUrl);
    }
    setSourceType(null);
    setSourceUrl(null);
  };

  return (
    <div className="relative h-screen w-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Posy<span className="text-blue-500">Motion</span></h1>
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
           {sourceType && (
            <button 
              onClick={() => setShowControls(!showControls)}
              className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
            >
              <Settings className={`w-5 h-5 ${showControls ? 'text-blue-400' : 'text-white'}`} />
            </button>
           )}
           <button 
            onClick={resetSource}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
           >
            <RefreshCw className="w-5 h-5 text-white" />
           </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 relative flex items-center justify-center bg-zinc-950">
        {!sourceType ? (
          <SourceSelector onSelect={handleSourceSelect} />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            <VideoProcessor 
              sourceType={sourceType}
              sourceUrl={sourceUrl}
              config={config}
              isPlaying={isPlaying}
              videoRef={videoRef}
            />
            
            {/* Overlay Play/Pause toggle on click */}
            <div 
              className="absolute inset-0 z-10 cursor-pointer" 
              onClick={() => setIsPlaying(!isPlaying)}
            />

            {/* Floating Quick Action */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-6 py-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="text-white w-6 h-6" /> : <Play className="text-white w-6 h-6 fill-white" />}
              </button>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Delay</span>
                <span className="text-sm font-mono text-blue-400">{config.delay} frames</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Control Panel Drawer */}
      {sourceType && (
        <ControlPanel 
          config={config} 
          setConfig={setConfig} 
          isOpen={showControls} 
          onClose={() => setShowControls(false)} 
        />
      )}

      {/* Status Bar (Hidden when UI collapsed) */}
      {!sourceType && (
        <footer className="p-4 text-center text-zinc-500 text-xs tracking-wide">
          Inspired by Posy's Optic Delta exploration. Use time-delay to reveal motion.
        </footer>
      )}
    </div>
  );
};

export default App;
