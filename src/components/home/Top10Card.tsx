'use client';

import { getImageUrl, isContentReleased } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';
import { Movie } from 'tmdb-ts';
import { motion } from 'framer-motion';
import { Star, Play, Clock } from 'lucide-react';
import { useState } from 'react';

interface Top10CardProps {
    movie: Movie;
    ranking: number;
}

export default function Top10Card({ movie, ranking }: Top10CardProps) {
    const openModal = useModalStore((state) => state.openModal);
    const [imageError, setImageError] = useState(false);

    const isTV = !!(movie as any).name;
    const title = isTV ? (movie as any).name : movie.title;
    const releaseDate = isTV ? (movie as any).first_air_date : movie.release_date;
    const posterUrl = getImageUrl(movie.poster_path || movie.backdrop_path, 'w500');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{
                scale: 1.05,
                zIndex: 10,
                transition: { duration: 0.2 }
            }}
            className="relative h-[350px] min-w-[280px] cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#e50914] rounded-md"
            onClick={() => openModal(movie)}
            onKeyDown={(e) => e.key === 'Enter' && openModal(movie)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${title}`}
        >
            {/* Ranking Number */}
            <div className="absolute left-0 bottom-0 z-10 pointer-events-none">
                <svg width="120" height="180" viewBox="0 0 120 180" className="drop-shadow-2xl">
                    <text
                        x="10"
                        y="160"
                        fontSize="160"
                        fontWeight="900"
                        fill="transparent"
                        stroke="#2a2a2a"
                        strokeWidth="8"
                        fontFamily="Arial, sans-serif"
                    >
                        {ranking}
                    </text>
                </svg>
            </div>

            {/* Movie Poster */}
            <div className="relative h-full w-full ml-16">
                {!imageError ? (
                    <img
                        src={posterUrl}
                        alt={title}
                        onError={() => setImageError(true)}
                        className="h-full w-full rounded-md object-cover transition-all duration-300 group-hover:brightness-50"
                    />
                ) : (
                    <div className="h-full w-full rounded-md bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-500 text-sm text-center px-4">{title}</span>
                    </div>
                )}

                {/* Overlay with info and play button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex flex-col justify-between p-4">
                    {/* Play/Coming Soon button - top center */}
                    <div className="flex justify-center">
                        {isContentReleased(releaseDate) ? (
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform translate-y-[-20px] group-hover:translate-y-0 transition-transform duration-300">
                                <Play className="h-6 w-6 fill-white text-white" />
                            </div>
                        ) : (
                            <div className="bg-gray-600/40 backdrop-blur-sm rounded-full p-3 transform translate-y-[-20px] group-hover:translate-y-0 transition-transform duration-300">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Info - bottom */}
                    <div>
                        <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">
                            {title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                            {movie.vote_average && movie.vote_average > 0 && (
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    <span>{movie.vote_average.toFixed(1)}</span>
                                </div>
                            )}
                            {releaseDate && (
                                <span>{releaseDate.split('-')[0]}</span>
                            )}
                            {isTV && (
                                <span className="text-xs bg-red-600 px-1.5 py-0.5 rounded">TV</span>
                            )}
                            {!isContentReleased(releaseDate) && (
                                <span className="text-xs bg-orange-600 px-1.5 py-0.5 rounded">Coming Soon</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
