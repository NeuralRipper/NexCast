"""
ElevenLabs Text-to-Speech Service
Using Eleven Turbo v2.5 for low latency
"""
from elevenlabs import ElevenLabs
from pathlib import Path
from dotenv import load_dotenv
import os

# Load environment variables
env_path = Path(__file__).parent.parent / "config" / ".env"
load_dotenv(env_path)


class TTSService:
    def __init__(self):
        """Initialize ElevenLabs client"""
        self._client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

    async def synthesize(
        self,
        text: str,
        voice_id: str = "qVpGLzi5EhjW3WGVhOa9",  # American urban voice
        voice_id_2: str | None = "gU0LNdkMOQCOrPrwtbee",  # British football announcer (optional)
        stability: float = 0.5,
        similarity_boost: float = 0.75
    ) -> bytes:
        """
        Generate speech audio with ElevenLabs (supports multi-speaker)

        Args:
            text: Text with audio tags, use " | " to split speakers
            voice_id: First speaker (American urban)
            voice_id_2: Second speaker (optional, None for single speaker)
            stability: 0-1 (lower = more emotion)
            similarity_boost: 0-1 (higher = closer to original voice)

        Returns:
            bytes: MP3 audio data (concatenated if multi-speaker)
        """
        # Check if multi-speaker (contains " | " and voice_id_2 is provided)
        if " | " in text and voice_id_2:
            parts = text.split(" | ", 1)
            speaker1_text = parts[0].strip()
            speaker2_text = parts[1].strip()

            # Synthesize speaker 1
            audio1 = self._client.text_to_speech.convert(
                text=speaker1_text,
                voice_id=voice_id,
                model_id="eleven_v3",
                output_format="mp3_44100_128"
            )
            audio1_bytes = b"".join(audio1)

            # Synthesize speaker 2
            audio2 = self._client.text_to_speech.convert(
                text=speaker2_text,
                voice_id=voice_id_2,
                model_id="eleven_v3",
                output_format="mp3_44100_128"
            )
            audio2_bytes = b"".join(audio2)

            # Concatenate audio (simple append - no mixing)
            return audio1_bytes + audio2_bytes
        else:
            # Single speaker
            audio = self._client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id="eleven_v3",
                output_format="mp3_44100_128"
            )
            return b"".join(audio)
