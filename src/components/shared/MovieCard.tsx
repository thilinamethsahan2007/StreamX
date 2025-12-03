'use client';

import { getImageUrl, isContentReleased } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';
import { Movie } from 'tmdb-ts';
import { motion } from 'framer-motion';
import { Star, Play, Clock, ChevronDown, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import Badge from './Badge';
import { useMyList } from '@/hooks/useMyList';

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const openModal = useModalStore((state) => state.openModal);
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { isInList, addToList, removeFromList } = useMyList();

    // Handle both movies and TV shows
    const isTV = !!(movie as any).name;
    const title = isTV ? (movie as any).name : movie.title;
    const releaseDate = isTV ? (movie as any).first_air_date : movie.release_date;
    const inList = isInList(movie.id, isTV ? 'tv' : 'movie');

    const posterUrl = getImageUrl(movie.poster_path || movie.backdrop_path, 'w500');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{
                scale: 1.15,
                zIndex: 50,
                transition: { duration: 0.3, delay: 0.5 }
            }}
            className="relative aspect-[2/3] cursor-pointer group rounded-2xl overflow-hidden bg-[#1a1a1a]"
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
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            ) : (
                <div className="h-full w-full flex items-center justify-center">
                    <span className="text-gray-500 text-xs text-center px-2">{title}</span>
                </div>
            )}

            {/* Glass Overlay - Shows on hover */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col justify-end p-4"
            >
                {/* Action Buttons */}
                <div className="flex items-center gap-3 mb-3">
                    {isContentReleased(releaseDate) ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className="bg-white rounded-full p-2.5 hover:scale-110 transition-transform shadow-lg"
                        >
                            <Play className="h-4 w-4 fill-black text-black" />
                        </button>
                    ) : (
                        <button className="bg-white/20 backdrop-blur-md rounded-full p-2.5">
                            <Clock className="h-4 w-4 text-white" />
                        </button>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (inList) {
                                removeFromList(movie.id, isTV ? 'tv' : 'movie');
                            } else {
                                addToList({
                                    id: movie.id,
                                    type: isTV ? 'tv' : 'movie',
                                    title: title || '',
                                    poster: movie.poster_path || '',
                                    releaseDate: releaseDate,
                                });
                            }
                        }}
                        className="glass-button rounded-full p-2.5 hover:bg-white/20"
                    >
                        {inList ? (
                            <Check className="h-4 w-4 text-white" />
                        ) : (
                            <Plus className="h-4 w-4 text-white" />
                        )}
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal(movie);
                        }}
                        className="ml-auto glass-button rounded-full p-2.5 hover:bg-white/20"
                    >
                        <ChevronDown className="h-4 w-4 text-white" />
                    </button>
                </div>

                {/* Title and Info */}
                <h3 className="text-white font-bold text-base line-clamp-1 mb-1.5 tracking-tight">
                    {title}
                </h3>

                <div className="flex items-center gap-2 text-xs font-medium text-gray-200 mb-2">
                    {movie.vote_average && movie.vote_average > 0 && (
                        <span className="text-green-400">{Math.round(movie.vote_average * 10)}% Match</span>
                    )}
                    {releaseDate && (
                        <span>{releaseDate.split('-')[0]}</span>
                    )}
                    <span className="border border-white/30 px-1 rounded text-[10px]">HD</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                    {releaseDate && new Date(releaseDate).getFullYear() === new Date().getFullYear() && (
                        <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">New</span>
                    )}
                    {!isContentReleased(releaseDate) && (
                        <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">Soon</span>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
