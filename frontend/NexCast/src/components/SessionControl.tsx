interface SessionControlProps {
  isSessionActive: boolean;
  isLoading: boolean;
  sessionId: number | null;
  elapsedTime: number;
  frameCount: number;
  isWebSocketConnected: boolean;
  onStartSession: () => void;
  onEndSession: () => void;
}

export const SessionControl = ({
  isSessionActive,
  isLoading,
  sessionId,
  elapsedTime,
  frameCount,
  isWebSocketConnected,
  onStartSession,
  onEndSession,
}: SessionControlProps) => {
  // Format elapsed time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Session Status</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isSessionActive
              ? 'bg-green-900/30 text-green-400'
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          {isSessionActive ? 'Active' : 'Idle'}
        </span>
      </div>

      {/* Session Info */}
      {isSessionActive && (
        <div className="grid grid-cols-4 gap-4 mb-4 text-center">
          <div>
            <p className="text-sm text-gray-400">Session ID</p>
            <p className="text-2xl font-bold text-gray-100">{sessionId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Duration</p>
            <p className="text-2xl font-bold text-gray-100">{formatTime(elapsedTime)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Frames</p>
            <p className="text-2xl font-bold text-gray-100">{frameCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">WebSocket</p>
            <p className="text-2xl font-bold">
              {isWebSocketConnected ? '🟢' : '🔴'}
            </p>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-4">
        {!isSessionActive ? (
          <button
            onClick={onStartSession}
            disabled={isLoading}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-50 font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Starting...' : 'Start Commentary Session'}
          </button>
        ) : (
          <button
            onClick={onEndSession}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Ending...' : 'End Session'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionControl;
