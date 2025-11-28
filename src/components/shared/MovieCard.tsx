'use client';

import { getImageUrl, isContentReleased } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';
import { Movie } from 'tmdb-ts';
import { motion } from 'framer-motion';
import { Star, Play, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Badge from './Badge';

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const openModal = useModalStore((state) => state.openModal);
    const [imageError, setImageError] = useState(false);

    // Handle both movies and TV shows
    const isTV = !!(movie as any).name;
    const title = isTV ? (movie as any).name : movie.title;
    const releaseDate = isTV ? (movie as any).first_air_date : movie.release_date;

    const posterUrl = getImageUrl(movie.poster_path || movie.backdrop_path, 'w500');

    // Mock genres for list view (since we only have genre_ids)
    // In a real app, we'd map these IDs to names using a context or store
    const genres = ["Drama", "Action", "Sci-Fi"];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
                scale: 1.2,
                zIndex: 50,
                transition: { duration: 0.3, delay: 0.4 } // Delay to prevent accidental triggers
            }}
            className="relative aspect-[2/3] cursor-pointer group rounded-md bg-[#181818] shadow-xl"
            onClick={() => openModal(movie)}
            onKeyDown={(e) => e.key === 'Enter' && openModal(movie)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${title}`}
        >
            {/* Movie Poster */}
            <div className="relative h-full w-full overflow-hidden rounded-md">
                {!imageError ? (
                    <img
                        src={posterUrl}
                        alt={title}
                        onError={() => setImageError(true)}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-500 text-xs text-center px-2">{title}</span>
                    </div>
                )}
            </div>

            {/* Expanded Content - Visible on Hover */}
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                whileHover={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2, delay: 0.4 }}
                className="absolute top-full left-0 right-0 bg-[#181818] p-3 rounded-b-md shadow-xl z-50 -mt-1 hidden group-hover:block"
            >
                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                        <button
                            className="bg-white rounded-full p-1.5 hover:bg-gray-200 transition flex items-center justify-center"
                            title="Play"
                        >
                            <Play className="h-4 w-4 fill-black text-black" />
                        </button>
                    </div>

                    <button
                        className="border-2 border-gray-500 rounded-full p-1.5 hover:border-white transition flex items-center justify-center bg-[#2a2a2a]/60"
                        title="More Info"
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal(movie);
                        }}
                    >
                        <ChevronDown className="h-4 w-4 text-white" />
                    </button>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-semibold text-gray-300 mb-2">
                    {movie.vote_average && movie.vote_average > 0 && (
                        <span className="text-green-400 font-bold">
                            {Math.round(movie.vote_average * 10)}% Match
                        </span>
                    )}

                    <span className="border border-gray-500 px-1 text-[10px] text-gray-400">
                        {movie.adult ? '18+' : '13+'}
                    </span>

                    {releaseDate && (
                        <span>{releaseDate.split('-')[0]}</span>
                    )}

                    <span className="border border-gray-500 px-1 text-[10px] text-gray-400 rounded-sm">HD</span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-1.5">
                    {genres.slice(0, 3).map((genre, i) => (
                        <span key={i} className="text-[10px] text-white flex items-center">
                            {genre}
                            {i < 2 && <span className="text-gray-500 mx-1">•</span>}
                        </span>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
