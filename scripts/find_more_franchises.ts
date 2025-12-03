import { TMDB } from 'tmdb-ts';

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzhlMTdhZDNiYTFlNzVjYzYxNzc3NWFiYTkyOWM5NyIsIm5iZiI6MTc2MTg4ODU2Ny43Nywic3ViIjoiNjkwNDQ5MzdjM2U5Yjg3ZWI1NDcxZDI4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.Lqh2XUKdf1JOsW-j6TQQOqoC08E7bPtVt_Yp8Gs1f-U';
const tmdb = new TMDB(token);

async function findKeywords() {
    const queries = [
        'James Bond',
        'Fast and the Furious',
        'Jurassic Park',
        'Mission: Impossible',
        'The Hunger Games',
        'Transformers',
        'Pirates of the Caribbean',
        'Despicable Me',
        'Shrek',
        'Toy Story',
        'MonsterVerse',
        'Planet of the Apes',
        'X-Men',
        'Spider-Man',
        'Batman',
        'Superman',
        'Star Trek',
        'Game of Thrones',
        'Breaking Bad',
        'The Walking Dead',
        'Stranger Things'
    ];

    for (const query of queries) {
        try {
            const res = await tmdb.search.keywords({ query });
            console.log(`Keywords for "${query}":`);
            // Show top 3 results
            res.results.slice(0, 3).forEach(k => console.log(`- ${k.name} (ID: ${k.id})`));
            console.log('---');
        } catch (e) {
            console.error(`Error searching for "${query}":`, e);
        }
    }
}

findKeywords();
