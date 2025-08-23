export function updateVotes(button, vote) {
  const totalVotesElement = document.getElementById('total-votes');
  let totalVotes = parseInt(totalVotesElement.textContent, 10) || 0;

  const otherVote = vote === 'upvote' ? 'downvote' : 'upvote';
  const voteButtons = {
    upvote: document.getElementById('like-button'),
    downvote: document.getElementById('dislike-button')
  };

  const currentIcon = button.querySelector('.vote-icon');
  const otherIcon = voteButtons[otherVote].querySelector('.vote-icon');

  const currentVoted = currentIcon.classList.contains('voted');
  const otherVoted = otherIcon.classList.contains('voted');

  if (currentVoted) {
    currentIcon.classList.remove('voted');
    totalVotes += vote === 'upvote' ? -1 : 1;
  } else {
    currentIcon.classList.add('voted');
    totalVotes += vote === 'upvote' ? 1 : -1;

    if (otherVoted) {
      otherIcon.classList.remove('voted');
      totalVotes += vote === 'upvote' ? 1 : -1;
    }
  }

  totalVotesElement.textContent = totalVotes;
}
