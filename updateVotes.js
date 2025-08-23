export function updateVotes(button, vote) {
    const voteIcon = button.querySelector('.vote-icon');
    voteIcon.classList.toggle('voted');
}