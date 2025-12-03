'use client';

import Navbar from '@/components/layout/Navbar';
import MovieModal from '@/components/modal/MovieModal';
import ContentRow from '@/components/home/ContentRow';
import Top10Row from '@/components/home/Top10Row';
import ContinueWatchingRow from '@/components/home/ContinueWatchingRow';
import HeroBanner from '@/components/home/HeroBanner';
import GenreDropdown from '@/components/shared/GenreDropdown';
import ContentGrid from '@/components/shared/ContentGrid';
import { useTrendingTvShows, usePopularTvShows, useTopRatedTvShows, useOnTheAirTvShows } from '@/hooks/useTvShows';
import { useTvGenres, useTvShowsByGenre } from '@/hooks/useGenres';
import { useState } from 'react';

export default function TvShowsPage() {
    const { data: trending, isLoading: trendingLoading, error: trendingError } = useTrendingTvShows();
    const { data: popular, isLoading: popularLoading, error: popularError } = usePopularTvShows();
    const { data: topRated, isLoading: topRatedLoading, error: topRatedError } = useTopRatedTvShows();
    const { data: onTheAir, isLoading: onTheAirLoading, error: onTheAirError } = useOnTheAirTvShows();

    const { data: genres } = useTvGenres();
    const [selectedGenre, setSelectedGenre] = useState<{ id: number; name: string } | null>(null);
    const { data: tvShowsByGenre, isLoading: tvShowsByGenreLoading, error: tvShowsByGenreError } = useTvShowsByGenre(selectedGenre?.id || null);

    return (
        <main className="relative min-h-screen bg-[#141414]">
            <Navbar />
            <HeroBanner variant="tv" />

            <div className="relative z-10 space-y-2 md:space-y-4 pb-12 md:pb-20 px-4 md:px-8">
                <div className="flex justify-end px-4 md:px-8 lg:px-16 mb-4">
                    <GenreDropdown
                        genres={genres || []}
                        selectedGenre={selectedGenre}
                        onSelect={setSelectedGenre}
                    />
                </div>

                {selectedGenre ? (
                    <ContentGrid
                        title={`${selectedGenre.name} TV Shows`}
                        movies={tvShowsByGenre as any || []}
                        isLoading={tvShowsByGenreLoading}
                        error={tvShowsByGenreError as Error}
                    />
                ) : (
                    <>
                        <ContinueWatchingRow />
                        <Top10Row title="Top 10 TV Shows Today" movies={trending as any || []} />
                        <ContentRow title="Trending TV Shows" movies={trending as any || []} isLoading={trendingLoading} error={trendingError as Error} />
                        <ContentRow title="Popular on StreamX" movies={popular as any || []} isLoading={popularLoading} error={popularError as Error} />
                        <ContentRow title="Top Rated" movies={topRated as any || []} isLoading={topRatedLoading} error={topRatedError as Error} />
                        <ContentRow title="Airing Today" movies={onTheAir as any || []} isLoading={onTheAirLoading} error={onTheAirError as Error} />
                    </>
                )}
            </div>

            <MovieModal />
        </main>
    );
}
