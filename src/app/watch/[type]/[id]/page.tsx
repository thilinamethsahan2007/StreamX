'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { getMoviePlayers, getTvShowPlayers } from '@/lib/players';
import { useState, useEffect } from 'react';
import CustomPlayer from '@/components/watch/CustomPlayer';

interface MovieDetails {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
}

interface EpisodeDetails {
    name: string;
}

export default function WatchPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { type, id } = params as { type: string; id: string };

    const season = searchParams.get('season') || '1';
    const episode = searchParams.get('episode') || '1';

    const [isLoading, setIsLoading] = useState(true);
    const [metadata, setMetadata] = useState<{
        title: string;
        poster: string;
        episodeTitle?: string;
    } | null>(null);

    const players = type === 'movie'
        ? getMoviePlayers(id)
        : getTvShowPlayers(id, parseInt(season), parseInt(episode));

    const player = players[0]; // Only one player (VidSrc v3)

    // Fetch metadata for watch history
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const endpoint = type === 'movie'
                    ? `https://api.themoviedb.org/3/movie/${id}`
                    : `https://api.themoviedb.org/3/tv/${id}`;

                const response = await fetch(endpoint, {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
                    },
                });

                const data: MovieDetails = await response.json();

                let episodeTitle;
                if (type === 'tv') {
                    // Fetch episode title
                    const episodeResponse = await fetch(
                        `https://api.themoviedb.org/3/tv/${id}/season/${season}/episode/${episode}`,
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
                            },
                        }
                    );
                    const episodeData: EpisodeDetails = await episodeResponse.json();
                    episodeTitle = episodeData.name;
                }

                setMetadata({
                    title: data.title || data.name || 'Unknown',
                    poster: data.poster_path || '',
                    episodeTitle,
                });
            } catch (error) {
                console.error('Failed to fetch metadata:', error);
            }
        };

        fetchMetadata();
    }, [id, type, season, episode]);

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
                    title={metadata?.title}
                    poster={metadata?.poster}
                    type={type as 'movie' | 'tv'}
                    episodeTitle={metadata?.episodeTitle}
                />
            </div>
        </div>
    );
}
