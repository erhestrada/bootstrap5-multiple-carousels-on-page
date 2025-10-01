import { makeTopCategoriesNewCarousels } from './makeTopCategoriesNewCarousels.js';
import { followStreamer } from './followStreamer.js';
import { followCategory } from './followCategory.js';
import { makeFollowingCarousels } from './makeFollowingCarousels.js';
import { toggleClipPlayer } from './toggleClipPlayer.js';
import { playAdjacentClip, changeCarousel } from './clipNavigation.js';
import { updateStreamerBarCarousel } from './updateStreamerBarCarousel.js'
import { updateVotes } from './updateVotes.js'
import { updateFavorites } from './updateFavorites.js';
import { getClientId } from './get-client-id.js';
import { getSignedOutUser } from './users'
import { getFollows } from './follows';
import { submitComment } from './comment-handlers/comment-handler.js';
import { hideDeleteModal, confirmDelete } from './comment-handlers/delete-comment-handler.js';
import { searchStreamers } from './search.js';

window.clientId = getClientId();
window.userId = null;
window.userIdPromise = getSignedOutUser(window.clientId);
window.username = null;
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
window.clipComments = [];
window.profilePictureUrl = '';

const upvoteButton = document.getElementById('upvote-button');
const downvoteButton = document.getElementById('downvote-button');
const favoriteButton = document.getElementById('favorite-button');
const followStreamerButton = document.getElementById('follow-streamer-button');
const followCategoryButton = document.getElementById('follow-category-button');

const buttonsNeedingUser = [upvoteButton, downvoteButton, favoriteButton];
buttonsNeedingUser.forEach(button => button.disabled = true);

const followButtons = [followStreamerButton, followCategoryButton];
followButtons.forEach(button => button.disabled = true);

window.userIdPromise.then(({ userId, username }) => {
  window.userId = userId;
  window.username = username;
  sessionStorage.setItem('username', window.username);
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

// -------Clip Tabs--------

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const tabIndicator = document.querySelector('.tab-indicator');

function moveIndicator(el) {
  const buttonRect = el.getBoundingClientRect();
  const containerRect = el.parentElement.getBoundingClientRect();

  const offsetLeft = buttonRect.left - containerRect.left;
  const width = buttonRect.width;

  tabIndicator.style.transform = `translateX(${offsetLeft}px)`;
  tabIndicator.style.width = `${width}px`;
}

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.tab;

    // Deactivate all buttons and tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Activate clicked tab and its content
    button.classList.add('active');
    document.getElementById(targetId).classList.add('active');

    // It makes more sense to just do display = none that way you don't have to reload
    if (targetId === "top-categories") {
      const categoriesCarousels = document.getElementById('categories-carousels');
      categoriesCarousels.innerHTML = '';
      makeTopCategoriesNewCarousels(window.pageNumber); // I don't even have window.pageNumber anymore <=== TODO
    } else if (targetId === "followed-categories") {
      makeFollowingCarousels({ categories: true });
    } else if (targetId === "followed-streamers") {
      makeFollowingCarousels({ streamers: true });
    }

    // Move the tab indicator
    moveIndicator(button);
  });
});

// Move the indicator to the default active tab on load
window.addEventListener('DOMContentLoaded', () => {
  const activeBtn = document.querySelector('.tab-btn.active');
  if (activeBtn) moveIndicator(activeBtn);
});
// -------------------Search Box------------------------------------------
const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('keyup', searchStreamers);

// -------------------------------- Comments ------------------------------

// Allow Enter to post comment
document.getElementById('new-comment').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        submitComment();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const postBtn = document.querySelector('.comment-btn');
    postBtn.addEventListener('click', submitComment);

    const deleteCancelButton = document.querySelector('.delete-modal-btn.delete-cancel');
    deleteCancelButton.addEventListener('click', hideDeleteModal);

    const deleteConfirmButton = document.querySelector('.delete-modal-btn.delete-confirm');
    deleteConfirmButton.addEventListener('click', () => confirmDelete());
});
