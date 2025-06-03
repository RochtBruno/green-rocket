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

    // Carrossel
    const track = document.querySelector('.carousel-track');
    const container = document.querySelector('.carousel-container');
    const items = document.querySelectorAll('.carousel-item');
    
    if (track && container && items.length > 0) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Mouse events
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        // Touch events
        container.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('touchend', () => {
            isDown = false;
        });

        container.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        // Adiciona cursor grab ao container
        container.style.cursor = 'grab';
    }
}); 

document.addEventListener("scroll", () => {
    const scrollDownIcon = document.getElementById("scrollDownIcon");
    if (window.scrollY > 200) {
        scrollDownIcon.classList.add("hidden");
    } else {
        scrollDownIcon.classList.remove("hidden");
    }
});

