import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => {
        // Handle case where Laravel might prepend 'Pages/' (uppercase)
        // Convert to lowercase 'pages/' to match actual directory structure
        const normalizedName = name.replace(/^Pages\//i, '');
        const path = `./pages/${normalizedName}`;
        return resolvePageComponent(path, import.meta.glob('./pages/**/*.{jsx,tsx}'));
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
