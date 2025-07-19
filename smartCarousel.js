export class SmartCarousel {
    constructor(itemsPerView = 4) {
        this.carousel = document.getElementById('carousel');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.itemsPerView = itemsPerView;
        this.currentIndex = 0;
        this.totalItems = 0;
        
        this.init();
    }
    
    init() {
        this.updateCarousel();
        this.bindEvents();
    }
    
    setItems(items) {
        this.totalItems = items.length;
        this.currentIndex = 0;
        
        // Clear existing items
        this.carousel.innerHTML = '';
        
        // Add new items
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carousel-element';
            itemElement.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.content}</p>
            `;
            this.carousel.appendChild(itemElement);
        });
        
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (this.totalItems === 0) return;
        
        // Get the actual width of one item including margin
        const firstItem = this.carousel.querySelector('.carousel-element');
        if (firstItem) {
            const itemWidth = firstItem.offsetWidth + 20; // width + margin-right
            const containerWidth = this.carousel.parentElement.offsetWidth;
            const translatePercent = (this.currentIndex * itemWidth / containerWidth) * 100;
            
            this.carousel.style.transform = `translateX(-${translatePercent}%)`;
        } else {
            // Fallback to 25% if items aren't rendered yet
            const translateX = -this.currentIndex * 25;
            this.carousel.style.transform = `translateX(${translateX}%)`;
        }
        
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
    
    bindEvents() {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
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
