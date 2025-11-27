'use client';

import { getImageUrl, isContentReleased } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';
import { Movie } from 'tmdb-ts';
import { motion } from 'framer-motion';
import { Star, Play, Clock } from 'lucide-react';
import { useState } from 'react';

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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{
                scale: 1.3,
                zIndex: 50,
                transition: { duration: 0.3, delay: 0.3 }
            }}
            className="relative aspect-[2/3] cursor-pointer group rounded-md overflow-hidden"
            onClick={() => openModal(movie)}
            onKeyDown={(e) => e.key === 'Enter' && openModal(movie)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${title}`}
        >
            {/* Movie Poster */}
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

            {/* Gradient Overlay - Always visible on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content - Shows on hover */}
            <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Play Button */}
                <div className="flex items-center gap-2 mb-2">
                    {isContentReleased(releaseDate) ? (
                        <button className="bg-white rounded-full p-2 hover:bg-gray-200 transition">
                            <Play className="h-4 w-4 fill-black text-black" />
                        </button>
                    ) : (
                        <button className="bg-gray-600/80 rounded-full p-2">
                            <Clock className="h-4 w-4 text-white" />
                        </button>
                    )}
                </div>

                {/* Title and Info */}
                <h3 className="text-white font-bold text-sm line-clamp-1 mb-1">
                    {title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-white">
                    {movie.vote_average && movie.vote_average > 0 && (
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-green-500 text-green-500" />
                            <span className="text-green-500 font-semibold">{Math.round(movie.vote_average * 10)}% Match</span>
                        </div>
                    )}
                    {releaseDate && (
                        <span className="text-gray-300">{releaseDate.split('-')[0]}</span>
                    )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1 mt-1">
                    {isTV && (
                        <span className="text-xs border border-gray-400 px-1 text-gray-300">TV</span>
                    )}
                    {!isContentReleased(releaseDate) && (
                        <span className="text-xs bg-orange-600 px-1.5 py-0.5 rounded">Coming Soon</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
