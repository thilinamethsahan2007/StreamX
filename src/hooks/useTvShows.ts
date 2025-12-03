import { useQuery } from '@tanstack/react-query';
import { tmdb } from '@/lib/tmdb';

export const useTrendingTvShows = () => {
    return useQuery({
        queryKey: ['trendingTv'],
        queryFn: async () => {
            const res = await tmdb.trending.trending('tv', 'day');
            return res.results;
        },
    });
};

export const usePopularTvShows = () => {
    return useQuery({
        queryKey: ['popularTv'],
        queryFn: async () => {
            const res = await tmdb.tvShows.popular();
            return res.results;
        },
    });
};

export const useTopRatedTvShows = () => {
    return useQuery({
        queryKey: ['topRatedTv'],
        queryFn: async () => {
            const res = await tmdb.tvShows.topRated();
            return res.results;
        },
    });
};

export const useOnTheAirTvShows = () => {
    return useQuery({
        queryKey: ['onTheAir'],
        queryFn: async () => {
            const res = await tmdb.tvShows.onTheAir();
            return res.results;
        },
    });
};
