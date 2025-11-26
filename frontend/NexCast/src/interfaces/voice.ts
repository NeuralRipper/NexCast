/**
 * Voice/ElevenLabs-related TypeScript interfaces
 */

export interface Voice {
  voice_id: string;
  name: string;
  description?: string;
  preview_url?: string;
  category?: string;
  labels?: Record<string, string>;
}

export interface VoiceLibraryResponse {
  voices: Voice[];
}
