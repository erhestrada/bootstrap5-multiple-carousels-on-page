export function toggleClipPlayer() {
    const clipPlayer = document.getElementById('clip-player-complex');
    const disclosureButton = document.getElementById('disclosure-button');

    const clipPlayerIsVisible = clipPlayer.style.display !== 'none';

    if (clipPlayerIsVisible) {
        hideClipPlayer(clipPlayer, disclosureButton);
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
}
