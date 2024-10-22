import { updateStreamerBarCarouselFromDonut } from './updateStreamerBarCarouselFromDonut.js';
import { makeTopCategoriesCarousels } from './makeTopCategoriesCarousels.js';
import { saveClip } from './saveClip.js';

// TODO - prioritize backend
// High Priority
// 1. follows, notifications
// 2. profile/login
// 3. explore?
// 4. get box art for each category <=
// Low Priority
// 1. like, dislike, favorite => up arrow, down arrow, star
// Extra
// 1. youutube, kick
// 2. reddit label for if posted on reddit, maybe view comments section within site
// Debug
// 1. check if category in category-ids else make request and add to category-ids
// 2. various errors in console

document.querySelector('.carousel-control-next').addEventListener('click', () => replaceCarouselItem(1));
document.querySelector('.carousel-control-prev').addEventListener('click', () => replaceCarouselItem(-1));

document.getElementById('like-button').addEventListener('click', () => saveClip("liked-clips"));
document.getElementById('dislike-button').addEventListener('click', () => saveClip("disliked-clips"));
document.getElementById('favorite-button').addEventListener('click', () => saveClip("favorited-clips"));

document.getElementById('clips-tracker-button').addEventListener('click', () => window.location.href="index.html");
document.getElementById('saved-clips-button').addEventListener('click', () => window.location.href="likesAndDislikes.html");
document.getElementById('log-in-button').addEventListener('click', () => window.location.href="logIn.html");
document.getElementById('trending-button').addEventListener('click', () => window.location.href="trending.html");
document.getElementById('following-button').addEventListener('click', () => window.location.href="following.html");
document.getElementById('search-button').addEventListener('click', () => window.location.href="search.html");
document.getElementById('history-button').addEventListener('click', () => window.location.href="history.html");
document.getElementById('profile-button').addEventListener('click', () => window.location.href="profile.html");
document.getElementById('settings-button').addEventListener('click', () => window.location.href="settings.html");

document.getElementById('donut-button-top').addEventListener('click', () => updateStreamerBarCarouselFromDonut(1));
document.getElementById('donut-button-right').addEventListener('click', () => updateStreamerBarCarouselFromDonut(7));
document.getElementById('donut-button-bottom').addEventListener('click', () => updateStreamerBarCarouselFromDonut(30));
document.getElementById('donut-button-left').addEventListener('click', () => updateStreamerBarCarouselFromDonut(365));

makeTopCategoriesCarousels();