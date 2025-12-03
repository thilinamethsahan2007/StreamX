'use client';

import { useState, useEffect, useRef } from 'react';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { useWatchParty } from '@/context/WatchPartyContext';
import WatchPartySidebar from '@/components/watch-party/WatchPartySidebar';
import { Users } from 'lucide-react';

interface CustomPlayerProps {
    tmdbId: string;
    season?: string;
    episode?: string;
    fallbackUrl: string;
    // For watch history
    title?: string;
    poster?: string;
    type?: 'movie' | 'tv';
    episodeTitle?: string;
}

export default function CustomPlayer({
    tmdbId,
    season,
    episode,
    fallbackUrl,
    title,
    poster,
    type,
    episodeTitle
}: CustomPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    // We'll treat the iframe as "playing" for history purposes
    useEffect(() => {
        setIsPlaying(true);
        return () => setIsPlaying(false);
    }, []);

    const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const { addToHistory } = useWatchHistory();



    // Save progress periodically (iframe mode)
    useEffect(() => {
        if (isPlaying && type && title && poster) {
            console.log('✅ Starting watch history tracking for:', title);
            saveIntervalRef.current = setInterval(() => {
                const historyItem = {
                    id: parseInt(tmdbId),
                    type,
                    title,
                    poster,
                    timestamp: Date.now(),
                    progress: 0, // Can't track exact progress in iframe
                    duration: 0,
                    season: season ? parseInt(season) : undefined,
                    episode: episode ? parseInt(episode) : undefined,
                    episodeTitle,
                };
                console.log('💾 Saving progress:', historyItem);
                addToHistory(historyItem);
            }, 10000); // Save every 10 seconds
        }

        return () => {
            if (saveIntervalRef.current) {
                clearInterval(saveIntervalRef.current);
                console.log('🛑 Stopped watch history tracking');
            }
        };
    }, [isPlaying, tmdbId, type, title, poster, season, episode, episodeTitle, addToHistory]);



    // Popup blocker - blocks popups from iframe
    useEffect(() => {
        // Override window.open to block popups
        const originalWindowOpen = window.open;
        window.open = function (...args) {
            console.log('Blocked popup attempt:', args);
            return null;
        };

        // Block popup events
        const blockPopup = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Blocked popup event');
        };

        window.addEventListener('open', blockPopup);

        return () => {
            window.open = originalWindowOpen;
            window.removeEventListener('open', blockPopup);
        };
    }, []);

    const { isActive, isHost, videoState, updateVideoState, createParty } = useWatchParty();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Sync with Watch Party
    useEffect(() => {
        if (!isActive) return;

        // If I am NOT the host, I should sync to the host's state
        if (!isHost) {
            // Note: We can't easily control the iframe content (cross-origin), 
            // but we can at least show a "Syncing..." overlay or similar if we had a custom player.
            // For this iframe-based player, true sync is hard without postMessage support from the embed provider.
            // However, we can simulate "Play/Pause" by showing/hiding an overlay or using the iframe API if available.

            // For this prototype, we will just log the sync state.
            console.log('Syncing video state:', videoState);
        }
    }, [isActive, isHost, videoState]);

    // If I am the host, I should update the state (mocking this since we can't capture iframe events easily)
    useEffect(() => {
        if (isActive && isHost) {
            // Mock update every 5 seconds
            const interval = setInterval(() => {
                updateVideoState(true, Date.now());
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isActive, isHost]);

    return (
        <div className="relative w-full h-full bg-black">
            <iframe
                ref={iframeRef}
                src={fallbackUrl}
                className="h-full w-full border-none"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title="Video Player"
            />
            {isActive ? (
                <WatchPartySidebar />
            ) : (
                <button
                    onClick={async () => {
                        // Create party for current media
                        // We need mediaType and mediaId. 
                        // CustomPlayer props: tmdbId, type ('movie' | 'tv')
                        if (type && tmdbId) {
                            try {
                                await createParty(type, parseInt(tmdbId));
                                // No need to push router, we are already here. 
                                // createParty sets state, so isActive becomes true, sidebar appears.
                            } catch (err) {
                                console.error(err);
                                alert('Please login to start a party');
                            }
                        }
                    }}
                    className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-purple-600/80 hover:bg-purple-600 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all shadow-lg font-bold text-sm"
                >
                    <Users className="w-4 h-4" /> Start Party
                </button>
            )}
        </div>
    );
}
