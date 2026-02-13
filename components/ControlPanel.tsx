
import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { MotionConfig } from '../types';
import { DEFAULT_CONFIG, MAX_DELAY_FRAMES } from '../constants';

interface ControlPanelProps {
  config: MotionConfig;
  setConfig: React.Dispatch<React.SetStateAction<MotionConfig>>;
  isOpen: boolean;
  onClose: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig, isOpen, onClose }) => {
  if (!isOpen) return null;

  const updateConfig = (key: keyof MotionConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const reset = () => setConfig(DEFAULT_CONFIG);

  return (
    <div className="absolute inset-x-0 bottom-0 z-[100] lg:left-auto lg:top-0 lg:right-0 lg:w-96 lg:h-full pointer-events-none">
      <div className="w-full h-[75vh] lg:h-full bg-zinc-900/98 backdrop-blur-3xl border-t lg:border-t-0 lg:border-l border-white/10 rounded-t-[2.5rem] lg:rounded-none shadow-[0_-20px_50px_rgba(0,0,0,0.5)] p-6 md:p-8 overflow-y-auto pointer-events-auto animate-in slide-in-from-bottom duration-300">
        {/* Mobile Drag Handle Visual */}
        <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-6 lg:hidden" onClick={onClose} />
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            Engine Config
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={reset}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all active:scale-90"
              title="Reset Settings"
            >
              <RotateCcw className="w-5 h-5 text-zinc-400" />
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all active:scale-90"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        <div className="space-y-8 pb-10 lg:pb-0">
          {/* Time Delay */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Frame Delay</label>
              <span className="text-sm font-mono text-blue-400 font-bold">{config.delay}f</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={MAX_DELAY_FRAMES} 
              step="1" 
              value={config.delay}
              onChange={(e) => updateConfig('delay', parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg cursor-pointer appearance-none accent-blue-500"
            />
            <p className="mt-3 text-[10px] text-zinc-500 leading-relaxed font-medium">Temporal distance between layers. Lower = high speed, Higher = trailing trails.</p>
          </section>

          {/* Opacity */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Mix Weight</label>
              <span className="text-sm font-mono text-blue-400 font-bold">{Math.round(config.opacity * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={config.opacity}
              onChange={(e) => updateConfig('opacity', parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg cursor-pointer appearance-none accent-blue-500"
            />
          </section>

          {/* Color Shift */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Hue Rotation</label>
              <span className="text-sm font-mono text-blue-400 font-bold">{config.hueShift}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="360" 
              step="1" 
              value={config.hueShift}
              onChange={(e) => updateConfig('hueShift', parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg cursor-pointer appearance-none accent-blue-500"
            />
          </section>

          {/* Toggle Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => updateConfig('invert', !config.invert)}
              className={`p-4 rounded-2xl border text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 ${config.invert ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' : 'bg-zinc-800 border-white/5 text-zinc-500 hover:text-zinc-300'}`}
            >
              Invert Delta
            </button>
            <button 
              onClick={() => updateConfig('grayscale', !config.grayscale)}
              className={`p-4 rounded-2xl border text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 ${config.grayscale ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' : 'bg-zinc-800 border-white/5 text-zinc-500 hover:text-zinc-300'}`}
            >
              Mono Chrome
            </button>
          </div>

          {/* Advanced Sliders */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div>
               <div className="flex justify-between mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Brightness</label>
                <span className="text-[10px] font-mono text-zinc-400">{config.brightness.toFixed(1)}x</span>
              </div>
              <input 
                type="range" min="0" max="3" step="0.1" value={config.brightness}
                onChange={(e) => updateConfig('brightness', parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-zinc-500"
              />
            </div>
            <div>
               <div className="flex justify-between mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Contrast</label>
                <span className="text-[10px] font-mono text-zinc-400">{config.contrast.toFixed(1)}x</span>
              </div>
              <input 
                type="range" min="0" max="3" step="0.1" value={config.contrast}
                onChange={(e) => updateConfig('contrast', parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-zinc-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
