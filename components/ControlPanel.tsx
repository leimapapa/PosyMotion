
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
    <div className="absolute inset-0 z-[100] flex flex-col justify-end lg:justify-start lg:left-auto lg:top-0 lg:right-0 lg:w-96 lg:h-full pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md lg:hidden pointer-events-auto" 
        onClick={onClose}
      />
      <div className="relative w-full h-[85vh] lg:h-full bg-zinc-900 border-t lg:border-t-0 lg:border-l border-white/20 rounded-t-[3rem] lg:rounded-none shadow-[0_-20px_80px_rgba(0,0,0,0.9)] p-6 md:p-8 overflow-y-auto pointer-events-auto animate-in slide-in-from-bottom duration-300">
        {/* Mobile Drag Handle */}
        <div className="w-16 h-1.5 bg-zinc-700 rounded-full mx-auto mb-8 lg:hidden" onClick={onClose} />
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            ENGINE <span className="text-blue-500">CONFIG</span>
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={reset}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-90"
              title="Reset Settings"
            >
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={onClose}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-90"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="space-y-10 pb-16 lg:pb-0">
          {/* Time Delay */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="text-xs font-black uppercase tracking-widest text-white drop-shadow-sm">Frame Delay</label>
              <span className="text-base font-mono text-blue-400 font-black">{config.delay}f</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={MAX_DELAY_FRAMES} 
              step="1" 
              value={config.delay}
              onChange={(e) => updateConfig('delay', parseInt(e.target.value))}
              className="w-full h-3 bg-zinc-800 rounded-lg cursor-pointer appearance-none accent-blue-500"
            />
            <p className="mt-3 text-[11px] text-zinc-100 leading-relaxed font-bold uppercase tracking-tight">Shift temporal distance between current and ghost layers.</p>
          </section>

          {/* Opacity */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="text-xs font-black uppercase tracking-widest text-white drop-shadow-sm">Mix Weight</label>
              <span className="text-base font-mono text-blue-400 font-black">{Math.round(config.opacity * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={config.opacity}
              onChange={(e) => updateConfig('opacity', parseFloat(e.target.value))}
              className="w-full h-3 bg-zinc-800 rounded-lg cursor-pointer appearance-none accent-blue-500"
            />
          </section>

          {/* Color Shift */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="text-xs font-black uppercase tracking-widest text-white drop-shadow-sm">Hue Rotation</label>
              <span className="text-base font-mono text-blue-400 font-black">{config.hueShift}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="360" 
              step="1" 
              value={config.hueShift}
              onChange={(e) => updateConfig('hueShift', parseInt(e.target.value))}
              className="w-full h-3 bg-zinc-800 rounded-lg cursor-pointer appearance-none accent-blue-500"
            />
          </section>

          {/* Toggle Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => updateConfig('invert', !config.invert)}
              className={`p-6 rounded-2xl border-2 text-[12px] font-black uppercase tracking-widest transition-all active:scale-95 ${config.invert ? 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-900/50' : 'bg-zinc-800 border-white/10 text-white hover:text-white'}`}
            >
              Invert Delta
            </button>
            <button 
              onClick={() => updateConfig('grayscale', !config.grayscale)}
              className={`p-6 rounded-2xl border-2 text-[12px] font-black uppercase tracking-widest transition-all active:scale-95 ${config.grayscale ? 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-900/50' : 'bg-zinc-800 border-white/10 text-white hover:text-white'}`}
            >
              Mono Chrome
            </button>
          </div>

          {/* Advanced Sliders */}
          <div className="space-y-8 pt-8 border-t border-white/10">
            <div>
               <div className="flex justify-between mb-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-white">Brightness</label>
                <span className="text-[11px] font-mono text-zinc-100 font-bold">{config.brightness.toFixed(1)}x</span>
              </div>
              <input 
                type="range" min="0" max="3" step="0.1" value={config.brightness}
                onChange={(e) => updateConfig('brightness', parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-full appearance-none accent-blue-400"
              />
            </div>
            <div>
               <div className="flex justify-between mb-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-white">Contrast</label>
                <span className="text-[11px] font-mono text-zinc-100 font-bold">{config.contrast.toFixed(1)}x</span>
              </div>
              <input 
                type="range" min="0" max="3" step="0.1" value={config.contrast}
                onChange={(e) => updateConfig('contrast', parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-full appearance-none accent-blue-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
