export class SmartCarousel {
    constructor(carouselRowId, itemsPerView = 4) {
        this.carouselRow = document.getElementById(carouselRowId);
        this.carousel = this.carouselRow.querySelector('.carousel');
        this.prevBtn = this.carouselRow.querySelector('.prevBtn');
        this.nextBtn = this.carouselRow.querySelector('.nextBtn');
        
        this.itemsPerView = itemsPerView;
        this.currentIndex = 0;
        this.totalItems = 0;
        this.items = [];
        this.itemsInView = [];
        this.viewPosition = 0; // track which view the carousel is currently displaying
        
        this.init();
    }
    
    init() {
        this.updateCarousel();
        this.bindEvents();
    }
    
    setItems(carouselItems) {
        this.items = carouselItems;
        this.totalItems = carouselItems.length;
        this.currentIndex = 0;
        
        // Clear existing items
        this.carousel.innerHTML = '';
        
        // Add new items
        carouselItems.forEach(carouselItem => {
            this.carousel.appendChild(carouselItem);
        });
        
        this.updateCarousel();
    }
    
    updateItemsInView() {
        // Calculate which items are currently in view
        const endIndex = Math.min(this.currentIndex + this.itemsPerView, this.totalItems);
        this.itemsInView = this.items.slice(this.currentIndex, endIndex);
    }
    
    updateCarousel() {
        if (this.totalItems === 0) return;
        
        // Update which items are in view
        this.updateItemsInView();
        
        // Simple percentage-based translation
        // Each item effectively takes 25% of container space
        const translatePercent = this.currentIndex * 25;
        
        this.carousel.style.transform = `translateX(-${translatePercent}%)`;
        
        // Update button states
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.totalItems - this.itemsPerView;
    }
    
    getNextScrollAmount() {
        const remainingItems = this.totalItems - this.currentIndex;
        
        // If we can show a full group of itemsPerView after scrolling by itemsPerView
        if (remainingItems > this.itemsPerView * 2) {
            return this.itemsPerView;
        }
        
        // If we're close to the end, calculate how much to scroll to show the last itemsPerView items
        if (remainingItems > this.itemsPerView) {
            return remainingItems - this.itemsPerView;
        }
        
        // Can't scroll anymore
        return 0;
    }
    
    getPrevScrollAmount() {
        // If we can scroll back by a full itemsPerView, do it
        if (this.currentIndex >= this.itemsPerView) {
            return this.itemsPerView;
        }
        
        // Otherwise, scroll back to the beginning
        return this.currentIndex;
    }
    
    nextSlide() {
        const scrollAmount = this.getNextScrollAmount();
        if (scrollAmount > 0) {
            this.currentIndex += scrollAmount;
            this.updateCarousel();
        }
    }
    
    prevSlide() {
        const scrollAmount = this.getPrevScrollAmount();
        if (scrollAmount > 0) {
            this.currentIndex -= scrollAmount;
            this.updateCarousel();
        }
    }
    
    // Getter method to access current items in view
    getCurrentItemsInView() {
        return this.itemsInView;
    }
    
    bindEvents() {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
}
