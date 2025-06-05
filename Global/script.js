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

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.scroll-section');
    let currentSectionIndex = 0;
    let isScrolling = false;

    // Configura o IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const direction = entry.isIntersecting ? 
                (entry.boundingClientRect.top < 0 ? 'down' : 'up') : 
                (entry.boundingClientRect.top < 0 ? 'up' : 'down');
    
            if (entry.isIntersecting) {
                // Seção entrando na viewport
                section.classList.remove('exiting-up', 'exiting-down');
                section.classList.add('active', `entering-${direction}`);
                
                // Remove classes de entrada após a animação
                setTimeout(() => {
                    section.classList.remove(`entering-${direction}`);
                }, 700);
            } else {
                // Seção saindo da viewport
                section.classList.remove('active', 'entering-up', 'entering-down');
                section.classList.add(`exiting-${direction}`);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observa todas as seções
    sections.forEach(section => observer.observe(section));

    // Função para scroll suave
    function smoothScrollTo(targetIndex) {
        if (isScrolling || targetIndex < 0 || targetIndex >= sections.length) return;
        
        isScrolling = true;
        const target = sections[targetIndex];
        const targetPosition = target.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animateScroll(currentTime) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / 500, 1); // 800ms de duração
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
            
            if (timeElapsed < 500) {
                requestAnimationFrame(animateScroll);
            } else {
                isScrolling = false;
                currentSectionIndex = targetIndex;
            }
        }

        requestAnimationFrame(animateScroll);
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Controle de scroll com roda do mouse
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;
        
        if (e.deltaY > 0) {
            smoothScrollTo(currentSectionIndex + 1); // Scroll para baixo
        } else {
            smoothScrollTo(currentSectionIndex - 1); // Scroll para cima
        }
    }, { passive: false });

    // Controle para touch devices
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 50) { // Sensibilidade do swipe
            if (diff > 0) {
                smoothScrollTo(currentSectionIndex + 1); // Swipe para cima
            } else {
                smoothScrollTo(currentSectionIndex - 1); // Swipe para baixo
            }
        }
    }, { passive: false });

    // Ativa a primeira seção ao carregar
    if (sections.length > 0) {
        sections[0].classList.add('active');
    }
});