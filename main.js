import { updateStreamerBarCarouselFromDonut } from './updateStreamerBarCarouselFromDonut.js';
import { makeTopCategoriesCarousels } from './makeTopCategoriesCarousels.js';
import { saveClip } from './saveClip.js';
import { replaceCarouselItem } from './getTopClips.js';

// have to stringify and parse

function x(arrow) {
    let index = JSON.parse(localStorage.getItem('clipIndex'));
    const embedUrls = JSON.parse(localStorage.getItem('clipEmbedUrls'));
    const streamerIds = JSON.parse(localStorage.getItem('clipStreamerIds'));
    if (arrow === "next") {
        index++;
        localStorage.setItem('clipIndex', JSON.stringify(index));
    } else {
        if (index > 0) {
            index--;
            localStorage.setItem('clipIndex', JSON.stringify(index));
        }
    }

    replaceCarouselItem(index, embedUrls, streamerIds);

}

document.querySelector('#carouselExampleControls .carousel-control-next').addEventListener('click', () => x('next'));
document.querySelector('#carouselExampleControls .carousel-control-prev').addEventListener('click', () => x('prev'));


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
