'use client';

import Navbar from '@/components/layout/Navbar';
import MovieModal from '@/components/modal/MovieModal';
import ContentRow from '@/components/home/ContentRow';
import Top10Row from '@/components/home/Top10Row';
import HeroBanner from '@/components/home/HeroBanner';
import { useActionMovies, useComedyMovies, usePopularMovies, useTopRatedMovies, useTrendingMovies } from '@/hooks/useMovies';

export default function MoviesPage() {
    const { data: trending, isLoading: trendingLoading, error: trendingError } = useTrendingMovies();
    const { data: popular, isLoading: popularLoading, error: popularError } = usePopularMovies();
    const { data: topRated, isLoading: topRatedLoading, error: topRatedError } = useTopRatedMovies();
    const { data: action, isLoading: actionLoading, error: actionError } = useActionMovies();
    const { data: comedy, isLoading: comedyLoading, error: comedyError } = useComedyMovies();

    return (
        <main className="relative min-h-screen bg-[#141414]">
            <Navbar />
            <HeroBanner />

            <div className="relative z-10 space-y-2 md:space-y-4 pb-12 md:pb-20 px-4 md:px-8">
                <Top10Row title="Top 10 Movies Today" movies={trending || []} />
                <ContentRow title="Trending Now" movies={trending || []} isLoading={trendingLoading} error={trendingError as Error} />
                <ContentRow title="Popular Movies" movies={popular || []} isLoading={popularLoading} error={popularError as Error} />
                <ContentRow title="Top Rated" movies={topRated || []} isLoading={topRatedLoading} error={topRatedError as Error} />
                <ContentRow title="Action Thrillers" movies={action || []} isLoading={actionLoading} error={actionError as Error} />
                <ContentRow title="Comedies" movies={comedy || []} isLoading={comedyLoading} error={comedyError as Error} />
            </div>

            <MovieModal />
        </main>
    );
}
