import type { SessionPreferences } from '../interfaces/session';

const INTERVAL_OPTIONS = [
  { value: 10000, label: '10s (Fast)' },
  { value: 20000, label: '20s (Balanced)' },
  { value: 30000, label: '30s (Slow)' },
];

interface PreferencesPanelProps {
  preferences: SessionPreferences;
  isSessionActive: boolean;
  onPreferencesChange: (preferences: SessionPreferences) => void;
}

export const PreferencesPanel = ({
  preferences,
  isSessionActive,
  onPreferencesChange,
}: PreferencesPanelProps) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Preferences</h2>

      <div className="space-y-4">
        {/* Speaker 1 Voice */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Speaker 1 (American)
          </label>
          <input
            type="text"
            value={preferences.speaker1_voice_id}
            onChange={(e) =>
              onPreferencesChange({ ...preferences, speaker1_voice_id: e.target.value })
            }
            disabled={isSessionActive}
            placeholder="Voice ID"
            className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-200 bg-gray-900 text-sm font-mono"
          />
        </div>

        {/* Speaker 2 Voice */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Speaker 2 (British) - Optional
          </label>
          <input
            type="text"
            value={preferences.speaker2_voice_id || ''}
            onChange={(e) =>
              onPreferencesChange({
                ...preferences,
                speaker2_voice_id: e.target.value || undefined,
              })
            }
            disabled={isSessionActive}
            placeholder="Voice ID (leave empty for single speaker)"
            className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-200 bg-gray-900 text-sm font-mono"
          />
        </div>

        {/* Capture Interval */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Capture Interval
          </label>
          <select
            value={preferences.capture_interval}
            onChange={(e) =>
              onPreferencesChange({
                ...preferences,
                capture_interval: parseInt(e.target.value),
              })
            }
            disabled={isSessionActive}
            className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-200 bg-gray-900"
          >
            {INTERVAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isSessionActive && (
        <p className="text-xs text-gray-500 mt-4 italic">
          Preferences are locked during active session
        </p>
      )}
    </div>
  );
};

export default PreferencesPanel;
