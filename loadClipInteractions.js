export function loadClipInteractions(clip) {
    const upvotedClips = JSON.parse(localStorage.getItem('upvotedClips') || '[]');
    const downvotedClips = JSON.parse(localStorage.getItem('downvotedClips') || '[]');
    const favoritedClips = JSON.parse(localStorage.getItem('favoritedClips') || '[]');

    const upvoteButton = document.getElementById('upvote-button');
    const downvoteButton = document.getElementById('downvote-button');
    const favoriteButton = document.getElementById('favorite-button');

    console.log(upvotedClips, downvotedClips, favoritedClips);
    console.log(clip);
    console.log(upvotedClips.some(upvotedClip => upvotedClip.id === clip.id));

    highlightElement(clip, upvotedClips, upvoteButton);
    highlightElement(clip, downvotedClips, downvoteButton);
    highlightElement(clip, favoritedClips, favoriteButton);
}

function highlightElement(clip, memory, element) {
    if (memory.some(element => element.id === clip.id)) {
        console.log('heyo');
        element.classList.add('voted');
    }
}