import { useQuery } from '@tanstack/react-query';
import { tmdb } from '@/lib/tmdb';
import { Franchise } from '@/lib/franchises';
import { Movie, TV } from 'tmdb-ts';

export interface FranchiseContent {
    id: number;
    title: string;
    poster_path?: string;
    backdrop_path?: string;
    release_date: string;
    media_type: 'movie' | 'tv';
    overview: string;
    number_of_seasons?: number;
    number_of_episodes?: number;
}

async function fetchFranchiseContent(franchise: Franchise): Promise<FranchiseContent[]> {
    let movies: Movie[] = [];
    let tvShows: TV[] = [];

    if (franchise.type === 'keyword') {
        const [moviesRes, tvRes] = await Promise.all([
            tmdb.discover.movie({ with_keywords: String(franchise.value), sort_by: 'release_date.asc' }),
            tmdb.discover.tvShow({ with_keywords: String(franchise.value), sort_by: 'first_air_date.asc' })
        ]);
        movies = moviesRes.results;
        tvShows = tvRes.results;

        // Fetch more pages if needed? For now, 1 page (20 items) might be enough for small franchises, 
        // but MCU has 30+ movies. We should probably fetch all pages or at least a few.
        // Let's fetch up to 3 pages for now to cover most.
        // Actually, let's keep it simple for V1 and just fetch page 1. 
        // Wait, MCU has > 30 movies. Page 1 is not enough.
        // I'll implement a simple loop to fetch all pages later if needed, or just fetch 2-3 pages now.
        if (moviesRes.total_pages > 1) {
            const page2 = await tmdb.discover.movie({ with_keywords: String(franchise.value), sort_by: 'release_date.asc', page: 2 });
            movies = [...movies, ...page2.results];
            if (moviesRes.total_pages > 2) {
                const page3 = await tmdb.discover.movie({ with_keywords: String(franchise.value), sort_by: 'release_date.asc', page: 3 });
                movies = [...movies, ...page3.results];
            }
        }
    } else if (franchise.type === 'company') {
        const [moviesRes, tvRes] = await Promise.all([
            tmdb.discover.movie({ with_companies: String(franchise.value), sort_by: 'release_date.asc' }),
            tmdb.discover.tvShow({ with_companies: String(franchise.value), sort_by: 'first_air_date.asc' })
        ]);
        movies = moviesRes.results;
        tvShows = tvRes.results;

        if (moviesRes.total_pages > 1) {
            const page2 = await tmdb.discover.movie({ with_companies: String(franchise.value), sort_by: 'release_date.asc', page: 2 });
            movies = [...movies, ...page2.results];
            if (moviesRes.total_pages > 2) {
                const page3 = await tmdb.discover.movie({ with_companies: String(franchise.value), sort_by: 'release_date.asc', page: 3 });
                movies = [...movies, ...page3.results];
            }
        }
    }

    const formattedMovies = movies.map(m => ({
        id: m.id,
        title: m.title,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        release_date: m.release_date,
        media_type: 'movie' as const,
        overview: m.overview
    }));

    const formattedTv = tvShows.map(t => ({
        id: t.id,
        title: t.name,
        poster_path: t.poster_path,
        backdrop_path: t.backdrop_path,
        release_date: t.first_air_date,
        media_type: 'tv' as const,
        overview: t.overview
    }));

    const allContent = [...formattedMovies, ...formattedTv].filter(item => item.release_date); // Filter out unreleased/undated if needed, but "Coming Soon" is good.

    // Sort by release date
    return allContent.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
}

export const useFranchiseContent = (franchise: Franchise | undefined) => {
    return useQuery({
        queryKey: ['franchise', franchise?.id],
        queryFn: () => franchise ? fetchFranchiseContent(franchise) : Promise.resolve([]),
        enabled: !!franchise,
    });
};
