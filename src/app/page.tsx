'use client';

import HeroBanner from '@/components/home/HeroBanner';
import MovieRow from '@/components/home/MovieRow';
import Navbar from '@/components/layout/Navbar';
import MovieModal from '@/components/modal/MovieModal';
import { useActionMovies, useComedyMovies, usePopularMovies, useTopRatedMovies, useTrendingMovies } from '@/hooks/useMovies';

export default function Home() {
  const { data: trending, isLoading: trendingLoading, error: trendingError } = useTrendingMovies();
  const { data: popular, isLoading: popularLoading, error: popularError } = usePopularMovies();
  const { data: topRated, isLoading: topRatedLoading, error: topRatedError } = useTopRatedMovies();
  const { data: action, isLoading: actionLoading, error: actionError } = useActionMovies();
  const { data: comedy, isLoading: comedyLoading, error: comedyError } = useComedyMovies();

  return (
    <main className="relative min-h-screen bg-[#141414]">
      <Navbar />
      <HeroBanner />

      <div className="relative z-10 space-y-8 md:space-y-12 px-2 sm:px-4 md:px-8 lg:px-16 pb-12 md:pb-20">
        <MovieRow title="Trending Now" movies={trending || []} isLoading={trendingLoading} error={trendingError as Error} />
        <MovieRow title="Popular on StreamX" movies={popular || []} isLoading={popularLoading} error={popularError as Error} />
        <MovieRow title="Top Rated" movies={topRated || []} isLoading={topRatedLoading} error={topRatedError as Error} />
        <MovieRow title="Action Thrillers" movies={action || []} isLoading={actionLoading} error={actionError as Error} />
        <MovieRow title="Comedies" movies={comedy || []} isLoading={comedyLoading} error={comedyError as Error} />
      </div>

      <MovieModal />
    </main>
  );
}
