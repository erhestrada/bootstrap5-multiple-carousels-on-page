import { makeNewCarouselForCategory } from "./makeNewCarouselForCategory";
import { makeNewCarouselForStreamer } from "./makeNewCarouselForStreamer";

export async function makeSearchCarousel(name, twitchId, thumbnailUrl, type) {
    console.log("name", name);
    console.log("type", type);
    const daysBack = 1;
    if (type === "category") {
        makeNewCarouselForCategory();
    } else if (type === "streamer") {
        const categoriesCarousels = document.getElementById('categories-carousels'); // TODO: handle case where streamer has no clips, right now pfp shows then disappears
        categoriesCarousels.innerHTML = '';
        makeNewCarouselForStreamer(name, twitchId, thumbnailUrl, daysBack);
    }
}
