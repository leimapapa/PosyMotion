
export type VideoSourceType = 'camera' | 'file' | 'url';

export interface MotionConfig {
  delay: number; // in frames
  opacity: number; // 0 to 1
  invert: boolean;
  hueShift: number; // 0 to 360
  brightness: number; // 0 to 2
  contrast: number; // 0 to 2
  grayscale: boolean;
}

export interface FrameData {
  bitmap: ImageBitmap;
}
