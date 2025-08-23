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

  const voteIconAlreadyClicked = voteIcon.classList.contains('voted');
  const oppositeVoteIconAlreadyClicked = oppositeVoteIcon.classList.contains('voted');

  if (voteIconAlreadyClicked) {
    voteIcon.classList.remove('voted');
    // turning upvote off -> -1, turning downvote off -> +1
    totalVotes += vote === 'upvote' ? -1 : 1;
  } else {
    voteIcon.classList.add('voted');
    // +1 for upvote -1 for downvote
    totalVotes += vote === 'upvote' ? 1 : -1;

    if (oppositeVoteIconAlreadyClicked) {
      oppositeVoteIcon.classList.remove('voted');
      // if vote is 'upvote' opposite vote is downvote and removing downvote -> +1; if vote is 'downvote' opposite vote is upvote and removing upvote -> -1
      totalVotes += vote === 'upvote' ? 1 : -1;
    }
  }

  totalVotesElement.textContent = totalVotes;
}
