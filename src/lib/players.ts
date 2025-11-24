export interface PlayerProps {
    title: string;
    source: string;
    recommended?: boolean;
    fast?: boolean;
    ads?: boolean;
    resumable?: boolean;
}

export const getMoviePlayers = (id: string | number): PlayerProps[] => {
    return [
        {
            title: "VidSrc v3",
            source: `https://vidsrc.cc/v3/embed/movie/${id}?autoPlay=true`,
            recommended: true,
            fast: true,
        },
    ];
};

export const getTvShowPlayers = (
    id: string | number,
    season: number,
    episode: number
): PlayerProps[] => {
    return [
        {
            title: "VidSrc v3",
            source: `https://vidsrc.cc/v3/embed/tv/${id}/${season}/${episode}?autoPlay=true`,
            recommended: true,
            fast: true,
        },
    ];
};
