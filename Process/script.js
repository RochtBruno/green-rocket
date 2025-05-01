document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menuIcon');
    const menuDropdown = document.getElementById('menuDropdown');
    const closeMenu = document.getElementById('closeMenu');
    const header = document.querySelector('.header');

    // Toggle menu
    menuIcon.addEventListener('click', () => {
        menuIcon.classList.add('active');
        menuDropdown.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close menu
    closeMenu.addEventListener('click', () => {
        menuIcon.classList.remove('active');
        menuDropdown.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuDropdown.contains(e.target) && !menuIcon.contains(e.target)) {
            menuIcon.classList.remove('active');
            menuDropdown.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Carousel functionality
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.step-box');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.carousel-dot');
    
    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1200) return 2;
        return 3;
    }
    
    function updateCarousel() {
        cardsPerView = getCardsPerView();
        const cardWidth = cards[0].offsetWidth + 20; // 20px for gap
        const maxIndex = cards.length - cardsPerView;
        
        // Ensure currentIndex doesn't exceed maxIndex
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Update button states
        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextButton.addEventListener('click', () => {
        const maxIndex = cards.length - cardsPerView;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Update carousel on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 250);
    });
    
    // Initial update
    updateCarousel();
}); 

document.addEventListener("scroll", () => {
    const scrollDownIcon = document.getElementById("scrollDownIcon");
    if (window.scrollY > 200) {
        scrollDownIcon.classList.add("hidden");
    } else {
        scrollDownIcon.classList.remove("hidden");
    }
});