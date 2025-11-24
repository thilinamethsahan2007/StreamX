'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { getMoviePlayers, getTvShowPlayers } from '@/lib/players';
import { useState } from 'react';
import CustomPlayer from '@/components/watch/CustomPlayer';

export default function WatchPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { type, id } = params as { type: string; id: string };

    const season = searchParams.get('season') || '1';
    const episode = searchParams.get('episode') || '1';

    const [isLoading, setIsLoading] = useState(true);

    const players = type === 'movie'
        ? getMoviePlayers(id)
        : getTvShowPlayers(id, parseInt(season), parseInt(episode));

    const player = players[0]; // Only one player (VidSrc v3)

    return (
        <div className="h-screen w-screen bg-black flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#141414] px-4 py-3 border-b border-gray-800 z-20">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white hover:text-gray-300 transition focus:outline-none focus:ring-2 focus:ring-[#e50914] rounded px-2 py-1"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-semibold">Back to Browse</span>
                </button>
                {type === 'tv' && (
                    <span className="text-gray-400 text-sm">
                        Season {season} • Episode {episode}
                    </span>
                )}
            </div>

            {/* Player Area */}
            <div className="flex-1 bg-black relative">
                <CustomPlayer
                    tmdbId={id}
                    season={type === 'tv' ? season : undefined}
                    episode={type === 'tv' ? episode : undefined}
                    fallbackUrl={player.source}
                />
            </div>
        </div>
    );
}
