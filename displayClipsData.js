export function displayClipsData(clipsDataForStreamer, containerId) {
    const embedUrls = clipsDataForStreamer.data.map((datum) => datum.embed_url);
    const thumbnailUrls = clipsDataForStreamer.data.map((datum) => datum.thumbnail_url);

    const parentElement = document.getElementById(containerId);
    for (const thumbnailUrl of thumbnailUrls) {
        const thumbnailElement = document.createElement('img');
        thumbnailElement.src = thumbnailUrl;
        parentElement.appendChild(thumbnailElement);
    }

}