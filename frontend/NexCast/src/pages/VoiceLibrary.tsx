import { useState } from 'react';

interface VoiceOption {
  id: string;
  name: string;
  description: string;
  category: string;
  accent: string;
}

const DEFAULT_VOICES: VoiceOption[] = [
  {
    id: 'qVpGLzi5EhjW3WGVhOa9',
    name: 'American Urban',
    description: 'High-energy play-by-play commentator with dynamic delivery',
    category: 'Hype Caster',
    accent: 'American',
  },
  {
    id: 'gU0LNdkMOQCOrPrwtbee',
    name: 'British Football Announcer',
    description: 'Tactical analyst with dry wit and analytical insight',
    category: 'Analyst',
    accent: 'British',
  },
];

export const VoiceLibrary = () => {
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (voiceId: string) => {
    navigator.clipboard.writeText(voiceId);
    setCopiedId(voiceId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-50">Voice Library</h1>
          <p className="text-gray-400 mt-2">
            Browse and select voices for your commentary sessions
          </p>
        </div>

        {/* Default Voices */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Featured Voices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_VOICES.map((voice) => (
              <div
                key={voice.id}
                className={`bg-gray-800 rounded-lg shadow-sm border-2 transition cursor-pointer ${
                  selectedVoice === voice.id
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedVoice(voice.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-100">{voice.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs font-medium">
                          {voice.category}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs font-medium">
                          {voice.accent}
                        </span>
                      </div>
                    </div>
                    {selectedVoice === voice.id && (
                      <span className="text-gray-300 text-xl">✓</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mb-4">{voice.description}</p>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={voice.id}
                      readOnly
                      className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-xs font-mono text-gray-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyId(voice.id);
                      }}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-xs font-medium transition"
                    >
                      {copiedId === voice.id ? 'Copied!' : 'Copy ID'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Voice Section */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-600 p-5">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Use Custom Voice</h2>
          <p className="text-sm text-gray-400 mb-4">
            Have a custom ElevenLabs voice ID? Copy and paste it into the Playground preferences.
          </p>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              <strong>Tip:</strong> Visit{' '}
              <a
                href="https://elevenlabs.io/voice-library"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium hover:text-gray-100"
              >
                ElevenLabs Voice Library
              </a>{' '}
              to browse thousands of voices and get their IDs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceLibrary;
