import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export interface MyListItem {
    id: number;
    type: 'movie' | 'tv';
    title: string;
    poster: string;
    releaseDate?: string;
    addedAt: number;
}

const STORAGE_KEY = 'streamx_my_list';

export function useMyList() {
    const { user } = useAuth();
    const [list, setList] = useState<MyListItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Load list from Supabase or localStorage
    useEffect(() => {
        const loadList = async () => {
            setLoading(true);
            if (user) {
                // Load from Supabase
                const { data, error } = await supabase
                    .from('my_list')
                    .select('*')
                    .eq('username', user.username)
                    .order('added_at', { ascending: false });

                if (data) {
                    setList(data.map(item => ({
                        id: item.media_id,
                        type: item.media_type as 'movie' | 'tv',
                        title: item.title,
                        poster: item.poster_path,
                        releaseDate: item.release_date,
                        addedAt: new Date(item.added_at).getTime(),
                    })));
                }
            } else {
                // Load from localStorage
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (Array.isArray(parsed)) {
                            setList(parsed);
                        } else {
                            console.error('Stored list is not an array, resetting');
                            setList([]);
                            localStorage.removeItem(STORAGE_KEY);
                        }
                    } catch (error) {
                        console.error('Failed to parse my list:', error);
                        setList([]);
                    }
                }
            }
            setLoading(false);
        };

        loadList();
    }, [user]);

    const isInList = (id: number, type: 'movie' | 'tv') => {
        if (!Array.isArray(list)) return false;
        return list.some(item => item.id === id && item.type === type);
    };

    const addToList = async (item: Omit<MyListItem, 'addedAt'>) => {
        const newItem = { ...item, addedAt: Date.now() };

        if (user) {
            // Add to Supabase
            const { error } = await supabase.from('my_list').insert({
                username: user.username,
                media_id: item.id,
                media_type: item.type,
                title: item.title,
                poster_path: item.poster,
                release_date: item.releaseDate,
            });

            if (!error) {
                setList(prev => [newItem, ...prev]);
            }
        } else {
            // Add to localStorage
            setList(prev => {
                const updated = [newItem, ...prev];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });
        }
    };

    const removeFromList = async (id: number, type: 'movie' | 'tv') => {
        if (user) {
            // Remove from Supabase
            const { error } = await supabase
                .from('my_list')
                .delete()
                .match({ username: user.username, media_id: id, media_type: type });

            if (!error) {
                setList(prev => prev.filter(item => !(item.id === id && item.type === type)));
            }
        } else {
            // Remove from localStorage
            setList(prev => {
                const filtered = prev.filter(item => !(item.id === id && item.type === type));
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
                return filtered;
            });
        }
    };

    const addMultipleToList = async (items: Omit<MyListItem, 'addedAt'>[]) => {
        const newItems = items.map(item => ({ ...item, addedAt: Date.now() }));

        if (user) {
            // Add to Supabase (Upsert for bulk)
            const { error } = await supabase.from('my_list').upsert(
                items.map(item => ({
                    username: user.username,
                    media_id: item.id,
                    media_type: item.type,
                    title: item.title,
                    poster_path: item.poster,
                    release_date: item.releaseDate,
                })),
                { onConflict: 'username, media_id, media_type' }
            );

            if (!error) {
                setList(prev => {
                    // Merge and deduplicate
                    const combined = [...newItems, ...prev];
                    const unique = Array.from(new Map(combined.map(item => [`${item.id}-${item.type}`, item])).values());
                    return unique.sort((a, b) => b.addedAt - a.addedAt);
                });
            }
        } else {
            // Add to localStorage
            setList(prev => {
                const combined = [...newItems, ...prev];
                const unique = Array.from(new Map(combined.map(item => [`${item.id}-${item.type}`, item])).values());
                const sorted = unique.sort((a, b) => b.addedAt - a.addedAt);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
                return sorted;
            });
        }
    };

    return {
        list,
        loading,
        isInList,
        addToList,
        addMultipleToList,
        removeFromList,
    };
}
