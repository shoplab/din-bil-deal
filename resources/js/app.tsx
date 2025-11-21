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
        
        // Try with both .jsx and .tsx extensions
        const pages = import.meta.glob(['./pages/**/*.jsx', './pages/**/*.tsx']);
        
        // Try different path patterns
        const possiblePaths = [
            `./pages/${normalizedName}.jsx`,
            `./pages/${normalizedName}.tsx`,
            `./pages/${normalizedName}/Index.jsx`,
            `./pages/${normalizedName}/Index.tsx`,
        ];
        
        for (const path of possiblePaths) {
            if (pages[path]) {
                return pages[path]();
            }
        }
        
        // Fallback to the original resolver
        return resolvePageComponent(`./pages/${normalizedName}`, pages);
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
