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
        preferences: User preferences (speaking_rate, pitch, volume)

    Returns:
        str: Base64-encoded MP3 audio
    """
    # 1. Vision: Frame + Context -> Description
    vision = get_vision_service()
    description = await vision.analyze_with_context(frame_base64, session_id)
    print(f"[{session_id}] Vision: {description}")

    # 2. LLM: Description -> Commentary
    llm = get_llm_service()
    comment = await llm.generate_comment(description)
    print(f"[{session_id}] Comment: {comment}")

    # 3. TTS: Commentary -> Audio
    tts = get_tts_service()
    audio_bytes = await tts.synthesize(
        text=comment,
        speaking_rate=preferences.get("speaking_rate", 1.0),
        pitch=preferences.get("pitch", 0.0),
        volume=preferences.get("volume", 100)
    )

    # Convert to base64 for WebSocket transmission
    audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
    print(f"[{session_id}] Audio generated: {len(audio_bytes)} bytes")

    return audio_base64
