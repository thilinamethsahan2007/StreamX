'use client';

import { useTrendingMovies, useTrendingAll } from '@/hooks/useMovies';
import { useTrendingTvShows } from '@/hooks/useTvShows';
import { getImageUrl, isContentReleased } from '@/lib/utils';
import { Info, Play, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Movie } from 'tmdb-ts';
import { useModalStore } from '@/store/modalStore';
import { useRouter } from 'next/navigation';

interface HeroBannerProps {
    variant?: 'home' | 'movie' | 'tv';
}

export default function HeroBanner({ variant = 'home' }: HeroBannerProps) {
    const { data: movies } = useTrendingMovies();
    const { data: tvShows } = useTrendingTvShows();
    const { data: all } = useTrendingAll();

    const [content, setContent] = useState<any>(null);
    const openModal = useModalStore((state) => state.openModal);
    const router = useRouter();

    useEffect(() => {
        let data: any[] = [];
        if (variant === 'movie') data = movies || [];
        else if (variant === 'tv') data = tvShows || [];
        else data = all || [];

        if (data && data.length > 0) {
            const randomContent = data[Math.floor(Math.random() * data.length)];
            setContent(randomContent);
        }
    }, [movies, tvShows, all, variant]);

    if (!content) return <div className="h-[95vh] w-full bg-[#141414] animate-pulse" />;

    const title = content.title || content.name;
    const overview = content.overview;
    const backdropPath = content.backdrop_path;
    const releaseDate = content.release_date || content.first_air_date;
    const id = content.id;
    const isTV = !!content.name;

    return (
        <div className="relative h-[85vh] w-full overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src={getImageUrl(backdropPath, 'original')}
                    alt={title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent" />
            </div>

            <div className="relative z-20 flex h-full items-center px-4 md:px-12 lg:px-16 pt-20">
                <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[1.1]">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200/90 line-clamp-3 leading-relaxed font-medium max-w-xl">
                        {overview}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        {isContentReleased(releaseDate) ? (
                            <button
                                onClick={() => router.push(isTV ? `/watch/tv/${id}` : `/watch/movie/${id}`)}
                                className="flex items-center justify-center gap-3 px-8 py-3.5 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            >
                                <Play className="h-6 w-6 fill-black" />
                                Play Now
                            </button>
                        ) : (
                            <button
                                disabled
                                className="flex items-center justify-center gap-3 px-8 py-3.5 bg-white/20 text-white/60 rounded-full font-bold cursor-not-allowed backdrop-blur-md"
                            >
                                <Clock className="h-6 w-6" />
                                Coming Soon
                            </button>
                        )}
                        <button
                            onClick={() => content && openModal(content)}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 glass-button text-white rounded-full font-semibold"
                        >
                            <Info className="h-6 w-6" />
                            More Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
