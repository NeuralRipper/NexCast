import { useState } from 'react';

export const Settings = () => {
  const [apiBaseUrl] = useState(import.meta.env.VITE_API_GATEWAY_URL || '');
  const [wsBaseUrl] = useState('ws://localhost:8000');

  const handleSignOut = async () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = `${window.location.origin}/`;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-900">
      <div className="w-full max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-50">Settings</h1>

        <div className="space-y-6">
          {/* API Configuration */}
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">API Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Gateway URL
                </label>
                <input
                  type="text"
                  value={apiBaseUrl}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm font-mono text-gray-300"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Configured via VITE_API_GATEWAY_URL environment variable
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  WebSocket URL
                </label>
                <input
                  type="text"
                  value={wsBaseUrl}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm font-mono text-gray-300"
                />
                <p className="text-xs text-gray-500 mt-1">
                  WebSocket connection for real-time audio streaming
                </p>
              </div>
            </div>
          </div>

          {/* Default Preferences */}
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Default Session Preferences
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Speaker 1 Voice ID
                </label>
                <input
                  type="text"
                  value="qVpGLzi5EhjW3WGVhOa9"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm font-mono text-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Speaker 2 Voice ID
                </label>
                <input
                  type="text"
                  value="gU0LNdkMOQCOrPrwtbee"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm font-mono text-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Capture Interval
                </label>
                <input
                  type="text"
                  value="10 seconds"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-300"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 italic">
              Note: These defaults can be customized per session in the Playground
            </p>
          </div>

          {/* Account */}
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Account</h2>

            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-200">Sign Out</p>
                <p className="text-xs text-gray-500">Sign out of your NexCast account</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* About */}
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">About</h2>

            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <strong>Version:</strong> 1.0.0
              </p>
              <p>
                <strong>Build:</strong> Development
              </p>
              <p className="pt-2 border-t border-gray-700">
                NexCast provides real-time AI-powered sports commentary for your gameplay sessions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
