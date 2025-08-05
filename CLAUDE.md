# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
# Laravel + React development (concurrent servers)
composer dev              # Runs Laravel server, queue worker, logs, and Vite dev server
composer dev:ssr          # Same as above but with SSR support for Inertia.js

# Individual commands
php artisan serve          # Laravel development server
npm run dev               # Vite development server for React/TypeScript
php artisan queue:listen   # Background queue worker
php artisan pail          # Real-time log viewing
```

### Build & Production
```bash
npm run build             # Production build for React/TypeScript
npm run build:ssr         # Production build with SSR support
```

### Code Quality
```bash
npm run lint              # ESLint with auto-fix
npm run format            # Prettier formatting for resources/
npm run format:check      # Check Prettier formatting
npm run types             # TypeScript type checking (no emit)
```

### Testing
```bash
composer test             # Full PHP test suite (clears config first)
php artisan test          # Direct Laravel/Pest testing
```

### Database
```bash
php artisan migrate       # Run database migrations
php artisan migrate:fresh # Fresh migration (drops all tables)
```

## Architecture Overview

This is a **Laravel 12 + React 19 + Inertia.js** full-stack application with the following key architectural decisions:

### Frontend Architecture
- **React 19** with TypeScript for the frontend layer
- **Inertia.js** for seamless SPA experience without API complexity
- **ShadCN/UI** as the primary component library (configured in `components.json`)
- **Tailwind CSS 4.0** for styling with CSS variables and theming support
- **File-based routing** through Inertia.js page resolution in `resources/js/pages/`

### UI Component System
- **ShadCN/UI Components**: Located in `resources/js/components/ui/` 
- **Custom Components**: Application-specific components in `resources/js/components/`
- **Layout System**: Hierarchical layouts in `resources/js/layouts/` with header and sidebar variants
- **Theming**: Dark/light mode support via appearance system in `hooks/use-appearance.tsx`

### Backend Architecture
- **Laravel 12** with standard MVC pattern
- **Inertia.js Server-side**: Controllers return Inertia responses instead of JSON
- **Authentication**: Laravel's built-in auth with Inertia integration
- **Testing**: Pest PHP testing framework

### Key Configuration Files
- `vite.config.ts`: Vite configuration with Laravel plugin, React, and Tailwind
- `tsconfig.json`: TypeScript configuration with path mapping (`@/` → `resources/js/`)
- `components.json`: ShadCN/UI configuration with aliases and styling preferences
- Path aliases: `@/` maps to `resources/js/`, established in both Vite and TypeScript configs

### File Structure Patterns
- **Pages**: `resources/js/pages/` - Inertia.js page components
- **Layouts**: `resources/js/layouts/` - Reusable layout components with variants
- **Components**: `resources/js/components/` - Custom application components
- **UI Components**: `resources/js/components/ui/` - ShadCN/UI components
- **Hooks**: `resources/js/hooks/` - Custom React hooks
- **Types**: `resources/js/types/` - TypeScript type definitions
- **Controllers**: `app/Http/Controllers/` - Laravel controllers organized by feature
- **Routes**: Separate route files (`routes/web.php`, `routes/auth.php`, `routes/settings.php`)

### Key Integrations
- **Ziggy**: Laravel route helpers available in JavaScript/TypeScript
- **Server-Side Rendering**: Optional SSR support through `resources/js/ssr.tsx`
- **Design System**: ShadCN/UI with neutral base color and CSS variables
- **Icon System**: Lucide React icons as the primary icon library

## Product Development Workflow

This project includes structured product development workflow tools in `docs/instructions/`:

### PRD Generation (`create-prd.mdc`)
- Creates Product Requirements Documents in `/tasks/` directory
- Requires clarifying questions before generation
- Structured format optimized for junior developers
- Output: `prd-[feature-name].md`

### Task Generation (`generate-tasks.mdc`)
- Converts PRDs into actionable task lists
- Two-phase process: parent tasks → sub-tasks
- Includes relevant file identification
- Output: `tasks-[prd-file-name].md`

### Task Management (`process-task-list.mdc`)
- One sub-task at a time execution
- Completion protocol with checkbox updates
- File tracking in "Relevant Files" section
- Requires user approval between sub-tasks

## Development Standards

### TypeScript Configuration
- Strict mode enabled with `noImplicitAny`
- ESNext target with bundler module resolution
- Path mapping configured for clean imports
- JSX set to `react-jsx` (automatic runtime)

### Code Quality Tools
- **ESLint 9** with React and TypeScript support
- **Prettier** with Tailwind CSS plugin and import organization
- **TypeScript compiler** for type checking without emission
- All tools configured to work with the React/TypeScript stack

### Styling Approach
- **Tailwind CSS 4.0** with Vite plugin integration
- **CSS Variables** for theming (configured in ShadCN/UI)
- **Component Variants**: Using `class-variance-authority` and `clsx`
- **Responsive Design**: Mobile-first approach with Tailwind utilities

### Authentication Flow
- Laravel-based authentication with Inertia.js integration
- Separate auth routes and controllers in `routes/auth.php`
- Email verification and password reset workflows included
- Settings management for profile and password updates