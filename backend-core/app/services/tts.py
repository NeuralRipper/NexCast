"""
Google Cloud Text-to-Speech Service
Gemini 2.5 Flash TTS - Multi-speaker, low latency
"""
from google.cloud import texttospeech
import os


class TTSService:
    def __init__(self):
        """Initialize Google Cloud TTS client"""
        self._client = texttospeech.TextToSpeechClient()

    async def synthesize(
        self,
        text: str,
        speaking_rate: float = 1.0,
        pitch: float = 0.0,
        volume: int = 100
    ) -> bytes:
        """
        Generate speech audio (multi-speaker supported)

        Args:
            text: Multi-speaker format "[Mike] Text [Sarah] Text"
            speaking_rate: 0.5 - 2.0
            pitch: -20 to 20
            volume: 0-100

        Returns:
            bytes: MP3 audio data (no file I/O)
        """
        # Map volume 0-100 to dB -8 to +8
        volume_db = (volume / 100.0 * 16) - 8

        response = self._client.synthesize_speech(
            input=texttospeech.SynthesisInput(text=text),
            voice=texttospeech.VoiceSelectionParams(
                language_code="en-US",
                name="en-US-Neural2-A"
            ),
            audio_config=texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=speaking_rate,
                pitch=pitch,
                volume_gain_db=volume_db
            )
        )

        return response.audio_content  # bytes - ready for streaming
