interface ScreenPreviewProps {
  currentFrame: string | null;
  isSessionActive: boolean;
}

export const ScreenPreview = ({ currentFrame, isSessionActive }: ScreenPreviewProps) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Screen Preview</h2>
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
        {currentFrame ? (
          <img
            src={currentFrame}
            alt="Screen capture"
            className="w-full h-full object-contain"
          />
        ) : (
          <p className="text-gray-500">
            {isSessionActive
              ? 'Waiting for first frame...'
              : 'Start a session to see screen preview'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ScreenPreview;
