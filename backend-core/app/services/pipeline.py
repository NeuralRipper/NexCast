"""
Commentary Pipeline: Frame -> Vision -> LLM -> TTS -> Audio
Singleton services for efficient resource usage
"""
from .vision import VisionService
from .llm import LlmService
from .tts import TTSService
import base64

# Singleton instances (lazy-loaded on first use)
_vision_service = None
_llm_service = None
_tts_service = None


def get_vision_service() -> VisionService:
    """Get or create Vision service singleton"""
    global _vision_service
    if _vision_service is None:
        _vision_service = VisionService()
    return _vision_service


def get_llm_service() -> LlmService:
    """Get or create LLM service singleton"""
    global _llm_service
    if _llm_service is None:
        _llm_service = LlmService()
    return _llm_service


def get_tts_service() -> TTSService:
    """Get or create TTS service singleton"""
    global _tts_service
    if _tts_service is None:
        _tts_service = TTSService()
    return _tts_service


async def process_frame(
    session_id: str,
    frame_base64: str,
    preferences: dict
) -> str:
    """
    Process frame through full pipeline

    Args:
        session_id: Session identifier for context tracking
        frame_base64: Base64-encoded JPEG frame
        preferences: User preferences (voice, commentary_style)

    Returns:
        str: Base64-encoded MP3 audio
    """
    # 1. Vision: Frame + Context -> Description
    vision = get_vision_service()
    description = await vision.analyze_with_context(frame_base64, session_id)
    print(f"[{session_id}] Vision: {description}")

    # 2. LLM: Description -> Commentary
    llm = get_llm_service()
    speaker2 = preferences.get("speaker2_voice_id")
    dual_speaker = bool(speaker2)  # True if speaker2 is set
    comment = await llm.generate_comment(description, dual_speaker=dual_speaker)
    print(f"[{session_id}] Comment: {comment}")

    # 3. TTS: Commentary -> Audio (ElevenLabs multi-speaker)
    tts = get_tts_service()
    speaker1 = preferences.get("speaker1_voice_id", "qVpGLzi5EhjW3WGVhOa9")

    audio_bytes = await tts.synthesize(
        text=comment,
        voice_id=speaker1,
        voice_id_2=speaker2 if dual_speaker else None
    )

    # Convert to base64 for WebSocket transmission
    audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
    print(f"[{session_id}] Audio generated: {len(audio_bytes)} bytes")

    return audio_base64
