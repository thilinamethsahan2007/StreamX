import { Movie } from 'tmdb-ts';
import MovieCard from '@/components/shared/MovieCard';

interface ContentGridProps {
    title: string;
    movies: any[];
    isLoading?: boolean;
    error?: Error;
}

export default function ContentGrid({ title, movies, isLoading, error }: ContentGridProps) {
    if (error) {
        return (
            <div className="px-4 md:px-8 lg:px-16 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
                <p className="text-red-500">Failed to load content</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="px-4 md:px-8 lg:px-16 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className="aspect-[2/3] bg-gray-800 rounded-md animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="px-4 md:px-8 lg:px-16 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
                <p className="text-gray-400">No content found.</p>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 lg:px-16 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">{title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {movies.map((movie) => (
                    <div key={movie.id}>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>
        </div>
    );
}
