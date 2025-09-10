import { getUserVoteOnClip } from './votes'

export async function displayUserVoteOnClip(userId, clipId) {
  try {
    // Upvote, downvote, or null if user hasn't voted on clip
    const vote = await getUserVoteOnClip(userId, clipId);

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