import { makeNewCarouselForCategory } from "./makeNewCarouselForCategory";
import { makeNewCarouselForStreamer } from "./makeNewCarouselForStreamer";

// TODO: not getting all clips for category? compare to twitch last 24hrs e.g. ffX
export async function makeSearchCarousel(name, twitchId, thumbnailUrl, type) {
    // TODO: I don't need this anymore - remove when in working state
    const categoriesCarousels = document.getElementById('categories-carousels'); // TODO: handle case where streamer has no clips, right now pfp shows then disappears
    categoriesCarousels.innerHTML = '';

    const searchTab = document.getElementById('search-tab');
    searchTab.innerHTML = '';

    const daysBack = 1;
    if (type === "category") {
        const clipsData = await makeNewCarouselForCategory(name, twitchId, thumbnailUrl, searchTab, "search");
        window.topCategoriesClipsData = clipsData.data; // Weird naming but doing this for compatibility with followCategory
    } else if (type === "streamer") {
        makeNewCarouselForStreamer(name, twitchId, thumbnailUrl, searchTab, "search", daysBack);
    }
}
