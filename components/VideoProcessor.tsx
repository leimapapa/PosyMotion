
import React, { useRef, useEffect, useState } from 'react';
import { VideoSourceType, MotionConfig } from '../types';
import { MAX_DELAY_FRAMES } from '../constants';

interface VideoProcessorProps {
  sourceType: VideoSourceType;
  sourceUrl: string | null;
  cameraFacingMode: 'user' | 'environment';
  config: MotionConfig;
  isPlaying: boolean;
  isRecording: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  onRecordingStopped: () => void;
}

const VideoProcessor: React.FC<VideoProcessorProps> = ({ 
  sourceType, 
  sourceUrl, 
  cameraFacingMode,
  config, 
  isPlaying,
  isRecording,
  videoRef,
  onRecordingStopped
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  const frameBuffer = useRef<ImageBitmap[]>([]);
  const requestRef = useRef<number | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setupSource = async () => {
      try {
        if (sourceType === 'camera') {
          if (video.srcObject) {
            (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
          }

          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: cameraFacingMode,
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }, 
            audio: false 
          });
          video.srcObject = stream;
        } else if (sourceUrl) {
          video.srcObject = null;
          video.src = sourceUrl;
          video.crossOrigin = 'anonymous'; 
        }
        video.play().catch(e => console.warn("Autoplay blocked or waiting for data", e));
      } catch (err: any) {
        setError(err.message || 'Failed to access video source');
      }
    };

    setupSource();

    return () => {
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [sourceType, sourceUrl, cameraFacingMode, videoRef]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    recordedChunks.current = [];
    // Higher frame rate for smoother recording if possible
    const stream = canvas.captureStream(30); 
    
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
      ? 'video/webm;codecs=vp9' 
      : 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType });
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `posy-motion-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      onRecordingStopped();
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play().catch(() => {});
    } else {
      videoRef.current?.pause();
    }
  }, [isPlaying, videoRef]);

  const processFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended || video.readyState < 2) {
      requestRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Use videoWidth and videoHeight as the source of truth for resolution
    const vW = video.videoWidth;
    const vH = video.videoHeight;

    if (canvas.width !== vW || canvas.height !== vH) {
      canvas.width = vW;
      canvas.height = vH;
    }

    try {
      const currentFrame = await createImageBitmap(video);
      
      frameBuffer.current.push(currentFrame);
      if (frameBuffer.current.length > MAX_DELAY_FRAMES + 1) {
        const removed = frameBuffer.current.shift();
        removed?.close();
      }

      // Draw current frame as base
      ctx.globalAlpha = 1.0;
      ctx.filter = 'none';
      ctx.drawImage(currentFrame, 0, 0);

      const delayIndex = frameBuffer.current.length - 1 - config.delay;
      const delayedFrame = frameBuffer.current[delayIndex >= 0 ? delayIndex : 0];

      if (delayedFrame) {
        ctx.globalAlpha = config.opacity;
        
        let filterStr = '';
        if (config.invert) filterStr += 'invert(1) ';
        if (config.hueShift > 0) filterStr += `hue-rotate(${config.hueShift}deg) `;
        if (config.brightness !== 1) filterStr += `brightness(${config.brightness}) `;
        if (config.contrast !== 1) filterStr += `contrast(${config.contrast}) `;
        if (config.grayscale) filterStr += 'grayscale(1) ';
        
        ctx.filter = filterStr.trim() || 'none';
        ctx.drawImage(delayedFrame, 0, 0);
      }
    } catch (e) {
      // transient errors
    }

    requestRef.current = requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(processFrame);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      frameBuffer.current.forEach(b => b.close());
      frameBuffer.current = [];
    };
  }, [config]);

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-3xl border border-red-500/20 max-w-md mx-auto">
        <h3 className="text-lg font-black uppercase tracking-tighter mb-2">Engine Halt</h3>
        <p className="text-sm font-bold text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-8 py-3 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
        >
          Reboot System
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <video 
        ref={videoRef} 
        className="hidden" 
        playsInline 
        muted 
        loop 
      />
      {/* Explicitly control canvas size to prevent stretching in flex layouts */}
      <canvas 
        ref={canvasRef} 
        className="block max-w-full max-h-full w-auto h-auto shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-black rounded-sm"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};

export default VideoProcessor;
