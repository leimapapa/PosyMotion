
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, Link, Settings, RefreshCw, Play, Pause, Maximize, Circle, Square } from 'lucide-react';
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
  };

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
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
              isRecording={isRecording}
              videoRef={videoRef}
              onRecordingStopped={() => setIsRecording(false)}
            />
            
            {/* Overlay Play/Pause toggle on click */}
            <div 
              className="absolute inset-0 z-10 cursor-pointer" 
              onClick={() => setIsPlaying(!isPlaying)}
            />

            {/* Floating Quick Action */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-6 py-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
              {isRecording && (
                <div className="flex items-center gap-2 px-2 animate-pulse mr-2">
                   <div className="w-2 h-2 rounded-full bg-red-500" />
                   <span className="text-xs font-mono text-red-500 font-bold">{formatTime(recordingSeconds)}</span>
                </div>
              )}
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:scale-110 transition-transform p-1"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="text-white w-6 h-6" /> : <Play className="text-white w-6 h-6 fill-white" />}
              </button>

              <div className="w-px h-6 bg-white/20" />

              <button 
                onClick={toggleRecording}
                className={`hover:scale-110 transition-transform p-1 ${isRecording ? 'text-red-500' : 'text-white/60 hover:text-white'}`}
                title={isRecording ? "Stop Recording" : "Start Recording"}
              >
                {isRecording ? <Square className="w-6 h-6 fill-red-500" /> : <Circle className="w-6 h-6" />}
              </button>

              <div className="w-px h-6 bg-white/20" />
              
              <div className="flex flex-col min-w-[60px]">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Delay</span>
                <span className="text-sm font-mono text-blue-400">{config.delay}f</span>
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
        <footer className="p-4 text-center text-zinc-500 text-xs tracking-wide">
          Inspired by Posy's Optic Delta exploration. Use time-delay to reveal motion.
        </footer>
      )}
    </div>
  );
};

export default App;
