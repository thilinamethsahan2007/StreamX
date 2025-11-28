import { useEffect, useState } from 'react';

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
    const [history, setHistory] = useState<WatchHistoryItem[]>([]);

    // Load history from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (error) {
                console.error('Failed to parse watch history:', error);
            }
        }
    }, []);

    // Add or update item in history
    const addToHistory = (item: WatchHistoryItem) => {
        setHistory(prev => {
            // Remove existing item with same id and type
            const filtered = prev.filter(h => !(h.id === item.id && h.type === item.type));

            // Auto-remove if >95% watched
            const progressPercent = (item.progress / item.duration) * 100;
            if (progressPercent >= 95) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
                return filtered;
            }

            // Add new item at the beginning
            const updated = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    // Get specific item progress
    const getProgress = (id: number, type: 'movie' | 'tv'): WatchHistoryItem | null => {
        return history.find(h => h.id === id && h.type === type) || null;
    };

    // Remove item from history
    const removeFromHistory = (id: number, type: 'movie' | 'tv') => {
        setHistory(prev => {
            const filtered = prev.filter(h => !(h.id === id && h.type === type));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            return filtered;
        });
    };

    // Clear all history
    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    // Get recent history (for Continue Watching row)
    const getRecentHistory = (limit = 10): WatchHistoryItem[] => {
        return history.slice(0, limit);
    };

    return {
        history,
        addToHistory,
        getProgress,
        removeFromHistory,
        clearHistory,
        getRecentHistory,
    };
}
