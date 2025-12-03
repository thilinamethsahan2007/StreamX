import { useQuery } from '@tanstack/react-query';
import { tmdb } from '@/lib/tmdb';

export const useMovieGenres = () => {
    return useQuery({
        queryKey: ['movieGenres'],
        queryFn: async () => {
            const res = await tmdb.genres.movies();
            return res.genres;
        },
    });
};

export const useTvGenres = () => {
    return useQuery({
        queryKey: ['tvGenres'],
        queryFn: async () => {
            const res = await tmdb.genres.tvShows();
            return res.genres;
        },
    });
};

export const useMoviesByGenre = (genreId: number | null) => {
    return useQuery({
        queryKey: ['moviesByGenre', genreId],
        queryFn: async () => {
            if (!genreId) return [];
            const res = await tmdb.discover.movie({ with_genres: genreId.toString() });
            return res.results;
        },
        enabled: !!genreId,
    });
};

export const useTvShowsByGenre = (genreId: number | null) => {
    return useQuery({
        queryKey: ['tvShowsByGenre', genreId],
        queryFn: async () => {
            if (!genreId) return [];
            const res = await tmdb.discover.tvShow({ with_genres: genreId.toString() });
            return res.results;
        },
        enabled: !!genreId,
    });
};
