'use client';

import Navbar from '@/components/layout/Navbar';
import MovieModal from '@/components/modal/MovieModal';
import MovieRow from '@/components/home/MovieRow';
import { useOnTheAirTvShows, usePopularTvShows, useTopRatedTvShows, useTrendingTvShows } from '@/hooks/useTvShows';

export default function TvShowsPage() {
    const { data: trending } = useTrendingTvShows();
    const { data: popular } = usePopularTvShows();
    const { data: topRated } = useTopRatedTvShows();
    const { data: onTheAir } = useOnTheAirTvShows();

    return (
        <main className="relative min-h-screen bg-[#141414] pb-20">
            <Navbar />

            <div className="pt-20 px-4 md:px-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">TV Shows</h1>

                <div className="space-y-8">
                    <MovieRow title="Trending TV Shows" movies={trending as any || []} />
                    <MovieRow title="Popular on StreamX" movies={popular as any || []} />
                    <MovieRow title="Top Rated" movies={topRated as any || []} />
                    <MovieRow title="Airing Today" movies={onTheAir as any || []} />
                </div>
            </div>

            <MovieModal />
        </main>
    );
}
