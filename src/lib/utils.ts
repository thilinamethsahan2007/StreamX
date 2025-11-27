import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getImageUrl = (path?: string, size: 'original' | 'w500' = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Check if a movie or TV show has been released
export function isContentReleased(releaseDate: string | undefined): boolean {
    if (!releaseDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
    const release = new Date(releaseDate);
    return release <= today;
}

// Get release status text
export function getReleaseStatus(releaseDate: string | undefined): 'released' | 'upcoming' | 'unknown' {
    if (!releaseDate) return 'unknown';
    return isContentReleased(releaseDate) ? 'released' : 'upcoming';
}
