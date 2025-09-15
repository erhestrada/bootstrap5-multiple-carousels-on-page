export async function displayFollowStatus(streamer, category, follows) {
    displayHeart('follow-streamer-button', streamer, follows.streamers);
    displayHeart('follow-category-button', category, follows.categories);
}

export function displayHeart(buttonId, name, follows) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    const icon = button.querySelector('i');
    if (!icon) return;

    if (follows.includes(name)) {
        icon.className = 'bi bi-heart-fill';

        button.onmouseenter = () => {
            icon.className = 'bi bi-heart';
        };

        button.onmouseleave = () => {
            icon.className = 'bi bi-heart-fill';
        };
    } else {
        icon.className = 'bi bi-heart';

        button.onmouseenter = () => {
            icon.className = 'bi bi-heart-fill';
        };

        button.onmouseleave = () => {
            icon.className = 'bi bi-heart';
        };
    }
}
