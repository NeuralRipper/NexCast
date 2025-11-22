import { useState, useEffect, useRef } from 'react';
import { api, SessionPreferences } from '../services/api';
import { useScreenCapture } from '../hooks/useScreenCapture';
import { useWebSocketAudio } from '../hooks/useWebSocketAudio';


// Capture interval options
const INTERVAL_OPTIONS = [
  { value: 10000, label: '10s (Fast)' },
  { value: 20000, label: '20s (Balanced)' },
  { value: 30000, label: '30s (Slow)' },
];

export const Dashboard = () => {
  // Session state
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const wsAudio = useWebSocketAudio()

  // Preferences state
  const [preferences, setPreferences] = useState<SessionPreferences>({
    speaker1_voice_id: 'qVpGLzi5EhjW3WGVhOa9',  // American Urban (default)
    speaker2_voice_id: 'gU0LNdkMOQCOrPrwtbee',  // British Announcer (default)
    capture_interval: 10000,
  });

  // Screen capture hook
  const capture = useScreenCapture(preferences.capture_interval || 10000);

  // Timer ref
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update elapsed time
  useEffect(() => {
    if (isSessionActive && sessionStartTime) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isSessionActive, sessionStartTime]);

  // Send frames to WebSocket at user-configured interval
  useEffect(() => {
    if (isSessionActive && wsAudio.isConnected && capture.currentFrame) {
      wsAudio.sendFrame(capture.currentFrame);
    }
  }, [capture.frameCount]); // Only trigger when frameCount increments

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start session
  const handleStartSession = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Start API session
      const response = await api.startSession(preferences);
      setSessionId(response.session_id);
      setIsSessionActive(true);
      setSessionStartTime(Date.now());

      // Start screen capture
      await capture.startCapture();

      // Connect WebSocket
      wsAudio.connect(response.session_id, preferences)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start session';
      setError(errorMessage);
      console.error('Start session error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // End session
  const handleEndSession = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Disconnect WebSocket frist
      wsAudio.disconnect()

      if (sessionId) {
        // End API session with frame count
        await api.endSession(sessionId, capture.frameCount);
      }

      // Stop screen capture
      capture.stopCapture();

      // Reset state
      setIsSessionActive(false);
      setSessionId(null);
      setSessionStartTime(null);
      setElapsedTime(0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to end session';
      setError(errorMessage);
      console.error('End session error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Live Commentary Dashboard</h1>

      {/* Error Display */}
      {(error || capture.error || wsAudio.error) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error || capture.error || wsAudio.error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Session Control & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Session Status</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isSessionActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {isSessionActive ? 'Active' : 'Idle'}
              </span>
            </div>

            {/* Session Info */}
            {isSessionActive && (
              <div className="grid grid-cols-4 gap-4 mb-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Session ID</p>
                  <p className="text-2xl font-bold">{sessionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Frames</p>
                  <p className="text-2xl font-bold">{capture.frameCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">WebSocket</p>
                  <p className="text-2xl font-bold">
                    {wsAudio.isConnected ? '🟢' : '🔴'}
                  </p>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-4">
              {!isSessionActive ? (
                <button
                  onClick={handleStartSession}
                  disabled={isLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isLoading ? 'Starting...' : 'Start Commentary Session'}
                </button>
              ) : (
                <button
                  onClick={handleEndSession}
                  disabled={isLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isLoading ? 'Ending...' : 'End Session'}
                </button>
              )}
            </div>
          </div>

          {/* Screen Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Screen Preview</h2>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
              {capture.currentFrame ? (
                <img
                  src={capture.currentFrame}
                  alt="Screen capture"
                  className="w-full h-full object-contain"
                />
              ) : (
                <p className="text-gray-400">
                  {isSessionActive
                    ? 'Waiting for first frame...'
                    : 'Start a session to see screen preview'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Preferences */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>

            <div className="space-y-4">
              {/* Speaker 1 Voice */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker 1 (American)
                </label>
                <input
                  type="text"
                  value={preferences.speaker1_voice_id}
                  onChange={(e) =>
                    setPreferences({ ...preferences, speaker1_voice_id: e.target.value })
                  }
                  disabled={isSessionActive}
                  placeholder="Voice ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 bg-white text-sm font-mono"
                />
              </div>

              {/* Speaker 2 Voice */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker 2 (British) - Optional
                </label>
                <input
                  type="text"
                  value={preferences.speaker2_voice_id || ''}
                  onChange={(e) =>
                    setPreferences({ ...preferences, speaker2_voice_id: e.target.value || undefined })
                  }
                  disabled={isSessionActive}
                  placeholder="Voice ID (leave empty for single speaker)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 bg-white text-sm font-mono"
                />
              </div>

              {/* Capture Interval */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capture Interval
                </label>
                <select
                  value={preferences.capture_interval}
                  onChange={(e) =>
                    setPreferences({ ...preferences, capture_interval: parseInt(e.target.value) })
                  }
                  disabled={isSessionActive}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 bg-white"
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
