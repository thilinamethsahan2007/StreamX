'use client';

import { useRef, useState } from 'react';
import { Movie } from 'tmdb-ts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Top10Card from '@/components/home/Top10Card';
import { motion, AnimatePresence } from 'framer-motion';

interface Top10RowProps {
    title: string;
    movies: Movie[];
}

export default function Top10Row({ title, movies }: Top10RowProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scroll = (direction: 'left' | 'right') => {
        if (rowRef.current) {
            const scrollAmount = rowRef.current.clientWidth * 0.8;
            const newScrollLeft = direction === 'left'
                ? rowRef.current.scrollLeft - scrollAmount
                : rowRef.current.scrollLeft + scrollAmount;

            rowRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (rowRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    if (!movies || movies.length === 0) return null;

    const top10Movies = movies.slice(0, 10);

    return (
        <div className="group/row relative px-2 md:px-12 mb-4 md:mb-10">
            {/* Title */}
            <h2 className="text-sm sm:text-base md:text-xl font-semibold text-white mb-2 md:mb-4 px-2 md:px-0">
                {title}
            </h2>

            {/* Scroll Container */}
            <div className="relative">
                {/* Left Arrow */}
                <AnimatePresence>
                    {showLeftArrow && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center rounded-r"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-8 w-8 md:h-12 md:w-12" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Top 10 Row */}
                <div
                    ref={rowRef}
                    onScroll={handleScroll}
                    className="flex gap-1 md:gap-2 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth py-4 md:py-8 px-2 md:px-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {top10Movies.map((movie, index) => (
                        <div
                            key={movie.id}
                            className="flex-shrink-0"
                        >
                            <Top10Card movie={movie} ranking={index + 1} />
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <AnimatePresence>
                    {showRightArrow && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center rounded-l"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-8 w-8 md:h-12 md:w-12" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
