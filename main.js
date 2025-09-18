import { makeTopCategoriesNewCarousels } from './makeTopCategoriesNewCarousels.js';
import { followStreamer } from './followStreamer.js';
import { followCategory } from './followCategory.js';
import { makeFollowedCategoriesCarousels } from './makeFollowedCategoriesCarousels.js';
import { toggleClipPlayer } from './toggleClipPlayer.js';
import { playAdjacentClip, changeCarousel } from './clipNavigation.js';
import { updateStreamerBarCarousel } from './updateStreamerBarCarousel.js'
import { updateVotes } from './updateVotes.js'
import { updateFavorites } from './updateFavorites.js';
import { getClientId } from './get-client-id.js';
import { getSignedOutUserId } from './users'
import { getFollows } from './follows';
import { comments, submitComment } from './comment-handlers/comment-handler.js';
import { hideDeleteModal, confirmDelete } from './comment-handlers/delete-comment-handler.js';

window.clientId = getClientId();
window.userId = null;
window.userIdPromise = getSignedOutUserId(window.clientId);
window.follows = null;

window.clipsData = {};
window.firstThumbnail = false;
window.thumbnailWrappers = {}; // The divs that are highlighted
window.orderedCarousels = [];
window.activeCarousel = '';
window.carouselIndex = 0;
window.lastThumbnailIndexInCarousel = {};
window.carouselInstances = {};
window.boxArtUrls = {};
window.watchHistory = [];
window.currentStreamerId = '';
window.currentClip = {};
window.clipComments = comments;

const upvoteButton = document.getElementById('upvote-button');
const downvoteButton = document.getElementById('downvote-button');
const favoriteButton = document.getElementById('favorite-button');
const followStreamerButton = document.getElementById('follow-streamer-button');
const followCategoryButton = document.getElementById('follow-category-button');

const buttonsNeedingUser = [upvoteButton, downvoteButton, favoriteButton];
buttonsNeedingUser.forEach(button => button.disabled = true);

const followButtons = [followStreamerButton, followCategoryButton];
followButtons.forEach(button => button.disabled = true);

window.userIdPromise.then(userId => {
  window.userId = userId;
  buttonsNeedingUser.forEach(button => button.disabled = false);

  const followsPromise = getFollows(userId);
  followsPromise.then(follows => {
    window.follows = follows;
    followButtons.forEach(button => button.disabled = false);
  });
});

document.querySelector('#carouselExampleControls .carousel-control-next').addEventListener('click', () => playAdjacentClip('next'));
document.querySelector('#carouselExampleControls .carousel-control-prev').addEventListener('click', () => playAdjacentClip('prev'));
document.querySelector('#next-carousel-button').addEventListener('click', () => changeCarousel('next'));
document.querySelector('#previous-carousel-button').addEventListener('click', () => changeCarousel('previous'));

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    changeCarousel('previous');
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    changeCarousel('next');
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    playAdjacentClip('prev');
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    playAdjacentClip('next');
  }
});

upvoteButton.addEventListener('click', () => updateVotes(upvoteButton, 'upvote'));
downvoteButton.addEventListener('click', () => updateVotes(downvoteButton, 'downvote'));
favoriteButton.addEventListener('click', () => updateFavorites(favoriteButton));
followStreamerButton.addEventListener('click', () => followStreamer(window.userId, window.currentClip.broadcaster_name, window.currentClip.broadcaster_id));
followCategoryButton.addEventListener('click', () => followCategory(window.userId, window.currentClipPosition['game']));

document.getElementById('donut-button-top').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 1));
document.getElementById('donut-button-right').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 7));
document.getElementById('donut-button-bottom').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 30));
// think ALL is the default if not start/end parameters
document.getElementById('donut-button-left').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 5500));

document.getElementById('disclosure-button').addEventListener('click', toggleClipPlayer);

makeTopCategoriesNewCarousels(window.pageNumber);

const toggle = document.getElementById('modeToggle');
const labelLeft = document.getElementById('label-left');
const labelRight = document.getElementById('label-right');

const updateLabels = () => {
  if (toggle.checked) {
    labelLeft.style.opacity = '0.4';
    labelRight.style.opacity = '1';
    makeFollowedCategoriesCarousels();
  } else {
    labelLeft.style.opacity = '1';
    labelRight.style.opacity = '0.4';
    const categoriesCarousels = document.getElementById('categories-carousels');
    categoriesCarousels.innerHTML = '';
    makeTopCategoriesNewCarousels(window.pageNumber); // This doesn't work
  }
};

toggle.addEventListener('change', updateLabels);

// -------------------------------- Comments ------------------------------

// Allow Enter to post comment
document.getElementById('new-comment').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        submitComment();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const postBtn = document.querySelector('.comment-btn');
    postBtn.addEventListener('click', () => submitComment());

    const deleteCancelButton = document.querySelector('.delete-modal-btn.delete-cancel');
    deleteCancelButton.addEventListener('click', hideDeleteModal);

    const deleteConfirmButton = document.querySelector('.delete-modal-btn.delete-confirm');
    deleteConfirmButton.addEventListener('click', () => confirmDelete());
});
