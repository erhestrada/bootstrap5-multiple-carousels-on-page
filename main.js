import { makeTopCategoriesNewCarousels } from './makeTopCategoriesNewCarousels.js';
import { saveClip } from './saveClip.js';
import { followStreamer } from './followStreamer.js';
import { followCategory } from './followCategory.js';
import { makeFollowedCategoriesCarousels } from './makeFollowedCategoriesCarousels.js';
import { toggleClipPlayer } from './toggleClipPlayer.js';
import { playAdjacentClip, changeCarousel } from './clipNavigation.js';
import { updateStreamerBarCarousel } from './updateStreamerBarCarousel.js'
import {updateVotes} from './updateVotes.js'

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

localStorage?.removeItem('highlightedDivId');

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

const upvoteButton = document.getElementById('like-button');
const downvoteButton = document.getElementById('dislike-button');

upvoteButton.addEventListener('click', () => {
  updateVotes('upvote');
  saveClip('liked-clips');
});

downvoteButton.addEventListener('click', () => {
  updateVotes('downvote');
  saveClip('disliked-clips');
});

document.getElementById('favorite-button').addEventListener('click', () => saveClip("favorited-clips"));
document.getElementById('follow-streamer-button').addEventListener('click', () => followStreamer(localStorage.getItem('currentClipStreamer'), localStorage.getItem('currentClipStreamerId')));
document.getElementById('follow-category-button').addEventListener('click', () => followCategory(window.currentClipPosition['game']));

document.getElementById('donut-button-top').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 1));
document.getElementById('donut-button-right').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 7));
document.getElementById('donut-button-bottom').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 30));
// think ALL is the default if not start/end parameters
document.getElementById('donut-button-left').addEventListener('click', () => updateStreamerBarCarousel(window.currentStreamerId, 5500));

//document.getElementById('followed-categories-button').addEventListener('click', () => makeFollowedCategoriesCarousels());

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
