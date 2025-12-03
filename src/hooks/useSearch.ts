import { useQuery } from '@tanstack/react-query';
import { tmdb } from '@/lib/tmdb';

export const useSearchMovies = (query: string) => {
    return useQuery({
        queryKey: ['search', query],
        queryFn: async () => {
            if (!query) return [];
            const res = await tmdb.search.multi({ query });
            return res.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
        },
        enabled: query.length > 0,
    });
};
