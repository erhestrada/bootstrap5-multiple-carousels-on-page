import { getVote } from './votes/get-vote.js'

export async function displayVote(userId, clipId) {
  try {
    const vote = await getVote(userId, clipId); // Assuming this fetches 'upvote' | 'downvote' | null

    const upvoteButton = document.getElementById('upvote-button');
    const downvoteButton = document.getElementById('downvote-button');

    const upvoteIcon = upvoteButton.querySelector('.vote-icon');
    const downvoteIcon = downvoteButton.querySelector('.vote-icon');

    upvoteIcon.classList.remove('voted');
    downvoteIcon.classList.remove('voted');

    if (vote === 'upvote') {
      upvoteIcon.classList.add('voted');
    } else if (vote === 'downvote') {
      downvoteIcon.classList.add('voted');
    }
  } catch (error) {
    console.error('Failed to display vote:', error);
  }
}