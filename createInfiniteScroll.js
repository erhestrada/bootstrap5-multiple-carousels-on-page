let currentNumber = 1;
const contentContainer = document.body;

export function createInfiniteScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        addItems(10);
    }
}

function addItems(count) {
    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.classList.add('item');
        item.textContent = currentNumber++;
        contentContainer.appendChild(item);
    }
}

/* add carouselN
    <div id="carousel2" class="carousel slide">
      <p>Popular Clips from Streamer</p>
      <div class="carousel-inner" id="carousel2-inner">
      </div>

      <button class="carousel-control-prev" type="button">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>

    </div>

*/