'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Timeline from '@/components/franchise/Timeline';
import MovieModal from '@/components/modal/MovieModal';
import { FranchiseContent } from '@/hooks/useFranchise';

import { useFranchiseStore } from '@/store/franchiseStore';
import { supabase } from '@/lib/supabase';
import { RefreshCw, Plus, Check, Loader2 } from 'lucide-react';
import { useMyList } from '@/hooks/useMyList';

export default function FranchiseSearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [content, setContent] = useState<FranchiseContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const addFranchise = useFranchiseStore((state) => state.addFranchise);

    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const fetchFromDB = async () => {
        if (!query) return false;

        const franchiseId = `ai-${query.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        const { data } = await supabase
            .from('franchises')
            .select('*')
            .eq('id', franchiseId)
            .single();

        if (data) {
            setLastUpdated(data.updated_at);

            // If we have stored content, use it!
            if (data.content && Array.isArray(data.content) && data.content.length > 0) {
                setContent(data.content);
                setLoading(false);
                return true;
            }
            return false;
        }
        return false;
    };

    const generateContent = async (forceRefresh = false) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/ai-franchise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch franchise');
            }

            setContent(data.content);

            // Update local timestamp if we just refreshed
            if (forceRefresh) {
                setLastUpdated(new Date().toISOString());
            } else {
                // Try to fetch timestamp from DB if we didn't just force refresh (e.g. initial load)
                const franchiseId = `ai-${query!.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                const { data: dbData } = await supabase.from('franchises').select('updated_at').eq('id', franchiseId).single();
                if (dbData) setLastUpdated(dbData.updated_at);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!query) return;

        const init = async () => {
            setLoading(true);
            const foundInDB = await fetchFromDB();
            if (!foundInDB) {
                generateContent();
            }
        };

        init();
    }, [query]);

    const handleRefresh = () => {
        generateContent(true);
    };

    const { addMultipleToList } = useMyList();
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddFranchise = async () => {
        if (!content || content.length === 0) return;
        setAdding(true);

        const itemsToAdd = content.map((item: any) => ({
            id: item.id,
            type: item.media_type as 'movie' | 'tv',
            title: item.title || '',
            poster: item.poster_path || '',
            releaseDate: item.release_date,
        }));

        await addMultipleToList(itemsToAdd);

        setAdding(false);
        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
    };

    // Derive backdrop from first item
    const backdropPath = content.length > 0 ? content[0].backdrop_path : null;

    return (
        <main className="min-h-screen bg-[#141414]">
            <Navbar />

            {/* Hero Header */}
            <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    {backdropPath && (
                        <img
                            src={`https://image.tmdb.org/t/p/original${backdropPath}`}
                            alt={query || 'Franchise'}
                            className="h-full w-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                </div>

                <div className="absolute inset-0 flex items-end z-10">
                    <div className="container mx-auto px-4 md:px-8 pb-12 md:pb-16">
                        <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
                            <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
                                <div>
                                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter drop-shadow-2xl mb-2">
                                        {query}
                                    </h1>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md border border-purple-500/30">
                                            AI Generated Timeline
                                        </span>
                                        {lastUpdated && (
                                            <span className="text-sm font-medium opacity-80">
                                                Updated: {new Date(lastUpdated).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleAddFranchise}
                                        disabled={adding || added || loading || content.length === 0}
                                        className={`
                                            flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:scale-105
                                            ${added
                                                ? 'bg-green-500 text-white shadow-green-500/20'
                                                : 'bg-white text-black hover:bg-gray-100 shadow-white/20'}
                                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                        `}
                                    >
                                        {adding ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : added ? (
                                            <>
                                                <Check className="w-6 h-6" />
                                                Added
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-6 h-6" />
                                                Add to List
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleRefresh}
                                        disabled={loading}
                                        className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 backdrop-blur-md border border-white/10"
                                        title="Refresh Timeline"
                                    >
                                        <RefreshCw className={`w-6 h-6 text-white ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 pb-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 text-xl">{error}</p>
                        {error.includes('API Key') && (
                            <p className="text-gray-400 mt-2">Please add GEMINI_API_KEY to your .env.local file.</p>
                        )}
                    </div>
                ) : (
                    <Timeline content={content} />
                )}
            </div>

            <MovieModal />
        </main>
    );
}
