import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface Friend {
    username: string;
    status: 'pending' | 'accepted' | 'blocked';
    direction: 'incoming' | 'outgoing'; // For pending requests
}

export interface SearchResult {
    username: string;
    isFriend: boolean;
    hasPendingRequest: boolean;
}

export function useSocial() {
    const { user } = useAuth();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFriends = async () => {
        if (!user) return;
        setLoading(true);

        // Fetch all friendships where user is requester or addressee
        const { data, error } = await supabase
            .from('friendships')
            .select('*')
            .or(`requester.eq.${user.username},addressee.eq.${user.username}`);

        if (error) {
            console.error('Error fetching friends:', error);
            setLoading(false);
            return;
        }

        const formattedFriends: Friend[] = data.map((f: any) => {
            const isRequester = f.requester === user.username;
            const otherUser = isRequester ? f.addressee : f.requester;

            let direction: 'incoming' | 'outgoing' = 'outgoing';
            if (f.status === 'pending') {
                direction = isRequester ? 'outgoing' : 'incoming';
            }

            return {
                username: otherUser,
                status: f.status,
                direction
            };
        });

        setFriends(formattedFriends);
        setLoading(false);
    };

    const sendFriendRequest = async (targetUsername: string) => {
        if (!user) return;

        const { error } = await supabase
            .from('friendships')
            .insert({
                requester: user.username,
                addressee: targetUsername,
                status: 'pending'
            });

        if (error) throw error;
        await fetchFriends();
    };

    const acceptFriendRequest = async (targetUsername: string) => {
        if (!user) return;

        // Find the request where I am the addressee
        const { error } = await supabase
            .from('friendships')
            .update({ status: 'accepted' })
            .eq('requester', targetUsername)
            .eq('addressee', user.username);

        if (error) throw error;
        await fetchFriends();
    };

    const removeFriend = async (targetUsername: string) => {
        if (!user) return;

        const { error } = await supabase
            .from('friendships')
            .delete()
            .or(`and(requester.eq.${user.username},addressee.eq.${targetUsername}),and(requester.eq.${targetUsername},addressee.eq.${user.username})`);

        if (error) throw error;
        await fetchFriends();
    };

    const searchUsers = async (query: string): Promise<SearchResult[]> => {
        if (!query || query.length < 2) return [];

        const { data, error } = await supabase
            .from('users')
            .select('username')
            .ilike('username', `%${query}%`)
            .neq('username', user?.username || '') // Exclude self
            .limit(10);

        if (error) {
            console.error('Error searching users:', error);
            return [];
        }

        // Map results to include friendship status
        return data.map((u: any) => {
            const friend = friends.find(f => f.username === u.username);
            return {
                username: u.username,
                isFriend: friend?.status === 'accepted',
                hasPendingRequest: friend?.status === 'pending'
            };
        });
    };

    useEffect(() => {
        fetchFriends();
    }, [user]);

    return {
        friends,
        loading,
        fetchFriends,
        sendFriendRequest,
        acceptFriendRequest,
        removeFriend,
        searchUsers
    };
}
