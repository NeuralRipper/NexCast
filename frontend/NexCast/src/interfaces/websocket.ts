/**
 * WebSocket-related TypeScript interfaces
 */

import type { SessionPreferences } from './session';

export interface WebSocketMessage {
  type: string;
  data?: any;
}

export interface AudioMessage extends WebSocketMessage {
  type: 'audio';
  data: string; // Base64 audio
}

export interface UseWebSocketAudioReturn {
  isConnected: boolean;
  error: string | null;
  connect: (sessionId: number, preferences: SessionPreferences) => void;
  disconnect: () => void;
  sendFrame: (frameBase64: string) => void;
}
