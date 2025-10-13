export function toggleClipPlayer() {
    const clipPlayer = document.getElementById('clip-player-complex');
    const disclosureButton = document.getElementById('disclosure-button');
    const carouselTabButtons = document.querySelector('.carousel-tab-buttons');

    const clipPlayerIsVisible = clipPlayer.style.display !== 'none';

    if (clipPlayerIsVisible) {
        hideClipPlayer(clipPlayer, disclosureButton);

        const stickyStuff = document.querySelector('.sticky-stuff');
        const stickyStuffHeight = stickyStuff.getBoundingClientRect().height;
        carouselTabButtons.style.top = `${stickyStuffHeight}px`;

        const compoundFollowButton = document.getElementById('compound-follow-button');
        compoundFollowButton.style.display = 'none';
    } else {
        showClipPlayer(clipPlayer, disclosureButton);
    }
}

function hideClipPlayer(clipPlayer, disclosureButton) {
    clipPlayer.style.display = 'none';
    disclosureButton.classList.remove('caret-up');
    disclosureButton.classList.add('caret-down');
}

export function showClipPlayer(clipPlayer, disclosureButton) {
    clipPlayer.style.display = 'block';
    disclosureButton.classList.remove('caret-down');
    disclosureButton.classList.add('caret-up');

    const carouselTabButtons = document.querySelector('.carousel-tab-buttons');
    const stickyStuff = document.querySelector('.sticky-stuff');
    const stickyStuffHeight = stickyStuff.getBoundingClientRect().height;
    carouselTabButtons.style.top = `${stickyStuffHeight}px`;

    const compoundFollowButton = document.getElementById('compound-follow-button');
    compoundFollowButton.style.display = 'inline-flex';
}
