import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { tmdb } from '@/lib/tmdb';
import { supabase } from '@/lib/supabase';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API Key is missing' }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `
        You are a movie expert. Curate an EXHAUSTIVE and COMPLETE chronological timeline of movies and TV shows for the franchise: "${query}".
        You MUST include EVERY SINGLE movie, TV series, special, and spin-off that is part of this franchise.
        Do not miss any installments, even minor ones.
        
        CRITICAL: Order them chronologically based on the IN-UNIVERSE timeline.
        Use IMDb lists or widely accepted fan timelines as your primary reference for this order.
        If an in-universe order is not applicable (e.g. anthology), use release order.
        
        Return ONLY a valid JSON array of objects, where each object has the following fields:
        - "title": The exact title of the movie or TV show.
        - "year": The release year (number).
        - "type": Either "movie" or "tv".

        Example: 
        [
            { "title": "Star Wars: Episode I - The Phantom Menace", "year": 1999, "type": "movie" },
            { "title": "Star Wars: The Clone Wars", "year": 2008, "type": "tv" }
        ]
        Do not include any other text or markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the response to ensure valid JSON
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let items: { title: string; year: number; type: 'movie' | 'tv' }[] = [];
        try {
            items = JSON.parse(cleanedText);
        } catch (e) {
            console.error('Failed to parse Gemini response:', text);
            return NextResponse.json({ error: 'Failed to curate franchise' }, { status: 500 });
        }

        // Search TMDB for each title to get metadata
        const contentPromises = items.map(async (item) => {
            try {
                if (item.type === 'movie') {
                    // Search for movie with year
                    const movieSearch = await tmdb.search.movies({ query: item.title, year: item.year });
                    if (movieSearch.results.length > 0) {
                        const m = movieSearch.results[0];
                        return {
                            id: m.id,
                            title: m.title,
                            poster_path: m.poster_path,
                            backdrop_path: m.backdrop_path,
                            release_date: m.release_date,
                            media_type: 'movie',
                            overview: m.overview
                        };
                    }
                } else {
                    // Search for TV show with year
                    const tvSearch = await tmdb.search.tvShows({ query: item.title, first_air_date_year: item.year });
                    if (tvSearch.results.length > 0) {
                        const t = tvSearch.results[0];

                        // Fetch details to get season/episode counts
                        let details: any = {};
                        try {
                            details = await tmdb.tvShows.details(t.id);
                        } catch (err) {
                            console.error(`Failed to fetch TV details for ${t.name}`, err);
                        }

                        return {
                            id: t.id,
                            title: t.name,
                            poster_path: t.poster_path,
                            backdrop_path: t.backdrop_path,
                            release_date: t.first_air_date,
                            media_type: 'tv',
                            overview: t.overview,
                            number_of_seasons: details.number_of_seasons,
                            number_of_episodes: details.number_of_episodes
                        };
                    }
                }

                return null;
            } catch (e) {
                console.error(`Failed to fetch metadata for "${item.title}":`, e);
                return null;
            }
        });

        const rawContent = (await Promise.all(contentPromises)).filter((item) => item !== null);

        // Deduplicate by ID
        const content = Array.from(new Map(rawContent.map(item => [item.id, item])).values());

        // Save to Supabase
        if (content.length > 0) {
            const franchiseId = `ai-${query.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            const { error: dbError } = await supabase
                .from('franchises')
                .upsert({
                    id: franchiseId,
                    name: query,
                    description: `AI Curated timeline for ${query}`,
                    backdrop_path: content[0].backdrop_path || content[0].poster_path,
                    type: 'keyword',
                    value: 0,
                    is_custom: true,
                    updated_at: new Date().toISOString(),
                    content: content
                }, { onConflict: 'id' })
                .select()
                .single();

            if (dbError) {
                // Ignore duplicate key error, just return content
                if (dbError.code !== '23505') {
                    console.error('Supabase Insert Error:', dbError);
                }
            }
        }

        return NextResponse.json({ content });

    } catch (error) {
        console.error('AI Franchise Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
