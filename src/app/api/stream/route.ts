import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const tmdbId = searchParams.get('tmdbId');
    const season = searchParams.get('season');
    const episode = searchParams.get('episode');

    if (!tmdbId) {
        return NextResponse.json({ error: 'Missing tmdbId' }, { status: 400 });
    }

    try {
        // Construct the VidSrc URL
        let url = `https://vidsrc.to/embed/movie/${tmdbId}`;
        if (season && episode) {
            url = `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
        }

        // Fetch the page content
        const response = await fetch(url);
        const html = await response.text();

        // Attempt to find the source (this is a heuristic and might fail)
        // VidSrc often obfuscates the source, but sometimes it's in a variable like 'source' or 'file'
        const sourceMatch = html.match(/file:\s*"([^"]+)"/) || html.match(/source:\s*"([^"]+)"/);

        if (sourceMatch && sourceMatch[1]) {
            return NextResponse.json({ streamUrl: sourceMatch[1] });
        }

        // If simple regex fails, we might need a more complex extractor or it's protected
        return NextResponse.json({ error: 'Could not extract stream URL' }, { status: 404 });

    } catch (error) {
        console.error('Error fetching stream:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
