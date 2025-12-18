# zhancore-crm-frontend

Frontend for Zhancore CRM built with Vue 3 and Vite. It includes admin and consultant dashboards, CRM entities (leads, opportunities, projects), and shared UI components.

## Requirements

- Node.js: see `package.json` engines
- npm

## Getting started

```sh
npm install
```

Create a `.env.development` file (or reuse the existing one) with:

```env
VITE_API_BASE_URL=YOUR_API_BASE_URL
```

## Scripts

```sh
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview production build
npm run test      # Vitest in watch mode
npm run test:run  # Vitest single run
```

## Project structure

```
src/
  api/            # API services (axios wrappers)
  assets/         # static assets and base styles
  components/     # UI and feature components
  layouts/        # layout wrappers
  router/         # Vue Router configuration
  stores/         # Pinia stores (split by layers)
  views/          # pages for admin/consultant
```

## Notes

- API base URL is read from `VITE_API_BASE_URL`.
- Routes are lazy-loaded in `src/router/index.js`.
- Pinia store is split into `src/stores/crm/state.js` and `src/stores/crm/actions.js`.
