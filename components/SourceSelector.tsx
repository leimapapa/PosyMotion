
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
    <div className="max-w-xl w-full px-6 flex flex-col gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tighter">Choose Your Feed</h2>
        <p className="text-zinc-400 text-lg">Select a source to start visualizing the optic delta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Camera Option */}
        <button 
          onClick={() => onSelect('camera')}
          className="group p-6 bg-zinc-900 border border-white/5 rounded-3xl hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all flex flex-col items-center gap-4"
        >
          <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
            <Camera className="w-7 h-7 text-blue-500 group-hover:text-white" />
          </div>
          <div className="text-center">
            <span className="block text-white font-bold text-lg">Live Camera</span>
            <span className="text-xs text-zinc-500">Real-time detection</span>
          </div>
        </button>

        {/* Local File Option */}
        <label className="group p-6 bg-zinc-900 border border-white/5 rounded-3xl hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all flex flex-col items-center gap-4 cursor-pointer">
          <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
          <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:scale-110 transition-all duration-300">
            <Upload className="w-7 h-7 text-emerald-500 group-hover:text-white" />
          </div>
          <div className="text-center">
            <span className="block text-white font-bold text-lg">Local Upload</span>
            <span className="text-xs text-zinc-500">Browse your device</span>
          </div>
        </label>

        {/* URL Option */}
        <button 
          onClick={() => setShowUrlInput(!showUrlInput)}
          className={`group p-6 bg-zinc-900 border rounded-3xl transition-all flex flex-col items-center gap-4 ${showUrlInput ? 'border-amber-500/50 bg-zinc-800/80' : 'border-white/5 hover:border-amber-500/50 hover:bg-zinc-800/80'}`}
        >
          <div className="w-14 h-14 bg-amber-600/10 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:scale-110 transition-all duration-300">
            <Globe className="w-7 h-7 text-amber-500 group-hover:text-white" />
          </div>
          <div className="text-center">
            <span className="block text-white font-bold text-lg">Network URL</span>
            <span className="text-xs text-zinc-500">Stream from web</span>
          </div>
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="relative group">
            <input 
              type="url" 
              placeholder="https://example.com/video.mp4" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-amber-500/50 transition-all pr-16"
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-white transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-3 text-[10px] text-zinc-500 text-center uppercase tracking-widest">
            Note: Videos must support CORS or be from a public source
          </p>
        </form>
      )}

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {['50% Opacity Delta', 'Inverted Layers', 'Adjustable Frame Delay', 'Hardware Accelerated'].map(tag => (
          <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-zinc-500 uppercase">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SourceSelector;
