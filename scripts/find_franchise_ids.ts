import { TMDB } from 'tmdb-ts';

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzhlMTdhZDNiYTFlNzVjYzYxNzc3NWFiYTkyOWM5NyIsIm5iZiI6MTc2MTg4ODU2Ny43Nywic3ViIjoiNjkwNDQ5MzdjM2U5Yjg3ZWI1NDcxZDI4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.Lqh2XUKdf1JOsW-j6TQQOqoC08E7bPtVt_Yp8Gs1f-U';
const tmdb = new TMDB(token);

async function findCompanies() {
    const queries = ['Lucasfilm', 'Marvel Studios'];

    for (const query of queries) {
        try {
            const res = await tmdb.search.companies({ query });
            console.log(`Companies for "${query}":`);
            res.results.forEach(c => console.log(`- ${c.name} (ID: ${c.id})`));
            console.log('---');
        } catch (e) {
            console.error(`Error searching for "${query}":`, e);
        }
    }
}

findCompanies();
