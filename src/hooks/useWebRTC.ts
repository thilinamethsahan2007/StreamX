import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export function useWebRTC(partyId: string) {
    const { user } = useAuth();
    const [peers, setPeers] = useState<string[]>([]); // List of connected user IDs
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});
    const [isMuted, setIsMuted] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // Initialize local audio stream
    const joinVoice = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Voice chat is not supported in this browser or context (requires HTTPS).");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            localStreamRef.current = stream;
            setIsConnected(true);

            // Signal that we joined voice
            await supabase.channel(`party:${partyId}`).send({
                type: 'broadcast',
                event: 'voice-join',
                payload: { userId: user?.username }
            });

        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    const leaveVoice = () => {
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
        Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
        peerConnectionsRef.current = {};
        setIsConnected(false);
        setPeers([]);
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    // Handle incoming signals (simplified for prototype)
    // In a real app, we'd need a full signaling server implementation (Offer/Answer/ICE)
    // For this prototype, we'll assume a mesh network where we just track who is "in" voice
    // and maybe use a simpler audio solution or just placeholder the UI if WebRTC is too complex for a single file.

    // ACTUALLY: Implementing full WebRTC mesh is complex. 
    // Let's implement the UI and the "Signaling" part first.
    // We will use Supabase Realtime as the signaling channel.

    useEffect(() => {
        if (!partyId || !user) return;

        const channel = supabase.channel(`party:${partyId}`);

        channel
            .on('broadcast', { event: 'voice-join' }, ({ payload }) => {
                if (payload.userId !== user.username) {
                    setPeers(prev => [...new Set([...prev, payload.userId])]);
                    // Here we would initiate a WebRTC offer to this new peer
                }
            })
            .subscribe();

        return () => {
            leaveVoice();
            channel.unsubscribe();
        };
    }, [partyId, user]);

    return {
        joinVoice,
        leaveVoice,
        toggleMute,
        isMuted,
        isConnected,
        peers
    };
}
