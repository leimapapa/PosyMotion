
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, Link, Settings, RefreshCw, Play, Pause, Maximize, Circle, Square, FlipHorizontal } from 'lucide-react';
import { VideoSourceType, MotionConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import VideoProcessor from './components/VideoProcessor';
import ControlPanel from './components/ControlPanel';
import SourceSelector from './components/SourceSelector';

const App: React.FC = () => {
  const [sourceType, setSourceType] = useState<VideoSourceType | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [config, setConfig] = useState<MotionConfig>(DEFAULT_CONFIG);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Recording Timer
  useEffect(() => {
    let interval: number;
    if (isRecording) {
      setRecordingSeconds(0);
      interval = window.setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    setIsRecording(false);
  };

  const resetSource = () => {
    if (sourceUrl && sourceType !== 'camera') {
      URL.revokeObjectURL(sourceUrl);
    }
    setSourceType(null);
    setSourceUrl(null);
    setIsRecording(false);
    setShowControls(false);
  };

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
  };

  const toggleCamera = () => {
    setCameraFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="relative h-screen w-screen bg-black flex flex-col overflow-hidden select-none">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 pb-8 flex justify-between items-start bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white drop-shadow-md">Posy<span className="text-blue-500">Motion</span></h1>
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
           {sourceType === 'camera' && (
            <button 
              onClick={toggleCamera}
              className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 active:scale-95 transition-all shadow-xl"
              title="Switch Camera"
            >
              <FlipHorizontal className="w-5 h-5 text-white" />
            </button>
           )}
           {sourceType && (
            <button 
              onClick={() => setShowControls(!showControls)}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all active:scale-95 shadow-xl ${showControls ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
           )}
           <button 
            onClick={resetSource}
            className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 active:scale-95 transition-all shadow-xl"
            title="Reset Source"
           >
            <RefreshCw className="w-5 h-5 text-white" />
           </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 relative flex items-center justify-center bg-zinc-950 overflow-hidden">
        {!sourceType ? (
          <SourceSelector onSelect={handleSourceSelect} />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative group">
            <VideoProcessor 
              sourceType={sourceType}
              sourceUrl={sourceUrl}
              cameraFacingMode={cameraFacingMode}
              config={config}
              isPlaying={isPlaying}
              isRecording={isRecording}
              videoRef={videoRef}
              onRecordingStopped={() => setIsRecording(false)}
            />
            
            {/* Overlay Play/Pause toggle on click */}
            <div 
              className="absolute inset-0 z-10 cursor-pointer" 
              onClick={() => setIsPlaying(!isPlaying)}
            />

            {/* Floating Quick Action Bar - Positioned to avoid overlapping control drawer */}
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl transition-all duration-300 ${showControls ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
              {isRecording && (
                <div className="flex items-center gap-2 px-2 animate-pulse mr-1 border-r border-white/10 pr-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                   <span className="text-xs font-mono text-red-500 font-bold tabular-nums">{formatTime(recordingSeconds)}</span>
                </div>
              )}
              
              <button 
                onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                className="hover:scale-110 active:scale-90 transition-transform p-1.5"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="text-white w-5 h-5 md:w-6 md:h-6" /> : <Play className="text-white w-5 h-5 md:w-6 md:h-6 fill-white" />}
              </button>

              <div className="w-px h-6 bg-white/20" />

              <button 
                onClick={(e) => { e.stopPropagation(); toggleRecording(); }}
                className={`hover:scale-110 active:scale-90 transition-transform p-1.5 ${isRecording ? 'text-red-500' : 'text-white/60 hover:text-white'}`}
                title={isRecording ? "Stop Recording" : "Start Recording"}
              >
                {isRecording ? <Square className="w-5 h-5 md:w-6 md:h-6 fill-red-500" /> : <Circle className="w-5 h-5 md:w-6 md:h-6" />}
              </button>

              <div className="w-px h-6 bg-white/20" />
              
              <div className="flex flex-col items-center min-w-[40px] md:min-w-[60px]">
                <span className="text-[8px] md:text-[10px] text-zinc-400 uppercase tracking-widest font-bold leading-none mb-1">Delay</span>
                <span className="text-xs md:text-sm font-mono text-blue-400 font-bold leading-none">{config.delay}f</span>
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

      {/* Status Bar */}
      {!sourceType && (
        <footer className="p-6 text-center text-zinc-500 text-[10px] md:text-xs tracking-wide bg-gradient-to-t from-black to-transparent">
          Inspired by Posy's Optic Delta exploration. Use time-delay to reveal motion.
        </footer>
      )}
    </div>
  );
};

export default App;
