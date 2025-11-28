'use client';

import { getImageUrl, isContentReleased } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';
import { Movie } from 'tmdb-ts';
import { motion } from 'framer-motion';
import { Star, Play, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Badge from './Badge';
import { createPortal } from 'react-dom';
import { useRef, useEffect } from 'react';

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const openModal = useModalStore((state) => state.openModal);
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const cardRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle both movies and TV shows
    const isTV = !!(movie as any).name;
    const title = isTV ? (movie as any).name : movie.title;
    const releaseDate = isTV ? (movie as any).first_air_date : movie.release_date;

    const posterUrl = getImageUrl(movie.poster_path || movie.backdrop_path, 'w500');

    // Mock genres
    const genres = ["Drama", "Action", "Sci-Fi"];

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (cardRef.current) {
                const rect = cardRef.current.getBoundingClientRect();
                setCoords({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                });
                setIsHovered(true);
            }
        }, 500); // 500ms delay like Netflix
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsHovered(false);
    };

    return (
        <>
            {/* Static Card (Placeholder) */}
            <div
                ref={cardRef}
                className="relative aspect-[2/3] rounded-md overflow-hidden cursor-pointer bg-[#181818]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
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

            {/* Portal Hover Card */}
            {isHovered && typeof document !== 'undefined' && createPortal(
                <motion.div
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'fixed',
                        top: coords.top,
                        left: coords.left,
                        width: coords.width,
                        height: coords.height, // Start with same height, content expands below
                        zIndex: 9999,
                        transformOrigin: 'center center'
                    }}
                    className="bg-[#181818] rounded-md shadow-2xl cursor-pointer"
                    onMouseLeave={handleMouseLeave}
                    onClick={() => openModal(movie)}
                >
                    {/* Image Section */}
                    <div className="relative w-full h-full rounded-t-md overflow-hidden">
                        <img
                            src={posterUrl}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
                    </div>

                    {/* Info Section (Appended below) */}
                    <div className="absolute top-full left-0 right-0 bg-[#181818] p-3 rounded-b-md shadow-xl -mt-1">
                        {/* Action Buttons */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-2">
                                <button
                                    className="bg-white rounded-full p-1.5 hover:bg-gray-200 transition flex items-center justify-center"
                                    title="Play"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Add play logic here if needed, or just let card click handle it
                                    }}
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
                    </div>
                </motion.div>,
                document.body
            )}
        </>
    );
}
