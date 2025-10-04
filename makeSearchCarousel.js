import { makeNewCarouselForCategory } from "./makeNewCarouselForCategory";
import { makeNewCarouselForStreamer } from "./makeNewCarouselForStreamer";

export async function makeSearchCarousel(name, twitchId, thumbnailUrl, type) {
    const categoriesCarousels = document.getElementById('categories-carousels'); // TODO: handle case where streamer has no clips, right now pfp shows then disappears
    categoriesCarousels.innerHTML = '';

    const daysBack = 1;
    if (type === "category") {
        makeNewCarouselForCategory(name, twitchId, thumbnailUrl);
    } else if (type === "streamer") {
        makeNewCarouselForStreamer(name, twitchId, thumbnailUrl, daysBack);
    }
}
