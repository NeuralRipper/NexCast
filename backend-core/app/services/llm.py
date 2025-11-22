"""
Grok LLM Service
Generate humorous commentary from vision descriptions
"""
from xai_sdk import Client
from xai_sdk.chat import system, user
import os


class LlmService:
    def __init__(self):
        """Initialize Grok client (stateless)"""
        self._client = Client(api_key=os.getenv("XAI_API_KEY"), timeout=3600)
        self._model = "grok-4-fast"
        self._system_prompt = (
            "You are TWO sports commentators (American hype caster + British analyst) providing real-time commentary.\n\n"
            "FORMAT: '[tag] commentary text | [tag] commentary text'\n"
            "- First speaker (American): Play-by-play with high energy and excitement\n"
            "- Second speaker (British): Tactical analysis with dry wit and humor\n"
            "- TARGET: 15-20 words per speaker (30-40 words total)\n\n"
            "AUDIO TAGS (use them!):\n"
            "[excited], [intense], [dramatic], [analytical], [humorous], [laughs], [gasps]\n\n"
            "EXAMPLES:\n"
            "'[excited] Reinhardt just charged in and absolutely OBLITERATED their entire backline with that hammer! Devastating play! | [analytical] Notice how he baited out the sleep dart first—smart positioning to avoid the stun before committing.'\n"
            "'[intense] They're getting shredded! Three down in five seconds and the fight just started! | [humorous] Their Mercy is panic-flying around like a headless chicken trying to rez everyone! [laughs]'\n"
            "'[dramatic] Overtime! The point is contested and one team wipe ends this entire match right now! | [excited] The pressure is absolutely INSANE—every single second counts!'\n\n"
            "REQUIREMENTS:\n"
            "- Speaker 1: Describe the ACTION happening with HYPE and ENERGY\n"
            "- Speaker 2: Provide INSIGHT, ANALYSIS, or HUMOR about the play\n"
            "- Keep it fast-paced but give full thoughts—aim for 15-20 words each"
        )

    async def generate_comment(self, description: str, dual_speaker: bool = True) -> str:
        """
        Generate commentary from vision description

        Args:
            description: Text description of current frame
            dual_speaker: True for dual commentary, False for single speaker

        Returns:
            str: Commentary text for TTS
        """
        # Use different prompt for single vs dual speaker
        if not dual_speaker:
            single_prompt = (
                "You are a high-energy sports commentator providing FAST real-time commentary.\n\n"
                "FORMAT: '[tag] commentary text'\n"
                "LENGTH: 15-20 words max\n"
                "STYLE: Play-by-play with hype and excitement\n\n"
                "AUDIO TAGS: [excited], [intense], [dramatic], [laughs], [gasps]\n\n"
                "EXAMPLE: '[excited] Reinhardt just charged in and absolutely DEMOLISHED their entire backline!'\n\n"
                "Keep it FAST and PUNCHY for quick action commentary."
            )
            chat = self._client.chat.create(model=self._model)
            chat.append(system(single_prompt))
            chat.append(user(f"Describe what's happening: {description}"))
        else:
            chat = self._client.chat.create(model=self._model)
            chat.append(system(self._system_prompt))
            chat.append(user(f"Describe what's happening: {description}"))

        response = chat.sample()
        return response.content.strip()
