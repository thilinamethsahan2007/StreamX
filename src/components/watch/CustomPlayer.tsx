'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useWatchHistory } from '@/hooks/useWatchHistory';

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
    const [streamUrl, setStreamUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const { addToHistory, getProgress } = useWatchHistory();

    useEffect(() => {
        const fetchStream = async () => {
            try {
                const params = new URLSearchParams({ tmdbId });
                if (season) params.append('season', season);
                if (episode) params.append('episode', episode);

                const res = await fetch(`/api/stream?${params.toString()}`);
                const data = await res.json();

                if (data.streamUrl) {
                    setStreamUrl(data.streamUrl);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to fetch stream", err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStream();
    }, [tmdbId, season, episode]);

    // Resume from saved progress
    useEffect(() => {
        if (videoRef.current && type && title && poster) {
            const savedProgress = getProgress(parseInt(tmdbId), type);
            if (savedProgress && savedProgress.progress > 0) {
                videoRef.current.currentTime = savedProgress.progress;
            }
        }
    }, [streamUrl, tmdbId, type, title, poster, getProgress]);

    // Save progress periodically
    useEffect(() => {
        if (isPlaying && videoRef.current && type && title && poster) {
            console.log('✅ Starting watch history tracking for:', title);
            saveIntervalRef.current = setInterval(() => {
                if (videoRef.current) {
                    const historyItem = {
                        id: parseInt(tmdbId),
                        type,
                        title,
                        poster,
                        timestamp: Date.now(),
                        progress: videoRef.current.currentTime,
                        duration: videoRef.current.duration || 0,
                        season: season ? parseInt(season) : undefined,
                        episode: episode ? parseInt(episode) : undefined,
                        episodeTitle,
                    };
                    console.log('💾 Saving progress:', historyItem);
                    addToHistory(historyItem);
                }
            }, 10000); // Save every 10 seconds
        } else if (isPlaying) {
            console.warn('⚠️ Cannot track history - missing:', {
                type: !type,
                title: !title,
                poster: !poster,
                videoRef: !videoRef.current
            });
        }

        return () => {
            if (saveIntervalRef.current) {
                clearInterval(saveIntervalRef.current);
                console.log('🛑 Stopped watch history tracking');
            }
        };
    }, [isPlaying, tmdbId, type, title, poster, season, episode, episodeTitle, addToHistory]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

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

        window.addEventListener('beforeunload', blockPopup);
        window.addEventListener('open', blockPopup);

        return () => {
            window.open = originalWindowOpen;
            window.removeEventListener('beforeunload', blockPopup);
            window.removeEventListener('open', blockPopup);
        };
    }, []);

    // If no direct stream URL, use iframe fallback
    if (error || !streamUrl) {
        // Track that user watched this (even without exact progress)
        useEffect(() => {
            if (type && title && poster) {
                console.log('📺 Using iframe fallback for:', title);
                // Add to history after 10 seconds (assume they're watching)
                const timer = setTimeout(() => {
                    console.log('💾 Saving iframe watch to history');
                    addToHistory({
                        id: parseInt(tmdbId),
                        type,
                        title,
                        poster,
                        timestamp: Date.now(),
                        progress: 0, // Can't track exact progress in iframe
                        duration: 1, // Placeholder to avoid >95% auto-removal
                        season: season ? parseInt(season) : undefined,
                        episode: episode ? parseInt(episode) : undefined,
                        episodeTitle,
                    });
                }, 10000); // Wait 10 seconds to confirm they're watching

                return () => clearTimeout(timer);
            } else {
                console.warn('⚠️ Cannot track iframe history - missing metadata:', {
                    type: !type,
                    title: !title,
                    poster: !poster
                });
            }
        }, [type, title, poster, tmdbId, season, episode, episodeTitle, addToHistory]);

        return (
            <div className="relative w-full h-full bg-black">
                <iframe
                    src={fallbackUrl}
                    className="h-full w-full border-none"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                    title="Video Player"
                />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative w-full h-full bg-black group">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                    <LoadingSpinner size="lg" />
                </div>
            )}

            <video
                ref={videoRef}
                src={streamUrl}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls={false} // Custom controls
            />

            {/* Custom Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="hover:text-[#e50914] transition">
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </button>
                        <button onClick={toggleMute} className="hover:text-[#e50914] transition">
                            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                        </button>
                    </div>

                    <button onClick={toggleFullscreen} className="hover:text-[#e50914] transition">
                        {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
