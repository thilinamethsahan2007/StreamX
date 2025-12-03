'use client';

import { Movie } from 'tmdb-ts';
import MovieCard from '../shared/MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface MovieRowProps {
    title: string;
    movies: Movie[];
    isLoading?: boolean;
    error?: Error | null;
}

export default function MovieRow({ title, movies, isLoading, error }: MovieRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (rowRef.current) {
            const scrollAmount = direction === 'left' ? -800 : 800;
            rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
                <ErrorMessage message="Failed to load movies" />
            </div>
        );
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
                <p className="text-gray-400 text-center py-8">No content available</p>
            </div>
        );
    }

    return (
        <div className="group relative space-y-4">
            <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>

            <div className="relative">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-r from-black/80 to-transparent opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#e50914]"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="h-8 w-8 text-white" />
                </button>

                {/* Movie Cards */}
                <div
                    ref={rowRef}
                    className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth pb-4"
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-l from-black/80 to-transparent opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#e50914]"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="h-8 w-8 text-white" />
                </button>
            </div>
        </div>
    );
}
