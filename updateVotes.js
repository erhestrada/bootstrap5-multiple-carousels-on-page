export function updateVotes(button, vote) {
  const voteIcon = button.querySelector('.vote-icon');
  voteIcon.classList.toggle('voted');

  const totalVotesElement = document.getElementById('total-votes');
  let totalVotes = parseInt(totalVotesElement.textContent, 10) || 0;

  const voted = voteIcon.classList.contains('voted');

  if (vote === 'upvote') {
    if (voted) {
      totalVotes += 1;
    } else {
      totalVotes -= 1;
    }
  } else if (vote === 'downvote') {
    if (voted) {
      totalVotes -= 1;
    } else {
      totalVotes += 1;
    }
  }

  totalVotesElement.textContent = totalVotes;
}