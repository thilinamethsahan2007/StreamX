import { useState, useEffect, useRef } from 'react';
import { useWatchParty } from '@/context/WatchPartyContext';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useAuth } from '@/context/AuthContext';
import { Send, Mic, MicOff, PhoneOff, Users, MessageSquare } from 'lucide-react';

export default function WatchPartySidebar() {
    const { partyId, participants, messages, sendMessage, leaveParty } = useWatchParty();
    const { user } = useAuth();
    const { joinVoice, leaveVoice, toggleMute, isMuted, isConnected, peers } = useWebRTC(partyId!);

    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        await sendMessage(newMessage);
        setNewMessage('');
    };

    if (!partyId) return null;

    return (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-[#141414] border-l border-white/10 flex flex-col z-40 pt-20">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Party ({participants.length})
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('partyId', partyId!);
                            navigator.clipboard.writeText(url.toString());
                            alert('Invite link copied to clipboard!');
                        }}
                        className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white"
                    >
                        Copy Link
                    </button>
                    <button
                        onClick={leaveParty}
                        className="text-xs text-red-500 hover:text-red-400"
                    >
                        Leave
                    </button>
                </div>
            </div>

            {/* Voice Controls */}
            <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Voice Chat</span>
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <>
                                <button
                                    onClick={toggleMute}
                                    className={`p-2 rounded-full ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
                                >
                                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={leaveVoice}
                                    className="p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                >
                                    <PhoneOff className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={joinVoice}
                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-full hover:bg-green-700 transition-colors"
                            >
                                Join Voice
                            </button>
                        )}
                    </div>
                </div>
                {isConnected && (
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full border border-green-500/30">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-white">You</span>
                        </div>
                        {peers.map(peerId => (
                            <div key={peerId} className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full border border-white/10">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span className="text-xs text-gray-300">{peerId}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.user_id === user?.username;
                    return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-gray-500 mb-1 px-1">{msg.user_id}</span>
                            <div className={`px-3 py-2 rounded-xl max-w-[85%] text-sm ${isMe ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-200'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/20">
                <div className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:border-white/20"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:text-blue-400 disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
