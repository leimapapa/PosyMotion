
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
      {/* Header Overlay - High Z-Index and contrast */}
      <header className="absolute top-0 left-0 right-0 z-[60] p-4 flex justify-between items-center bg-gradient-to-b from-black/95 via-black/40 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/60">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Posy<span className="text-blue-500">Motion</span></h1>
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
           {sourceType === 'camera' && (
            <button 
              onClick={toggleCamera}
              className="p-2.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 hover:bg-black/70 active:scale-95 transition-all shadow-2xl"
              title="Switch Camera"
            >
              <FlipHorizontal className="w-5 h-5 text-white" />
            </button>
           )}
           {sourceType && (
            <button 
              onClick={() => setShowControls(!showControls)}
              className={`p-2.5 rounded-full backdrop-blur-xl border transition-all active:scale-95 shadow-2xl ${showControls ? 'bg-blue-600 border-blue-400 text-white' : 'bg-black/50 border-white/20 text-white hover:bg-black/70'}`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
           )}
           <button 
            onClick={resetSource}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 hover:bg-black/70 active:scale-95 transition-all shadow-2xl"
            title="Reset Source"
           >
            <RefreshCw className="w-5 h-5 text-white" />
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-black overflow-hidden flex flex-col">
        {!sourceType ? (
          <div className="flex-1 overflow-y-auto flex items-center justify-center pt-24 pb-12">
            <SourceSelector onSelect={handleSourceSelect} />
          </div>
        ) : (
          <div className="flex-1 relative flex items-center justify-center w-full h-full overflow-hidden">
            {/* The Video Processor uses object-contain to maximize visible area within parent flex container */}
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
            
            {/* Interaction Layer */}
            <div 
              className="absolute inset-0 z-10" 
              onClick={() => setIsPlaying(!isPlaying)}
            />

            {/* Recording Timer Overlay */}
            {isRecording && (
              <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-2.5 bg-red-600 backdrop-blur-2xl rounded-full shadow-2xl border border-white/20 animate-pulse">
                 <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                 <span className="text-sm font-mono text-white font-black tabular-nums">{formatTime(recordingSeconds)}</span>
              </div>
            )}

            {/* Floating Action Menu - Positioned safely above standard mobile navigation */}
            <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-5 px-7 py-4 bg-zinc-900/95 backdrop-blur-3xl border border-white/20 rounded-full shadow-[0_15px_60px_rgba(0,0,0,0.9)] transition-all duration-300 ${showControls ? 'translate-y-40 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                className="hover:scale-110 active:scale-90 transition-transform p-1 text-white"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-white" />}
              </button>

              <div className="w-px h-9 bg-white/20 mx-1" />

              <button 
                onClick={(e) => { e.stopPropagation(); toggleRecording(); }}
                className={`hover:scale-110 active:scale-90 transition-transform p-1 ${isRecording ? 'text-red-500' : 'text-white'}`}
                title={isRecording ? "Stop Recording" : "Start Recording"}
              >
                {isRecording ? <Square className="w-8 h-8 fill-red-500" /> : <Circle className="w-8 h-8" />}
              </button>

              <div className="w-px h-9 bg-white/20 mx-1" />
              
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest leading-none mb-1.5 drop-shadow-md">Delay</span>
                <span className="text-base font-mono text-white font-black leading-none drop-shadow-md">{config.delay}f</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Control Drawer */}
      {sourceType && (
        <ControlPanel 
          config={config} 
          setConfig={setConfig} 
          isOpen={showControls} 
          onClose={() => setShowControls(false)} 
        />
      )}

      {/* Landing Footer */}
      {!sourceType && (
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-10">
          <p className="text-zinc-700 text-[10px] uppercase tracking-[0.5em] font-black drop-shadow-sm">
            Temporal Engine v1.2
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
