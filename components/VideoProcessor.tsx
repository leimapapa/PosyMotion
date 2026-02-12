
import React, { useRef, useEffect, useState } from 'react';
import { VideoSourceType, MotionConfig } from '../types';
import { MAX_DELAY_FRAMES } from '../constants';

interface VideoProcessorProps {
  sourceType: VideoSourceType;
  sourceUrl: string | null;
  config: MotionConfig;
  isPlaying: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoProcessor: React.FC<VideoProcessorProps> = ({ 
  sourceType, 
  sourceUrl, 
  config, 
  isPlaying,
  videoRef 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Buffer to store past frames
  const frameBuffer = useRef<ImageBitmap[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setupSource = async () => {
      try {
        if (sourceType === 'camera') {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }, 
            audio: false 
          });
          video.srcObject = stream;
        } else if (sourceUrl) {
          video.srcObject = null;
          video.src = sourceUrl;
          video.crossOrigin = 'anonymous'; // Critical for CORS
        }
        video.play().catch(e => console.warn("Autoplay blocked", e));
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
  }, [sourceType, sourceUrl, videoRef]);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isPlaying, videoRef]);

  const processFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended) {
      requestRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Adjust canvas size to match video aspect ratio while fitting screen
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    try {
      // Capture current frame as ImageBitmap (efficient)
      const currentFrame = await createImageBitmap(video);
      
      // Manage buffer
      frameBuffer.current.push(currentFrame);
      if (frameBuffer.current.length > MAX_DELAY_FRAMES + 1) {
        const removed = frameBuffer.current.shift();
        removed?.close(); // Free memory
      }

      // 1. Draw the current frame as the base
      ctx.globalAlpha = 1.0;
      ctx.filter = 'none';
      ctx.drawImage(currentFrame, 0, 0);

      // 2. Determine delayed frame
      const delayIndex = frameBuffer.current.length - 1 - config.delay;
      const delayedFrame = frameBuffer.current[delayIndex > 0 ? delayIndex : 0];

      if (delayedFrame) {
        // 3. Apply Posy's Technique: Overlay Inverted Delayed Frame at 50% Opacity
        ctx.globalAlpha = config.opacity;
        
        // Construct filter string
        let filterStr = '';
        if (config.invert) filterStr += 'invert(1) ';
        if (config.hueShift > 0) filterStr += `hue-rotate(${config.hueShift}deg) `;
        if (config.brightness !== 1) filterStr += `brightness(${config.brightness}) `;
        if (config.contrast !== 1) filterStr += `contrast(${config.contrast}) `;
        if (config.grayscale) filterStr += 'grayscale(1) ';
        
        ctx.filter = filterStr || 'none';
        ctx.drawImage(delayedFrame, 0, 0);
      }
    } catch (e) {
      // Ignore frame grab errors on first load
    }

    requestRef.current = requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(processFrame);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      // Clean up bitmaps
      frameBuffer.current.forEach(b => b.close());
      frameBuffer.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-xl border border-red-500/20 max-w-md mx-auto">
        <h3 className="text-lg font-bold mb-2">Error</h3>
        <p className="text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-bold"
        >
          Try Again
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
      <canvas 
        ref={canvasRef} 
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl bg-black"
      />
    </div>
  );
};

export default VideoProcessor;
