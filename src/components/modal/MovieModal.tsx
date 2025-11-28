'use client';

import { useMovieDetails } from '@/hooks/useMovies';
import { useTvShowDetails, useTvShowSeason } from '@/hooks/useTvShowDetails';
import { getImageUrl, isContentReleased } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';
import { X, Play, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MovieModal() {
    const { isOpen, movie, closeModal } = useModalStore();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(1);

    const isTV = !!(movie as any)?.name;
    const title = isTV ? (movie as any)?.name : movie?.title;
    const releaseDate = isTV ? (movie as any)?.first_air_date : movie?.release_date;

    const { data: movieDetails } = useMovieDetails(movie?.id || 0);
    const { data: tvDetails } = useTvShowDetails(movie?.id || 0, isTV);
    const { data: seasonData } = useTvShowSeason(movie?.id || 0, selectedSeason, isTV);

    const details = isTV ? tvDetails : movieDetails;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !movie) return null;

    const handlePlay = (season?: number, episode?: number) => {
        closeModal();
        if (isTV && season && episode) {
            router.push(`/watch/tv/${movie?.id}?season=${season}&episode=${episode}`);
        } else if (isTV) {
            router.push(`/watch/tv/${movie?.id}?season=1&episode=1`);
        } else {
            router.push(`/watch/movie/${movie?.id}`);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed inset-0 sm:inset-4 md:inset-8 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-[100] lg:h-[90vh] w-full lg:max-w-5xl overflow-y-auto rounded-none sm:rounded-md bg-[#181818] text-white shadow-2xl"
                    >
                        <button
                            onClick={closeModal}
                            className="absolute right-2 top-2 sm:right-4 sm:top-4 z-10 rounded-full bg-[#181818] p-2 hover:bg-[#2a2a2a]"
                        >
                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>

                        <div className="relative h-[250px] sm:h-[350px] md:h-[400px] w-full">
                            <img
                                src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
                                alt={title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 h-24 sm:h-32 w-full bg-gradient-to-t from-[#181818] to-transparent" />

                            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 md:bottom-10 md:left-10">
                                <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-shadow">{title}</h2>
                                {!isTV && (
                                    isContentReleased(releaseDate) ? (
                                        <button
                                            onClick={() => handlePlay()}
                                            className="flex items-center gap-2 rounded bg-white px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 text-sm sm:text-base font-bold text-black hover:bg-opacity-90"
                                        >
                                            <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-black" /> Play
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="flex items-center gap-2 rounded bg-gray-600/70 px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 text-sm sm:text-base font-bold text-white cursor-not-allowed"
                                        >
                                            <Clock className="h-4 w-4 sm:h-5 sm:w-5" /> Coming Soon
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="px-4 sm:px-6 md:px-10 py-6 md:py-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
                                <div className="lg:col-span-2 space-y-3 md:space-y-4">
                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs sm:text-sm font-semibold text-green-400">
                                        <span>98% Match</span>
                                        <span className="text-gray-400">{releaseDate?.split('-')[0]}</span>
                                        <span className="border border-gray-500 px-1 text-xs text-gray-400">HD</span>
                                        {isTV && <span className="text-gray-400">TV Show</span>}
                                    </div>
                                    <p className="text-sm sm:text-base leading-relaxed text-white">{movie.overview}</p>
                                </div>

                                <div className="lg:col-span-1 space-y-2 text-xs sm:text-sm text-gray-400">
                                    <div>
                                        <span className="text-gray-500">Genres: </span>
                                        {details?.genres?.map(g => g.name).join(', ') || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Language: </span>
                                        {movie.original_language?.toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Rating: </span>
                                        {movie.vote_average?.toFixed(1)}
                                    </div>
                                    {isTV && tvDetails?.number_of_seasons && (
                                        <div>
                                            <span className="text-gray-500">Seasons: </span>
                                            {tvDetails.number_of_seasons}
                                        </div>
                                    )}
                                    {/* Cast Section */}
                                    <div>
                                        <span className="text-gray-500">Cast: </span>
                                        <span className="text-gray-300">
                                            {details?.credits?.cast?.slice(0, 5).map(person => person.name).join(', ') || 'N/A'}
                                        </span>
                                        {details?.credits?.cast && details.credits.cast.length > 5 && (
                                            <span className="text-gray-500 italic">, more</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isTV && tvDetails?.number_of_seasons && (
                                <div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                        <h3 className="text-xl sm:text-2xl font-bold">Episodes</h3>
                                        <select
                                            value={selectedSeason}
                                            onChange={(e) => setSelectedSeason(Number(e.target.value))}
                                            className="bg-[#2a2a2a] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded border border-gray-600 cursor-pointer hover:bg-[#3a3a3a] text-sm sm:text-base"
                                        >
                                            {Array.from({ length: tvDetails.number_of_seasons }, (_, i) => i + 1).map(season => (
                                                <option key={season} value={season}>Season {season}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {seasonData?.episodes && seasonData.episodes.length > 0 ? (
                                        <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 sm:pr-2">
                                            {seasonData.episodes.map((episode: any) => {
                                                const isEpisodeReleased = isContentReleased(episode.air_date);
                                                return (
                                                    <div
                                                        key={episode.id}
                                                        onClick={() => isEpisodeReleased && handlePlay(selectedSeason, episode.episode_number)}
                                                        className={`flex gap-3 sm:gap-4 p-3 sm:p-4 rounded transition group ${isEpisodeReleased
                                                            ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] cursor-pointer'
                                                            : 'bg-[#1a1a1a] cursor-not-allowed opacity-60'
                                                            }`}
                                                    >
                                                        <div className={`text-2xl sm:text-3xl font-bold transition w-10 sm:w-12 flex-shrink-0 ${isEpisodeReleased
                                                            ? 'text-gray-600 group-hover:text-white'
                                                            : 'text-gray-700'
                                                            }`}>
                                                            {episode.episode_number}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between mb-1 sm:mb-2">
                                                                <div className="flex items-center gap-2 flex-1">
                                                                    <h4 className={`text-sm sm:text-base font-semibold truncate ${isEpisodeReleased
                                                                        ? 'text-white group-hover:text-gray-200'
                                                                        : 'text-gray-500'
                                                                        }`}>
                                                                        {episode.name}
                                                                    </h4>
                                                                    {!isEpisodeReleased && (
                                                                        <span className="text-xs bg-orange-600 px-2 py-0.5 rounded flex-shrink-0">
                                                                            Coming Soon
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-xs sm:text-sm text-gray-400 ml-2 flex-shrink-0">
                                                                    {episode.runtime ? `${episode.runtime}m` : ''}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                                                                {episode.overview || 'No description available.'}
                                                            </p>
                                                            {!isEpisodeReleased && episode.air_date && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Airs on: {new Date(episode.air_date).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {episode.still_path && (
                                                            <img
                                                                src={getImageUrl(episode.still_path, 'w500')}
                                                                alt={episode.name}
                                                                className={`w-24 h-16 sm:w-32 sm:h-20 object-cover rounded flex-shrink-0 ${!isEpisodeReleased ? 'opacity-50' : ''
                                                                    }`}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 text-center py-8 text-sm sm:text-base">
                                            {seasonData ? 'No episodes available for this season.' : 'Loading episodes...'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
