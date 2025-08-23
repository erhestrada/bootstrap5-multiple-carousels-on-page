export function updateVotes(button, vote) {
  const totalVotesElement = document.getElementById('total-votes');
  let totalVotes = parseInt(totalVotesElement.textContent, 10) || 0;

  // If vote is upvote other vote is downvote and vice versa
  const oppositeVote = vote === 'upvote' ? 'downvote' : 'upvote';
  const voteButtons = {
    upvote: document.getElementById('like-button'),
    downvote: document.getElementById('dislike-button')
  };

  const voteIcon = button.querySelector('.vote-icon');
  const oppositeVoteIcon = voteButtons[oppositeVote].querySelector('.vote-icon');

  const currentVoted = voteIcon.classList.contains('voted');
  const otherVoted = oppositeVoteIcon.classList.contains('voted');

  if (currentVoted) {
    voteIcon.classList.remove('voted');
    totalVotes += vote === 'upvote' ? -1 : 1;
  } else {
    voteIcon.classList.add('voted');
    totalVotes += vote === 'upvote' ? 1 : -1;

    if (otherVoted) {
      oppositeVoteIcon.classList.remove('voted');
      totalVotes += vote === 'upvote' ? 1 : -1;
    }
  }

  totalVotesElement.textContent = totalVotes;
}
