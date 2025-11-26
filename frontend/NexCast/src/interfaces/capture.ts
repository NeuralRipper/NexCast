/**
 * Screen capture-related TypeScript interfaces
 */

export interface ScreenCaptureState {
  isCapturing: boolean;
  frameCount: number;
  currentFrame: string | null; // Base64 image data
  error: string | null;
}

export interface UseScreenCaptureReturn extends ScreenCaptureState {
  startCapture: () => Promise<void>;
  stopCapture: () => void;
}
