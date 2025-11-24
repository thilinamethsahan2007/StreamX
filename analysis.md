# StreamX Project Analysis

## Overview
StreamX is a modern, Netflix-inspired streaming web application built with Next.js 16. It features a sleek, responsive UI, integration with TMDB for movie and TV show data, and a video player for streaming content.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **API:** TMDB (The Movie Database)
- **Video Player:** VidSrc v3

## Project Structure
The project follows a standard Next.js App Router structure:

### `src/app`
- **Routing:**
  - `/`: Home page (`page.tsx`) - Displays Hero Banner and Movie Rows.
  - `/movies`: Movies listing page.
  - `/tv`: TV Shows listing page.
  - `/new`: New & Popular content.
  - `/watch`: Video player page for streaming.
- **Layout:** `layout.tsx` defines the global layout, including the `Navbar`.

### `src/components`
- **`layout/Navbar.tsx`:** Responsive navigation bar with scroll effects and search integration.
- **`home/HeroBanner.tsx`:** Featured movie banner with "Play" and "More Info" actions.
- **`home/MovieRow.tsx`:** Horizontal scrollable list of movie cards.
- **`modal/MovieModal.tsx`:** Modal for displaying detailed movie information.
- **`shared`:** Reusable components like `MovieCard`.
- **`ui`:** Generic UI elements (loaders, error messages).

### `src/lib`
- **`tmdb.ts`:** TMDB API client initialization using `tmdb-ts`.
- **`utils.ts`:** Utility functions (e.g., image URL generation).
- **`players.ts`:** Configuration for video players.

### `src/hooks`
- **`useMovies.ts`:** Custom hooks for fetching movie data (trending, popular, etc.) using TanStack Query.
- **`useSearch.ts`:** Hooks for search functionality.

## Key Features
1.  **Responsive Design:** Optimized for mobile, tablet, and desktop.
2.  **Dynamic Content:** Fetches real-time data from TMDB.
3.  **Streaming:** Custom video player with fallback to VidSrc v3 iframe. Attempts to extract direct streams via API route to provide a popup-free experience.
4.  **Search:** Built-in search functionality with a modal interface.
5.  **State Management:** Uses Zustand for managing global state (e.g., modal visibility).

## Observations
- The code is clean and well-organized.
- It uses modern React patterns (Hooks, Functional Components).
- Tailwind CSS is used effectively for styling.
- Error handling and loading states are implemented in UI components.

## Recommendations
- **Testing:** Consider adding unit or integration tests (e.g., using Jest or Cypress).
- **SEO:** Ensure metadata is dynamically generated for each page for better SEO.
- **Performance:** Monitor performance, especially with large image loads (consider using `next/image` optimization if not already fully utilized).
