import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export interface WatchHistoryItem {
    id: number;
    type: 'movie' | 'tv';
    title: string;
    poster: string;
    timestamp: number;
    progress: number;
    duration: number;
    season?: number;
    episode?: number;
    episodeTitle?: string;
}

const STORAGE_KEY = 'streamx_watch_history';
const MAX_HISTORY_ITEMS = 50;

export function useWatchHistory() {
    const { user } = useAuth();
    const [history, setHistory] = useState<WatchHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Load history from Supabase or localStorage
    useEffect(() => {
        const loadHistory = async () => {
            setLoading(true);
            if (user) {
                // Load from Supabase
                const { data } = await supabase
                    .from('watch_history')
                    .select('*')
                    .eq('username', user.username)
                    .order('updated_at', { ascending: false })
                    .limit(MAX_HISTORY_ITEMS);

                if (data) {
                    setHistory(data.map(item => ({
                        id: item.media_id,
                        type: item.media_type as 'movie' | 'tv',
                        title: item.title,
                        poster: item.poster_path,
                        timestamp: item.timestamp,
                        progress: item.progress,
                        duration: item.duration,
                        season: item.season_number,
                        episode: item.episode_number,
                        episodeTitle: item.episode_title,
                    })));
                }
            } else {
                // Load from localStorage
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (Array.isArray(parsed)) {
                            setHistory(parsed);
                        } else {
                            console.error('Stored history is not an array, resetting');
                            setHistory([]);
                            localStorage.removeItem(STORAGE_KEY);
                        }
                    } catch (error) {
                        console.error('Failed to parse watch history:', error);
                        setHistory([]);
                    }
                }
            }
            setLoading(false);
        };

        loadHistory();
    }, [user]);

    // Add or update item in history
    const addToHistory = async (item: WatchHistoryItem) => {
        // Optimistic update
        setHistory(prev => {
            const filtered = prev.filter(h => !(h.id === item.id && h.type === item.type));
            return [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        });

        if (user) {
            // Sync with Supabase
            await supabase.from('watch_history').upsert({
                username: user.username,
                media_id: item.id,
                media_type: item.type,
                title: item.title,
                poster_path: item.poster,
                timestamp: item.timestamp,
                progress: item.progress,
                duration: item.duration,
                season_number: item.season,
                episode_number: item.episode,
                episode_title: item.episodeTitle,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'username, media_id, media_type' });
        } else {
            // Sync with localStorage
            setHistory(prev => {
                const filtered = prev.filter(h => !(h.id === item.id && h.type === item.type));
                const updated = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });
        }
    };

    // Get specific item progress
    const getProgress = (id: number, type: 'movie' | 'tv'): WatchHistoryItem | null => {
        return history.find(h => h.id === id && h.type === type) || null;
    };

    // Remove item from history
    const removeFromHistory = async (id: number, type: 'movie' | 'tv') => {
        if (user) {
            await supabase
                .from('watch_history')
                .delete()
                .match({ username: user.username, media_id: id, media_type: type });

            setHistory(prev => prev.filter(h => !(h.id === id && h.type === type)));
        } else {
            setHistory(prev => {
                const filtered = prev.filter(h => !(h.id === id && h.type === type));
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
                return filtered;
            });
        }
    };

    // Clear all history
    const clearHistory = async () => {
        if (user) {
            // Ideally we'd have a backend endpoint or policy for this, 
            // but for now we can iterate or just clear local state if RLS allows bulk delete
            // RLS usually requires specific rows, so bulk delete might need a function
            // For now, let's just clear local state and warn
            console.warn('Clear history not fully implemented for Supabase backend yet');
            setHistory([]);
        } else {
            setHistory([]);
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    // Get recent history (for Continue Watching row)
    const getRecentHistory = (limit = 10): WatchHistoryItem[] => {
        return history.slice(0, limit);
    };

    return {
        history,
        loading,
        addToHistory,
        getProgress,
        removeFromHistory,
        clearHistory,
        getRecentHistory,
    };
}
