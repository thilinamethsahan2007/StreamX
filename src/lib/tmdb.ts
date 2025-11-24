import { TMDB } from 'tmdb-ts';

const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

if (!token) {
    // We don't throw here to allow build to pass without env var, 
    // but it will fail at runtime if not provided.
    console.warn("TMDB_ACCESS_TOKEN is not defined");
}

export const tmdb = new TMDB(token || '');
