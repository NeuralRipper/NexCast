import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ScreenPreviewProps {
  currentFrame: string | null;
  isSessionActive: boolean;
}

export const ScreenPreview = ({ currentFrame, isSessionActive }: ScreenPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Screen Preview</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center overflow-hidden border border-border/40">
          {currentFrame ? (
            <img
              src={currentFrame}
              alt="Screen capture"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {isSessionActive
                  ? 'Waiting for first frame...'
                  : 'Start a session to see screen preview'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScreenPreview;
