import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface WatchPartyContextType {
    partyId: string | null;
    isActive: boolean;
    isHost: boolean;
    participants: any[];
    messages: any[];
    videoState: {
        isPlaying: boolean;
        currentTime: number;
        lastUpdated: number;
    };
    createParty: (mediaType: string, mediaId: number) => Promise<string>;
    joinParty: (partyId: string) => Promise<void>;
    leaveParty: () => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    updateVideoState: (isPlaying: boolean, currentTime: number) => Promise<void>;
}

const WatchPartyContext = createContext<WatchPartyContextType | undefined>(undefined);

export function WatchPartyProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();
    // We need to use window.location because useSearchParams might not be available in all contexts or might cause hydration issues if not wrapped in Suspense
    // But for a client component provider, we can try to parse it from window if available, or use useSearchParams if we wrap it.
    // Let's use a simple useEffect to check window.location.search

    const [partyId, setPartyId] = useState<string | null>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [videoState, setVideoState] = useState({ isPlaying: false, currentTime: 0, lastUpdated: Date.now() });
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('partyId');
            if (id && user) {
                // Join the party if found in URL
                joinParty(id);
            }
        }
    }, [user]); // Run when user logs in or mounts

    // Subscribe to Realtime changes
    useEffect(() => {
        if (!partyId) return;

        const channel = supabase.channel(`party:${partyId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'watch_parties', filter: `id=eq.${partyId}` }, (payload: any) => {
                if (payload.new) {
                    setVideoState({
                        isPlaying: payload.new.is_playing,
                        currentTime: payload.new.video_timestamp,
                        lastUpdated: Date.now()
                    });
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'watch_party_participants', filter: `party_id=eq.${partyId}` }, () => {
                fetchParticipants();
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'watch_party_messages', filter: `party_id=eq.${partyId}` }, (payload: any) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        fetchParticipants();
        fetchMessages();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [partyId]);

    const fetchParticipants = async () => {
        if (!partyId) return;
        const { data } = await supabase.from('watch_party_participants').select('*, users(username)').eq('party_id', partyId);
        if (data) setParticipants(data);
    };

    const fetchMessages = async () => {
        if (!partyId) return;
        const { data } = await supabase.from('watch_party_messages').select('*').eq('party_id', partyId).order('created_at', { ascending: true });
        if (data) setMessages(data);
    };

    const createParty = async (mediaType: string, mediaId: number) => {
        if (!user) throw new Error('Must be logged in');

        const { data: party, error } = await supabase
            .from('watch_parties')
            .insert({
                host_id: user.username,
                media_type: mediaType,
                media_id: mediaId,
                status: 'active'
            })
            .select()
            .single();

        if (error) throw error;

        await joinParty(party.id);
        setIsHost(true);
        return party.id;
    };

    const joinParty = async (id: string) => {
        if (!user) throw new Error('Must be logged in');

        // Check if already joined
        const { data: existing } = await supabase
            .from('watch_party_participants')
            .select('*')
            .eq('party_id', id)
            .eq('user_id', user.username)
            .single();

        if (!existing) {
            await supabase.from('watch_party_participants').insert({
                party_id: id,
                user_id: user.username
            });
        }

        setPartyId(id);

        // Check if host
        const { data: party } = await supabase.from('watch_parties').select('host_id').eq('id', id).single();
        if (party && party.host_id === user.username) {
            setIsHost(true);
        }
    };

    const leaveParty = async () => {
        if (!partyId || !user) return;

        await supabase
            .from('watch_party_participants')
            .delete()
            .eq('party_id', partyId)
            .eq('user_id', user.username);

        setPartyId(null);
        setParticipants([]);
        setMessages([]);
        setIsHost(false);
    };

    const sendMessage = async (content: string) => {
        if (!partyId || !user) return;
        await supabase.from('watch_party_messages').insert({
            party_id: partyId,
            user_id: user.username,
            content
        });
    };

    const updateVideoState = async (isPlaying: boolean, currentTime: number) => {
        if (!partyId || !isHost) return; // Only host can control video

        await supabase
            .from('watch_parties')
            .update({ is_playing: isPlaying, video_timestamp: currentTime })
            .eq('id', partyId);
    };

    return (
        <WatchPartyContext.Provider value={{
            partyId,
            isActive: !!partyId,
            isHost,
            participants,
            messages,
            videoState,
            createParty,
            joinParty,
            leaveParty,
            sendMessage,
            updateVideoState
        }}>
            {children}
        </WatchPartyContext.Provider>
    );
}

export function useWatchParty() {
    const context = useContext(WatchPartyContext);
    if (context === undefined) {
        throw new Error('useWatchParty must be used within a WatchPartyProvider');
    }
    return context;
}
