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
import { getRedditPosts } from './get-reddit-posts.js';
import { makeTopStreamersNewCarousels } from './makeTopStreamersNewCarousels.js';
import { positionCarouselTabButtons } from './positionCarouselTabButtons.js';
import { toggleStreamerBarCarousel } from './toggleStreamerBarCarousel.js';
import { setupLogin } from './setupLogin.js';

// TODO: fix centering of streamer bar carousel
// TODO: autoplay?

window.clientId = getClientId();
window.userId = null;
window.userIdPromise = getSignedOutUser(window.clientId);
window.username = null;
window.follows = null;

const redditPostsPromise = getRedditPosts();
window.redditPosts = null;

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
  const usernameElement = document.getElementById('navbar-username');
  usernameElement.textContent = username;

  console.log('userId', userId);
  localStorage.setItem('userId', userId);
  localStorage.setItem('username', username);
  buttonsNeedingUser.forEach(button => button.disabled = false);
  setupLogin(userId);

  const followsPromise = getFollows(userId);
  followsPromise.then(follows => {
    window.follows = follows;
    followButtons.forEach(button => button.disabled = false);
  });
});


document.querySelector('#clip-player .my-carousel-control-next').addEventListener('click', () => playAdjacentClip('next'));
document.querySelector('#clip-player .my-carousel-control-prev').addEventListener('click', () => playAdjacentClip('prev'));
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

document.getElementById('theater-mode-button').addEventListener('click', toggleStreamerBarCarousel);
document.querySelectorAll('.pfp').forEach(pfp => {
  pfp.addEventListener('click', toggleStreamerBarCarousel);
});

document.getElementById('donut-button-top').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 1));
document.getElementById('donut-button-right').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 7));
document.getElementById('donut-button-bottom').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 30));
// think ALL is the default if not start/end parameters
document.getElementById('donut-button-left').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 5500));

document.getElementById('disclosure-button').addEventListener('click', toggleClipPlayer);

// TODO: Following carousels need update on follow button click
async function makeCarousels() {
  const followedCategoriesCarouselsContainer = document.getElementById('followed-categories');
  makeFollowingCarousels({ categories: true, container: followedCategoriesCarouselsContainer });

  const topCategoriesCarouselsContainer = document.getElementById('top-categories');
  makeTopCategoriesNewCarousels(topCategoriesCarouselsContainer);
}

// TODO: refactor to window.carouselItems loop through and add reddit icon after so not holding up carousels
redditPostsPromise.then(redditPosts => {
  window.redditPosts = redditPosts;
  makeCarousels();
});

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

    if (targetId === "top-streamers") {
      makeTopStreamersNewCarousels();
    } else if (targetId === "followed-streamers") {
      const followedStreamersCarouselsContainer = document.getElementById('followed-streamers');
      makeFollowingCarousels({ streamers: true, container: followedStreamersCarouselsContainer });
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

    // Submit comment when enter pressed
    const textarea = document.getElementById('new-comment');
    if (textarea) {
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitComment();
            }
        });
    }

});

positionCarouselTabButtons();
