
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
    <div className="absolute inset-x-0 bottom-0 z-[100] p-4 lg:left-auto lg:top-0 lg:right-0 lg:w-96 lg:h-full pointer-events-none">
      <div className="w-full h-full bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-t-3xl lg:rounded-none lg:rounded-l-3xl shadow-2xl p-6 overflow-y-auto pointer-events-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Processing Engine
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={reset}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Reset Settings"
            >
              <RotateCcw className="w-5 h-5 text-zinc-400" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Time Delay */}
          <section>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-zinc-300">Frame Delay</label>
              <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{config.delay} frames</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={MAX_DELAY_FRAMES} 
              step="1" 
              value={config.delay}
              onChange={(e) => updateConfig('delay', parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
            />
            <p className="mt-2 text-[10px] text-zinc-500 italic">Temporal distance between layers. Lower = fast motion, Higher = slow motion.</p>
          </section>

          {/* Opacity */}
          <section>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-zinc-300">Delta Mix (Opacity)</label>
              <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{Math.round(config.opacity * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={config.opacity}
              onChange={(e) => updateConfig('opacity', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
            />
          </section>

          {/* Color Shift */}
          <section>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-zinc-300">Color/Hue Shift</label>
              <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{config.hueShift}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="360" 
              step="1" 
              value={config.hueShift}
              onChange={(e) => updateConfig('hueShift', parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer appearance-none"
            />
          </section>

          {/* Filters Toggle Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => updateConfig('invert', !config.invert)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${config.invert ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-white/5 text-zinc-400'}`}
            >
              Invert Overlay
            </button>
            <button 
              onClick={() => updateConfig('grayscale', !config.grayscale)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${config.grayscale ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-white/5 text-zinc-400'}`}
            >
              Black & White
            </button>
          </div>

          {/* Advanced Sliders */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div>
               <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-zinc-500">Brightness</label>
                <span className="text-xs text-zinc-400">{config.brightness.toFixed(1)}x</span>
              </div>
              <input 
                type="range" min="0" max="3" step="0.1" value={config.brightness}
                onChange={(e) => updateConfig('brightness', parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800"
              />
            </div>
            <div>
               <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-zinc-500">Contrast</label>
                <span className="text-xs text-zinc-400">{config.contrast.toFixed(1)}x</span>
              </div>
              <input 
                type="range" min="0" max="3" step="0.1" value={config.contrast}
                onChange={(e) => updateConfig('contrast', parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
