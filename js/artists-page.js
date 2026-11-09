// Shared loading/rendering logic for the artist selection pages
async function fetchArtists() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockArtists);
        }, 1500);
    });
}

function getArtistsByCategory(artists, category) {
    return artists.filter(artist => artist.category === category);
}

async function loadArtists() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const artistsGrid = document.getElementById('artistsGrid');

    loadingState.style.display = 'flex';
    errorState.style.display = 'none';
    artistsGrid.style.display = 'none';

    try {
        const allArtists = await fetchArtists();
        const category = document.body.dataset.artistCategory || 'international';
        const artists = getArtistsByCategory(allArtists, category);

        loadingState.style.display = 'none';
        artistsGrid.style.display = 'grid';

        renderArtists(artists);

    } catch (error) {
        console.error('Error loading artists:', error);

        loadingState.style.display = 'none';
        errorState.style.display = 'block';
    }
}

function renderArtists(artists) {
    const artistsGrid = document.getElementById('artistsGrid');

    artistsGrid.innerHTML = artists.map(artist => `
        <a href="game.html?artist=${encodeURIComponent(artist.id)}" class="artist-card">
            <div class="artist-image-container">
                <img
                    src="${artist.image}"
                    alt="${artist.name}"
                    class="artist-image"
                    loading="lazy"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >
                <div class="artist-fallback" style="display: none;">
                    ${artist.name.charAt(0)}
                </div>
            </div>
            <h3 class="artist-name">${artist.name}</h3>
        </a>
    `).join('');

    artistsGrid.querySelectorAll('.artist-card').forEach(card => {
        card.addEventListener('click', event => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            event.preventDefault();
            document.body.classList.add('page-exit');
            window.setTimeout(() => {
                window.location.href = card.href;
            }, 250);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadArtists();
});
