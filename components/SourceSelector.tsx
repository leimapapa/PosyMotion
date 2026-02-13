
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
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight uppercase">Optical Flow</h2>
        <p className="text-zinc-400 text-sm md:text-base font-bold max-w-md mx-auto uppercase tracking-widest">Select input source to begin temporal analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Camera Option */}
        <button 
          onClick={() => onSelect('camera')}
          className="group p-6 md:p-8 bg-zinc-900 border border-white/10 rounded-[2.5rem] hover:border-blue-500/50 hover:bg-zinc-800 transition-all flex flex-col items-center gap-5 shadow-2xl active:scale-95"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
            <Camera className="w-8 h-8 md:w-10 md:h-10 text-blue-500 group-hover:text-white" />
          </div>
          <div className="text-center">
            <span className="block text-white font-black text-lg md:text-xl uppercase tracking-tight">Camera</span>
            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1 block">Live Feed</span>
          </div>
        </button>

        {/* Local File Option */}
        <label className="group p-6 md:p-8 bg-zinc-900 border border-white/10 rounded-[2.5rem] hover:border-emerald-500/50 hover:bg-zinc-800 transition-all flex flex-col items-center gap-5 cursor-pointer shadow-2xl active:scale-95">
          <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
          <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-600/20 rounded-3xl flex items-center justify-center group-hover:bg-emerald-600 transition-all duration-300">
            <Upload className="w-8 h-8 md:w-10 md:h-10 text-emerald-500 group-hover:text-white" />
          </div>
          <div className="text-center">
            <span className="block text-white font-black text-lg md:text-xl uppercase tracking-tight">File</span>
            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1 block">Upload Clip</span>
          </div>
        </label>

        {/* Video Link Option */}
        <button 
          onClick={() => setShowUrlInput(!showUrlInput)}
          className={`group p-6 md:p-8 bg-zinc-900 border rounded-[2.5rem] transition-all active:scale-95 flex flex-col items-center gap-5 shadow-2xl ${showUrlInput ? 'border-amber-500 bg-zinc-800' : 'border-white/10 hover:border-amber-500/50 hover:bg-zinc-800'}`}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-600/20 rounded-3xl flex items-center justify-center group-hover:bg-amber-600 transition-all duration-300">
            <Globe className="w-8 h-8 md:w-10 md:h-10 text-amber-500 group-hover:text-white" />
          </div>
          <div className="text-center">
            <span className="block text-white font-black text-lg md:text-xl uppercase tracking-tight">Web Link</span>
            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1 block">Video URL</span>
          </div>
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="mt-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative group max-w-lg mx-auto w-full">
            <input 
              type="url" 
              placeholder="https://example.com/video.mp4" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-zinc-900 border-2 border-white/10 rounded-[2rem] px-6 py-5 text-white focus:outline-none focus:border-amber-500 transition-all pr-16 text-sm font-bold"
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3.5 bg-amber-600 hover:bg-amber-500 rounded-[1.25rem] text-white transition-all shadow-lg active:scale-90"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </form>
      )}

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-3 mt-4 opacity-40">
        {['Temporal Shifting', 'Delta Inversion', 'Motion Ghosting'].map(tag => (
          <span key={tag} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] font-black text-white uppercase tracking-widest">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SourceSelector;
