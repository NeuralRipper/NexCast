/**
 * Session-related TypeScript interfaces
 */

export interface SessionPreferences {
  speaker1_voice_id?: string;
  speaker2_voice_id?: string;
  capture_interval?: number;
}

export interface Session {
  session_id: number;
  user_id: string;
  preferences: SessionPreferences;
  start_time: string;
  end_time?: string;
  frame_count?: number;
  status: 'active' | 'completed' | 'failed';
}

export interface StartSessionResponse {
  session_id: number;
  status: string;
  preferences: SessionPreferences;
}

export interface EndSessionResponse {
  message: string;
  session_id: number;
  duration_seconds: number;
  frame_count: number;
}
