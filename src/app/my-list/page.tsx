'use client';

import { useMyList } from '@/hooks/useMyList';
import MovieModal from '@/components/modal/MovieModal';
import MovieCard from '@/components/shared/MovieCard';
import { Loader2 } from 'lucide-react';

export default function MyListPage() {
    const { list, loading } = useMyList();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#141414]">
                <Loader2 className="w-8 h-8 text-[#e50914] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#141414] pt-24 px-4 md:px-12 pb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">My List</h1>

            {list.length === 0 ? (
                <div className="text-gray-400 text-lg text-center mt-20">
                    Your list is empty. Add movies and TV shows to track what you want to watch.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {list.map((item) => {
                        const movieProp = {
                            id: item.id,
                            title: item.type === 'movie' ? item.title : undefined,
                            name: item.type === 'tv' ? item.title : undefined,
                            poster_path: item.poster,
                            backdrop_path: item.poster,
                            media_type: item.type,
                            release_date: item.releaseDate || new Date(item.addedAt).toISOString(),
                            first_air_date: item.releaseDate || new Date(item.addedAt).toISOString(),
                            vote_average: 0,
                            overview: '',
                        };

                        return (
                            <MovieCard
                                key={`${item.type}-${item.id}`}
                                movie={movieProp as any}
                            />
                        );
                    })}
                </div>
            )}
            <MovieModal />
        </div>
    );
}
