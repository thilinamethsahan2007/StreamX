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
            className="relative h-[200px] sm:h-[240px] md:h-[280px] min-w-[200px] sm:min-w-[240px] md:min-w-[280px] cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#e50914] rounded-md flex items-end"
            onClick={() => openModal(movie)}
            onKeyDown={(e) => e.key === 'Enter' && openModal(movie)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${title}`}
        >
            {/* Ranking Number - Netflix Style SVG */}
            <div className="absolute left-0 bottom-0 z-10 h-full w-1/2 flex items-end justify-center pointer-events-none">
                <svg
                    viewBox="0 0 100 150"
                    className="h-full w-full drop-shadow-2xl"
                    style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.8))' }}
                >
                    <text
                        x="50%"
                        y="100%"
                        fontSize="160"
                        fontWeight="900"
                        textAnchor="middle"
                        fill="#141414"
                        stroke="#595959"
                        strokeWidth="4"
                        fontFamily="Arial, sans-serif"
                        className="select-none"
                    >
                        {ranking}
                    </text>
                </svg>
            </div>

            {/* Movie Poster */}
            <div className="relative h-full w-[60%] ml-auto z-0">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex flex-col justify-between p-3">
                    {/* Play/Coming Soon button - top center */}
                    <div className="flex justify-center">
                        {isContentReleased(releaseDate) ? (
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 transform translate-y-[-20px] group-hover:translate-y-0 transition-transform duration-300">
                                <Play className="h-5 w-5 fill-white text-white" />
                            </div>
                        ) : (
                            <div className="bg-gray-600/40 backdrop-blur-sm rounded-full p-2 transform translate-y-[-20px] group-hover:translate-y-0 transition-transform duration-300">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Info - bottom */}
                    <div>
                        <h3 className="text-white font-bold text-xs line-clamp-2 mb-1">
                            {title}
                        </h3>
                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 mb-1">
                            {isTV && (
                                <span className="text-[10px] bg-red-600 text-white px-1 rounded">TV</span>
                            )}
                            <span className="text-[10px] bg-gray-700 text-white px-1 rounded">HD</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
