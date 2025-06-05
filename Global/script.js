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
})

document.addEventListener("scroll", () => {
    const scrollDownIcon = document.getElementById("scrollDownIcon");
    if (window.scrollY > 200) {
        scrollDownIcon.classList.add("hidden");
    } else {
        scrollDownIcon.classList.remove("hidden");
    }
});