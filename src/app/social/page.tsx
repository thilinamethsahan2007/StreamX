'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useSocial, SearchResult } from '@/hooks/useSocial';
import { Search, UserPlus, UserCheck, UserX, Users, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SocialPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { friends, loading, sendFriendRequest, acceptFriendRequest, removeFriend, searchUsers } = useSocial();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');

    if (!user) {
        // Redirect if not logged in (handled by protected route usually, but safe check)
        if (typeof window !== 'undefined') router.push('/login');
        return null;
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
        setSearching(false);
        setActiveTab('search');
    };

    const pendingRequests = friends.filter(f => f.status === 'pending' && f.direction === 'incoming');
    const sentRequests = friends.filter(f => f.status === 'pending' && f.direction === 'outgoing');
    const acceptedFriends = friends.filter(f => f.status === 'accepted');

    return (
        <main className="min-h-screen bg-[#141414]">
            <Navbar />

            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Social Hub</h1>
                        <p className="text-gray-400">Connect with friends and watch together.</p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Find users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-80 bg-white/5 border border-white/10 rounded-full px-5 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </form>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-1">
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'friends' ? 'text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        My Friends ({acceptedFriends.length})
                        {activeTab === 'friends' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'requests' ? 'text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Requests
                        {pendingRequests.length > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {pendingRequests.length}
                            </span>
                        )}
                        {activeTab === 'requests' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />
                        )}
                    </button>
                    {searchResults.length > 0 && (
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'search' ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Search Results
                            {activeTab === 'search' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />
                            )}
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Friends List */}
                            {activeTab === 'friends' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {acceptedFriends.length === 0 ? (
                                        <div className="col-span-full text-center py-12 text-gray-500">
                                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No friends yet. Search for users to connect!</p>
                                        </div>
                                    ) : (
                                        acceptedFriends.map((friend) => (
                                            <div key={friend.username} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                                                        {friend.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-white">{friend.username}</span>
                                                </div>
                                                <button
                                                    onClick={() => removeFriend(friend.username)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                                    title="Remove Friend"
                                                >
                                                    <UserX className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Requests */}
                            {activeTab === 'requests' && (
                                <div className="space-y-8">
                                    {/* Incoming */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Incoming Requests</h3>
                                        {pendingRequests.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No pending requests.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {pendingRequests.map((req) => (
                                                    <div key={req.username} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white">
                                                                {req.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-medium text-white">{req.username}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => acceptFriendRequest(req.username)}
                                                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                                                                title="Accept"
                                                            >
                                                                <UserCheck className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => removeFriend(req.username)}
                                                                className="p-2 bg-white/10 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                                                                title="Decline"
                                                            >
                                                                <UserX className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Outgoing */}
                                    {sentRequests.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Sent Requests</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {sentRequests.map((req) => (
                                                    <div key={req.username} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between opacity-75">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white">
                                                                {req.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-medium text-white">{req.username}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFriend(req.username)}
                                                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Search Results */}
                            {activeTab === 'search' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {searching ? (
                                        <div className="col-span-full flex justify-center py-8">
                                            <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            No users found matching "{searchQuery}"
                                        </div>
                                    ) : (
                                        searchResults.map((result) => (
                                            <div key={result.username} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-sm font-bold text-white">
                                                        {result.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-white">{result.username}</span>
                                                </div>

                                                {result.isFriend ? (
                                                    <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                                                        <UserCheck className="w-4 h-4" /> Friend
                                                    </span>
                                                ) : result.hasPendingRequest ? (
                                                    <span className="text-gray-400 text-sm font-medium">Pending</span>
                                                ) : (
                                                    <button
                                                        onClick={() => sendFriendRequest(result.username)}
                                                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                                                        title="Add Friend"
                                                    >
                                                        <UserPlus className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
