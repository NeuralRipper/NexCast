import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-semibold">Session Status</CardTitle>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
          isSessionActive
            ? 'bg-emerald-500/10 text-emerald-500'
            : 'bg-muted text-muted-foreground'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
          {isSessionActive ? 'Active' : 'Idle'}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isSessionActive && (
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Session ID</p>
              <p className="text-2xl font-semibold">{sessionId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-2xl font-semibold font-mono">{formatTime(elapsedTime)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Frames</p>
              <p className="text-2xl font-semibold">{frameCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Connection</p>
              <p className="text-2xl">
                {isWebSocketConnected ? '🟢' : '🔴'}
              </p>
            </div>
          </div>
        )}

        {!isSessionActive ? (
          <Button
            onClick={onStartSession}
            disabled={isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? 'Starting...' : 'Start Commentary Session'}
          </Button>
        ) : (
          <Button
            onClick={onEndSession}
            disabled={isLoading}
            size="lg"
            variant="destructive"
            className="w-full"
          >
            {isLoading ? 'Ending...' : 'End Session'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionControl;
