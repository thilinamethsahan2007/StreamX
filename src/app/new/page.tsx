'use client';

import Navbar from '@/components/layout/Navbar';
import MovieModal from '@/components/modal/MovieModal';
import MovieRow from '@/components/home/MovieRow';
import { useTrendingMovies } from '@/hooks/useMovies';
import { useTrendingTvShows } from '@/hooks/useTvShows';
import { useQuery } from '@tanstack/react-query';
import { tmdb } from '@/lib/tmdb';

export default function NewPopularPage() {
    const { data: trendingMovies } = useTrendingMovies();
    const { data: trendingTv } = useTrendingTvShows();

    const { data: upcomingMovies } = useQuery({
        queryKey: ['upcoming'],
        queryFn: async () => {
            const res = await tmdb.movies.upcoming();
            return res.results;
        },
    });

    const { data: nowPlaying } = useQuery({
        queryKey: ['nowPlaying'],
        queryFn: async () => {
            const res = await tmdb.movies.nowPlaying();
            return res.results;
        },
    });

    return (
        <main className="relative min-h-screen bg-[#141414] pb-20">
            <Navbar />

            <div className="pt-20 px-4 md:px-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">New & Popular</h1>

                <div className="space-y-8">
                    <MovieRow title="Trending Now" movies={trendingMovies || []} />
                    <MovieRow title="Trending TV Shows" movies={trendingTv as any || []} />
                    <MovieRow title="Now Playing in Theaters" movies={nowPlaying || []} />
                    <MovieRow title="Coming Soon" movies={upcomingMovies || []} />
                </div>
            </div>

            <MovieModal />
        </main>
    );
}
