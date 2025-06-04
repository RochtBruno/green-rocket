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

document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const menuIcon = document.getElementById('menuIcon');
    const menuDropdown = document.getElementById('menuDropdown');
    const closeMenu = document.getElementById('closeMenu');
    
    menuIcon.addEventListener('click', function() {
        menuDropdown.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    closeMenu.addEventListener('click', function() {
        menuDropdown.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Controle de seções
    const sections = document.querySelectorAll('.scroll-section');
    const scrollIcon = document.getElementById('scrollDownIcon');
    const scrollIndicators = document.getElementById('scrollIndicators');
    let currentSection = 0;
    let isAnimating = false;
    
    // Cria os indicadores
    function createIndicators() {
        sections.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            if (index === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                if (!isAnimating && index !== currentSection) {
                    navigateToSection(index);
                }
            });
            
            scrollIndicators.appendChild(indicator);
        });
    }
    
    // Navegação para seção específica
    function navigateToSection(index) {
        if (isAnimating || index < 0 || index >= sections.length) return;
        
        isAnimating = true;
        const direction = index > currentSection ? 1 : -1;
        
        // Esconde a seção atual
        gsap.to(sections[currentSection], {
            opacity: 0,
            y: direction > 0 ? -10 : 10,
            duration: 0.1,
            ease: "power2.inOut",
            onComplete: () => {
                sections[currentSection].classList.remove('active');
            }
        });
        
        // Mostra a nova seção
        sections[index].classList.add('active');
        gsap.fromTo(sections[index], 
            { opacity: 0, y: direction > 0 ? 10 : -10 },
            { 
                opacity: 1, 
                y: 0,
                duration: 0.1,
                ease: "power2.inOut",
                onComplete: () => {
                    currentSection = index;
                    isAnimating = false;
                    updateUI();
                }
            }
        );
        
        // Animação dos textos
        gsap.fromTo(sections[index].querySelector('.hero-content, .section-content'), 
            { opacity: 0, y: 15 },
            {
                opacity: 1,
                y: 0,
                duration: 0.3,
                delay: 0,
                ease: "power2.out"
            }
        );
    }
    
    // Navegação por direção
    function navigateSections(direction) {
        const newSection = currentSection + direction;
        navigateToSection(newSection);
    }
    
    // Atualiza UI (ícone e indicadores)
    function updateUI() {
        // Atualiza indicadores
        document.querySelectorAll('.scroll-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSection);
        });
        
        // Mostra/esconde ícone de scroll
        if (currentSection === sections.length - 1) {
            gsap.to(scrollIcon, {
                opacity: 0,
                duration: 0.1,
                ease: "power2.out",
                onComplete: () => {
                    scrollIcon.style.display = 'none';
                }
            });
        } else {
            scrollIcon.style.display = 'flex';
            gsap.to(scrollIcon, {
                opacity: 0.9,
                duration: 0.1,
                delay: 0.1,
                ease: "power2.out"
            });
        }
    }
    
    // Configura controles de navegação
    function setupNavigation() {
        // Wheel event
        window.addEventListener('wheel', function(e) {
            if (Math.abs(e.deltaY) < 5 || isAnimating) return;
            navigateSections(Math.sign(e.deltaY));
        }, { passive: true });
        
        // Keyboard events
        window.addEventListener('keydown', function(e) {
            if (isAnimating) return;
            if (e.key === 'ArrowDown') navigateSections(1);
            if (e.key === 'ArrowUp') navigateSections(-1);
        });
        
        // Scroll icon click
        scrollIcon.addEventListener('click', function() {
            if (!isAnimating) navigateSections(1);
        });
        
        // Touch events
        let touchStartY = 0;
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (isAnimating) return;
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            if (Math.abs(diff) > 50) {
                navigateSections(diff > 0 ? 1 : -1);
            }
        }, { passive: true });
    }
    
    // Inicialização
    createIndicators();
    setupNavigation();
    updateUI();
    
    // Mostra o ícone após um breve delay
    setTimeout(() => {
        if (currentSection !== sections.length - 1) {
            scrollIcon.style.display = 'flex';
            gsap.to(scrollIcon, {
                opacity: 0.9,
                duration: 0.1,
                ease: "power2.out"
            });
        }
    }, 1000);
});