'use client';

import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import MovieModal from '@/components/modal/MovieModal';
import ContentGrid from '@/components/shared/ContentGrid';
import { useSearchMovies } from '@/hooks/useSearch';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { data: results, isLoading, error } = useSearchMovies(query);

    return (
        <main className="relative min-h-screen bg-[#141414]">
            <Navbar />

            <div className="pt-24 px-4 md:px-8 lg:px-16 pb-12">
                <ContentGrid
                    title={query ? `Results for "${query}"` : 'Search'}
                    movies={results || []}
                    isLoading={isLoading}
                    error={error as Error}
                />
            </div>

            <MovieModal />
        </main>
    );
}
