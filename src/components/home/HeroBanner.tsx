'use client';

import { useTrendingMovies } from '@/hooks/useMovies';
import { getImageUrl, isContentReleased } from '@/lib/utils';
import { Info, Play, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Movie } from 'tmdb-ts';
import { useModalStore } from '@/store/modalStore';
import { useRouter } from 'next/navigation';

export default function HeroBanner() {
    const { data: movies } = useTrendingMovies();
    const [movie, setMovie] = useState<Movie | null>(null);
    const openModal = useModalStore((state) => state.openModal);
    const router = useRouter();

    useEffect(() => {
        if (movies && movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            setMovie(randomMovie);
        }
    }, [movies]);

    if (!movie) return <div className="h-[60vh] sm:h-[70vh] md:h-[80vh] w-full bg-[#141414] animate-pulse" />;

    return (
        <div className="relative h-[60vh] sm:h-[70vh] md:h-[85vh] w-full">
            <div className="absolute inset-0">
                <img
                    src={getImageUrl(movie.backdrop_path, 'original')}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />

            <div className="relative z-10 flex h-full items-end px-4 md:px-16 pb-12 sm:pb-16 md:pb-24">
                <div className="max-w-2xl space-y-3 md:space-y-6">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-shadow">
                        {movie?.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg line-clamp-2 sm:line-clamp-3 md:line-clamp-4 text-shadow max-w-xl">
                        {movie?.overview}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                        {isContentReleased(movie?.release_date) ? (
                            <button
                                onClick={() => router.push(`/watch/movie/${movie.id}`)}
                                className="flex items-center justify-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-white text-black rounded font-bold hover:bg-white/90 transition text-sm md:text-base"
                            >
                                <Play className="h-5 w-5 md:h-6 md:w-6 fill-black" />
                                Play
                            </button>
                        ) : (
                            <button
                                disabled
                                className="flex items-center justify-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-gray-600/70 text-white rounded font-bold cursor-not-allowed text-sm md:text-base"
                            >
                                <Clock className="h-5 w-5 md:h-6 md:w-6" />
                                Coming Soon
                            </button>
                        )}
                        <button
                            onClick={() => movie && openModal(movie)}
                            className="flex items-center justify-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-gray-500/70 text-white rounded font-bold hover:bg-gray-500/50 transition text-sm md:text-base"
                        >
                            <Info className="h-5 w-5 md:h-6 md:w-6" />
                            More Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
