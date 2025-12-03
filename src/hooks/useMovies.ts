import { useQuery } from '@tanstack/react-query';
import { tmdb } from '@/lib/tmdb';

export const useTrendingMovies = () => {
    return useQuery({
        queryKey: ['trending'],
        queryFn: async () => {
            const res = await tmdb.trending.trending('movie', 'day');
            return res.results;
        },
    });
};

export const usePopularMovies = () => {
    return useQuery({
        queryKey: ['popular'],
        queryFn: async () => {
            const res = await tmdb.movies.popular();
            return res.results;
        },
    });
};

export const useTopRatedMovies = () => {
    return useQuery({
        queryKey: ['topRated'],
        queryFn: async () => {
            const res = await tmdb.movies.topRated();
            return res.results;
        },
    });
};

export const useActionMovies = () => {
    return useQuery({
        queryKey: ['action'],
        queryFn: async () => {
            const res = await tmdb.discover.movie({ with_genres: '28' });
            return res.results;
        },
    });
};

export const useComedyMovies = () => {
    return useQuery({
        queryKey: ['comedy'],
        queryFn: async () => {
            const res = await tmdb.discover.movie({ with_genres: '35' });
            return res.results;
        },
    });
};

export const useMovieDetails = (id: number) => {
    return useQuery({
        queryKey: ['movie', id],
        queryFn: async () => {
            const res = await tmdb.movies.details(id, ['credits', 'similar', 'videos']);
            return res;
        },
        enabled: !!id,
    });
};

export const useTrendingAll = () => {
    return useQuery({
        queryKey: ['trendingAll'],
        queryFn: async () => {
            const res = await tmdb.trending.trending('all', 'day');
            return res.results;
        },
    });
};
