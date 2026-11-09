const ITUNES_SEARCH_ENDPOINT = 'https://itunes.apple.com/search';

async function fetchArtistSongs(artistName) {
    const params = new URLSearchParams({
        term: artistName,
        entity: 'song',
        limit: '20'
    });
    const response = await fetch(`${ITUNES_SEARCH_ENDPOINT}?${params}`);

    if (!response.ok) {
        throw new Error(`iTunes Search API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.results)) {
        throw new Error('iTunes Search API returned an invalid response');
    }

    const seenTrackNames = new Set();
    const songs = data.results
        .filter(result =>
            typeof result.trackName === 'string' &&
            result.trackName.trim() &&
            typeof result.previewUrl === 'string' &&
            result.previewUrl.trim()
        )
        .filter(result => {
            const key = result.trackName.trim().toLocaleLowerCase();
            if (seenTrackNames.has(key)) return false;
            seenTrackNames.add(key);
            return true;
        })
        .map(result => ({
            id: result.trackId || `${result.artistId}-${result.trackName}`,
            name: result.trackName.trim(),
            previewUrl: result.previewUrl,
            artworkUrl: typeof result.artworkUrl100 === 'string'
                ? result.artworkUrl100.replace(/100x100bb/gi, '300x300bb')
                : ''
        }));

    if (songs.length < 4) {
        throw new Error(`Not enough playable iTunes previews for ${artistName}`);
    }

    return songs;
}
