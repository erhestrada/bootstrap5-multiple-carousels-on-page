import { postVote, deleteVote } from './votes'

export function updateVotes(button, vote) {
    const totalVotesElement = document.getElementById('total-votes');
    let totalVotes = parseInt(totalVotesElement.textContent, 10) || 0;

    const voteIcon = button.querySelector('.vote-icon');

    const oppositeVote = vote === 'upvote' ? 'downvote' : 'upvote';
    const oppositeButton = document.getElementById(oppositeVote + '-button');
    const oppositeVoteIcon = oppositeButton.querySelector('.vote-icon');

    const voteIconAlreadyClicked = voteIcon.classList.contains('voted');
    const oppositeVoteIconAlreadyClicked = oppositeVoteIcon.classList.contains('voted');

    const userId = window.userId;
    const clientId = window.clientId;
    const clipId = getClipId();

    if (voteIconAlreadyClicked) {
        voteIcon.classList.remove('voted');
        removeClip(getVoteStorageKey(vote));
        // turning upvote off -> -1, turning downvote off -> +1
        totalVotes += vote === 'upvote' ? -1 : 1;
    } else {
        voteIcon.classList.add('voted');
        saveClip(getVoteStorageKey(vote));
        postVote(userId, clientId, clipId, vote);
        // +1 for upvote -1 for downvote
        totalVotes += vote === 'upvote' ? 1 : -1;

    if (oppositeVoteIconAlreadyClicked) {
        oppositeVoteIcon.classList.remove('voted');
        removeClip(getVoteStorageKey(oppositeVote));
        // if vote is 'upvote' opposite vote is downvote and removing downvote -> +1; if vote is 'downvote' opposite vote is upvote and removing upvote -> -1
        totalVotes += vote === 'upvote' ? 1 : -1;
    }
    }

    totalVotesElement.textContent = totalVotes;
}

function getVoteStorageKey(vote) {
  return vote === 'upvote' ? 'upvotedClips' : 'downvotedClips';
}

export function removeClip(label) {
  let { game, index } = window.currentClipPosition;

  const gameClipsData = window.clipsData[game];
  const clipData = gameClipsData[index];

  const jsonSavedClipsData = localStorage.getItem(label);
  const savedClipsData = JSON.parse(jsonSavedClipsData || '[]');

  const updatedClips = savedClipsData.filter(savedClip =>
    JSON.stringify(savedClip) !== JSON.stringify(clipData)
  );

  localStorage.setItem(label, JSON.stringify(updatedClips));
}

export function saveClip(label) {
  let {game, index} = window.currentClipPosition;

  const gameClipsData = window.clipsData[game];
  const clipData = gameClipsData[index];

  const jsonSavedClipsData = localStorage.getItem(label);
  const savedClipsData = JSON.parse(jsonSavedClipsData || '[]');
  savedClipsData.push(clipData);
  localStorage.setItem(label, JSON.stringify(savedClipsData));
}

function getClipId() {
  let {game, index} = window.currentClipPosition;
  const gameClipsData = window.clipsData[game];
  const clipData = gameClipsData[index];
  const clipId = clipData.id;
  return clipId;
}