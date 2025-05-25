import React from 'react';
import { createRoot } from 'react-dom/client';
import { StagewiseToolbar } from '@stagewise/toolbar-react';

const stagewiseConfig = {
  plugins: [],
  theme: {
    primary: '#4F46E5', // Indigo color to match your app
    background: '#1F2937', // Dark gray to match your app's dark theme
    text: '#FFFFFF'
  },
  position: 'bottom-right',
  debug: process.env.NODE_ENV === 'development'
};

export const StagewiseToolbarWrapper = () => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      try {
        const toolbarContainer = document.createElement('div');
        toolbarContainer.id = 'stagewise-toolbar-root';
        document.body.appendChild(toolbarContainer);

        const root = createRoot(toolbarContainer);
        root.render(
          <React.StrictMode>
            <StagewiseToolbar config={stagewiseConfig} />
          </React.StrictMode>
        );

        return () => {
          root.unmount();
          if (document.body.contains(toolbarContainer)) {
            document.body.removeChild(toolbarContainer);
          }
        };
      } catch (error) {
        console.error('Failed to initialize Stagewise toolbar:', error);
      }
    }
  }, []);

  return null;
}; 