'use client';

import Navbar from '@/components/layout/Navbar';
import MovieModal from '@/components/modal/MovieModal';
import MovieRow from '@/components/home/MovieRow';
import { useActionMovies, useComedyMovies, usePopularMovies, useTopRatedMovies, useTrendingMovies } from '@/hooks/useMovies';

export default function MoviesPage() {
    const { data: trending } = useTrendingMovies();
    const { data: popular } = usePopularMovies();
    const { data: topRated } = useTopRatedMovies();
    const { data: action } = useActionMovies();
    const { data: comedy } = useComedyMovies();

    return (
        <main className="relative min-h-screen bg-[#141414] pb-20">
            <Navbar />

            <div className="pt-20 px-4 md:px-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Movies</h1>

                <div className="space-y-8">
                    <MovieRow title="Trending Now" movies={trending || []} />
                    <MovieRow title="Popular Movies" movies={popular || []} />
                    <MovieRow title="Top Rated" movies={topRated || []} />
                    <MovieRow title="Action Thrillers" movies={action || []} />
                    <MovieRow title="Comedies" movies={comedy || []} />
                </div>
            </div>

            <MovieModal />
        </main>
    );
}
