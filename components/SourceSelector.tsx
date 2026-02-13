
import React, { useState } from 'react';
import { Camera, Upload, Globe, ArrowRight } from 'lucide-react';
import { VideoSourceType } from '../types';

interface SourceSelectorProps {
  onSelect: (type: VideoSourceType, payload?: string | File) => void;
}

const SourceSelector: React.FC<SourceSelectorProps> = ({ onSelect }) => {
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelect('file', file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) onSelect('url', urlInput.trim());
  };

  return (
    <div className="max-w-2xl w-full px-6 py-12 flex flex-col gap-8 md:gap-12 overflow-y-auto max-h-full">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight uppercase">Optical Flow</h2>
        <p className="text-zinc-500 text-base md:text-xl font-medium max-w-md mx-auto">Select a source to begin visualizing the temporal delta delta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Camera Option */}
        <button 
          onClick={() => onSelect('camera')}
          className="group p-6 md:p-8 bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-[2.5rem] hover:border-blue-500/50 hover:bg-zinc-800/80 active:scale-95 transition-all flex flex-col items-center gap-5 shadow-2xl"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500 shadow-inner shadow-blue-500/30">
            <Camera className="w-8 h-8 md:w-10 md:h-10 text-blue-500 group-hover:text-white" />
          </div>
          <div className="text-center">
            <span className="block text-white font-black text-lg md:text-xl tracking-tight uppercase">Live Camera</span>
            <span className="text-[10px] md:text-xs text-zinc-300 font-bold uppercase tracking-widest mt-1 block">Real-time Feed</span>
          </div>
        </button>

        {/* Local File Option */}
        <label className="group p-6 md:p-8 bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-[2.5rem] hover:border-emerald-500/50 hover:bg-zinc-800/80 active:scale-95 transition-all flex flex-col items-center gap-5 cursor-pointer shadow-2xl">
          <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
          <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-600/20 rounded-3xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:scale-110 transition-all duration-500 shadow-inner shadow-emerald-500/30">
            <Upload className="w-8 h-8 md:w-10 md:h-10 text-emerald-500 group-hover:text-white" />
          </div>
          <div className="text-center">
            <span className="block text-white font-black text-lg md:text-xl tracking-tight uppercase">Local Clip</span>
            <span className="text-[10px] md:text-xs text-zinc-300 font-bold uppercase tracking-widest mt-1 block">Upload File</span>
          </div>
        </label>

        {/* Video Link Option */}
        <button 
          onClick={() => setShowUrlInput(!showUrlInput)}
          className={`group p-6 md:p-8 bg-zinc-900/60 backdrop-blur-md border rounded-[2.5rem] transition-all active:scale-95 flex flex-col items-center gap-5 shadow-2xl ${showUrlInput ? 'border-amber-500/50 bg-zinc-800/80' : 'border-white/10 hover:border-amber-500/50 hover:bg-zinc-800/80'}`}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-600/20 rounded-3xl flex items-center justify-center group-hover:bg-amber-600 group-hover:scale-110 transition-all duration-500 shadow-inner shadow-amber-500/30">
            <Globe className="w-8 h-8 md:w-10 md:h-10 text-amber-500 group-hover:text-white" />
          </div>
          <div className="text-center">
            <span className="block text-white font-black text-lg md:text-xl tracking-tight uppercase">Video Link</span>
            <span className="text-[10px] md:text-xs text-zinc-300 font-bold uppercase tracking-widest mt-1 block">Video URL</span>
          </div>
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="mt-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative group max-w-lg mx-auto w-full">
            <input 
              type="url" 
              placeholder="https://example.com/motion.mp4" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-zinc-900/90 backdrop-blur-md border-2 border-white/10 rounded-[2rem] px-6 py-5 text-white focus:outline-none focus:border-amber-500 transition-all pr-16 text-sm font-bold placeholder:text-zinc-600"
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3.5 bg-amber-600 hover:bg-amber-500 rounded-[1.25rem] text-white transition-all shadow-lg active:scale-90"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-4 text-[9px] md:text-[10px] text-zinc-500 text-center uppercase tracking-[0.2em] font-black">
            Direct MP4/WebM links work best (CORS enabled)
          </p>
        </form>
      )}

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {['Temporal Shifting', 'Delta Inversion', 'Motion Ghosting', 'Real-time Processing'].map(tag => (
          <span key={tag} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest shadow-sm">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SourceSelector;
