# Stop Scout

Stop Scout is a PWA application for quickly searching public transport stops and viewing real-time departure information for the Gdańsk metropolitan area (ZTM Gdańsk). Built with Vue 3, TypeScript, Vite, and Pinia, it provides a fast, modern, and offline-capable experience.

## Preview

[Live Preview on Vercel](https://stop-scout-two.vercel.app/)

## Features

- **Search Stops:** Instantly search for bus and tram stops by name.
- **Real-Time Departures:** View up-to-date departure times, delays, and vehicle information for each stop.
- **Favorites:** Mark stops as favorites for quick access.
- **Offline Support:** Core data is cached for offline use via PWA features.
- **Authentication:** Simple local authentication for user-specific features.
- **Responsive Design:** Mobile-first UI using Tailwind CSS.

## Tech Stack

- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for fast development and builds
- [Pinia](https://pinia.vuejs.org/) for state management
- [Vue Router](https://router.vuejs.org/) for navigation
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) for offline support

## Getting Started

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Run the development server:**
   ```
   npm run dev
   ```

3. **Build for production:**
   ```
   npm run build
   ```

## Project Structure

- `src/views/` – Main pages (Home, Stop details, Auth)
- `src/components/` – UI components (e.g., DepartureCard)
- `src/stores/` – Pinia stores for stops, user, etc.
- `src/composables/` – Logic for fetching ZTM data
- `src/types/` – TypeScript interfaces for ZTM API

## Data Sources

- **Stops and departures:** [ZTM Gdańsk Open Data](https://ckan2.multimediagdansk.pl/)
  - Stops list: `stops.json`
  - Departures: `/departures?stopId=...`

## License

This project is for educational and non-commercial use only.
