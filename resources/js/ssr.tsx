import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { type RouteName, route } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
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
        setup: ({ App, props }) => {
            /* eslint-disable */
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    // @ts-expect-error
                    ...page.props.ziggy,
                    // @ts-expect-error
                    location: new URL(page.props.ziggy.location),
                });
            /* eslint-enable */

            return <App {...props} />;
        },
    }),
);
