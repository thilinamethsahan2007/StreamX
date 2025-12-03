'use client';

import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { useWatchHistory, WatchHistoryItem } from '@/hooks/useWatchHistory';
import { getImageUrl } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ContinueWatchingRowProps {
    title?: string;
}

export default function ContinueWatchingRow({ title = "Continue Watching" }: ContinueWatchingRowProps) {
    const { getRecentHistory, removeFromHistory } = useWatchHistory();
    const history = getRecentHistory(10);
    const router = useRouter();

    if (history.length === 0) {
        return null; // Don't show if no history
    }

    const handlePlay = (item: WatchHistoryItem) => {
        const url = item.type === 'movie'
            ? `/watch/movie/${item.id}`
            : `/watch/tv/${item.id}?season=${item.season}&episode=${item.episode}`;
        router.push(url);
    };

    const handleRemove = (e: React.MouseEvent, item: WatchHistoryItem) => {
        e.stopPropagation();
        removeFromHistory(item.id, item.type);
    };


    return (
        <div className="space-y-4 px-4 md:px-8">
            <h2 className="text-xl md:text-2xl font-bold text-white">
                {title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {history.map((item) => (
                    <motion.div
                        key={`${item.type}-${item.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-[2/3] cursor-pointer group rounded-md overflow-hidden"
                        onClick={() => handlePlay(item)}
                    >
                        {/* Poster */}
                        <img
                            src={getImageUrl(item.poster, 'w500')}
                            alt={item.title}
                            className="h-full w-full object-cover"
                        />


                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3">
                            {/* Play Button */}
                            <button className="bg-white rounded-full p-3 mb-2 hover:bg-gray-200 transition">
                                <Play className="h-6 w-6 fill-black text-black" />
                            </button>

                            {/* Title */}
                            <h3 className="text-white font-semibold text-sm text-center line-clamp-2 mb-1">
                                {item.title}
                            </h3>

                            {/* Episode Info for TV */}
                            {item.type === 'tv' && item.season && item.episode && (
                                <p className="text-gray-300 text-xs">
                                    S{item.season} E{item.episode}
                                </p>
                            )}


                            {/* Remove Button */}
                            <button
                                onClick={(e) => handleRemove(e, item)}
                                className="absolute top-2 right-2 bg-black/70 rounded-full p-1 hover:bg-black transition"
                                aria-label="Remove from Continue Watching"
                            >
                                <X className="h-4 w-4 text-white" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
