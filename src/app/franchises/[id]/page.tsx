'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Timeline from '@/components/franchise/Timeline';
import MovieModal from '@/components/modal/MovieModal';
import { activeFranchises } from '@/lib/franchises';
import { useFranchiseContent } from '@/hooks/useFranchise';
import { useMyList } from '@/hooks/useMyList';
import { getImageUrl } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Plus, Check, Loader2 } from 'lucide-react';

export default function FranchiseDetailPage() {
    const params = useParams();
    const [franchise, setFranchise] = useState<any>(activeFranchises.find(f => f.id === params.id));
    const [loadingFranchise, setLoadingFranchise] = useState(!franchise);

    // Fetch custom franchise if not found in static list
    useEffect(() => {
        if (!franchise && params.id) {
            const fetchFranchise = async () => {
                const { data, error } = await supabase
                    .from('franchises')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (data) {
                    setFranchise({
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        backdropPath: data.backdrop_path,
                        type: data.type,
                        value: data.value,
                        isCustom: true,
                        content: data.content // Custom franchises might have content stored directly
                    });
                }
                setLoadingFranchise(false);
            };
            fetchFranchise();
        }
    }, [params.id, franchise]);

    // Use the hook for content. If it's a custom franchise with stored content, we might not need the hook, 
    // but the hook handles TMDB fetching for keyword/company types. 
    // For AI franchises, we stored the content in the DB!
    // So we should use that content directly if available.
    const { data: hookContent, isLoading: hookLoading } = useFranchiseContent(franchise?.isCustom && franchise.content ? undefined : franchise);

    const content = franchise?.content || hookContent;
    const isLoading = loadingFranchise || (franchise && !franchise.content && hookLoading);

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
        setTimeout(() => setAdded(false), 3000); // Reset "Added" state after 3s
    };

    if (loadingFranchise) {
        return (
            <main className="min-h-screen bg-[#141414] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
            </main>
        );
    }

    if (!franchise) {
        return (
            <main className="min-h-screen bg-[#141414] flex items-center justify-center">
                <h1 className="text-white text-2xl">Franchise not found</h1>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#141414]">
            <Navbar />

            {/* Hero Header */}
            <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={getImageUrl(franchise.backdropPath, 'original')}
                        alt={franchise.name}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                </div>

                <div className="absolute inset-0 flex items-end z-10">
                    <div className="container mx-auto px-4 md:px-8 pb-12 md:pb-16">
                        <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
                            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter drop-shadow-2xl">{franchise.name}</h1>
                            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-medium max-w-2xl drop-shadow-lg">{franchise.description}</p>

                            <button
                                onClick={handleAddFranchise}
                                disabled={adding || added || isLoading}
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
                                        Added to List
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-6 h-6" />
                                        Add Franchise to List
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Content */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
                </div>
            ) : (
                <Timeline content={content || []} />
            )}

            <MovieModal />
        </main>
    );
}
