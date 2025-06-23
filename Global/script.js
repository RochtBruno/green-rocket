function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function handleHeaderScroll() {
  const header = document.querySelector(".header");
  window.scrollY > 50
    ? header.classList.add("scrolled")
    : header.classList.remove("scrolled");
}

function handleScrollDownIcon() {
  const scrollDownIcon = document.getElementById("scrollDownIcon");
  scrollDownIcon.classList.toggle("hidden", window.scrollY > 200);
}



function initScrollDownVisibility() {
  window.addEventListener("scroll", handleScrollDownIcon);
}

function initScrollSections() {
  const sections = document.querySelectorAll(".scroll-section");
  let currentSectionIndex = 0;
  let isScrolling = false;

  function smoothScrollTo(targetIndex) {
    if (isScrolling) return;
  
    // Forçar um reflow antes de iniciar novas animações
    document.body.getBoundingClientRect();
    if (isScrolling || targetIndex < 0 || targetIndex >= sections.length)
      return;

    isScrolling = true;
    const currentSection = sections[currentSectionIndex];
    const targetSection = sections[targetIndex];
    currentSection.classList.add("exiting");

    setTimeout(() => {
      currentSection.classList.remove("exiting", "entering");

      const start = window.pageYOffset;
      const end = targetSection.offsetTop;
      const distance = end - start;
      let startTime = null;

      function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / 100, 1);
        window.scrollTo(0, start + distance * easeInOutCubic(progress));

        if (timeElapsed < 300) {
          requestAnimationFrame(animate);
        } else {
          currentSectionIndex = targetIndex;
          targetSection.classList.add("entering");
          isScrolling = false;
        }
      }

      requestAnimationFrame(animate);
    }, 200);
  }

  // Mouse wheel scroll
  window.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (isScrolling) return;
      smoothScrollTo(currentSectionIndex + (e.deltaY > 0 ? 1 : -1));
    },
    { passive: false }
  );

  // Touch scroll
  let touchStartY = 0;
  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (e) => {
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        smoothScrollTo(currentSectionIndex + (diff > 0 ? 1 : -1));
      }
    },
    { passive: false }
  );

  // Ativa a primeira seção
  if (sections.length > 0) {
    sections[0].classList.add("active");
  }
}

function initSectionAnimationOnScroll() {
  const sections = document.querySelectorAll(".scroll-section");
  let previousScroll = window.scrollY;

  function handleScroll() {
    const currentScroll = window.scrollY;
    previousScroll = currentScroll;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const isHalfVisible =
        rect.top < window.innerHeight * 0.7 &&
        rect.bottom > window.innerHeight * 0.3;

      section.classList.remove("entering", "exiting");

      if (isHalfVisible) {
        section.classList.add("entering", "entered");
      } else if (section.classList.contains("entered")) {
        section.classList.add("exiting");
      }
    });
  }
  window.addEventListener("load", handleScroll);
}

    document.body.classList.add('loading');
    const start = Date.now();

    window.addEventListener('load', function () {
        const loader = document.getElementById('loader');
        const MIN_LOADING_TIME = 1500;

        function hideLoader() {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            document.body.classList.remove('loading');

            // Mostra o texto da primeira seção imediatamente
            document.querySelector('.hero-content').style.opacity = '1';
            document.querySelector('.hero-content').style.transform = 'none';

            // Esconde o vídeo da primeira seção por 600ms
            const heroVideo = document.querySelector('.hero .background-video');
            if (heroVideo) {
                heroVideo.classList.add('hide');
                setTimeout(() => {
                    heroVideo.classList.remove('hide');
                }, 100);
            }

            // ⚠️ Diagnóstico rápido: força scroll para ativar animações baseadas em scroll
            window.scrollTo(0, 1);
            window.scrollTo(0, 0);
            window.dispatchEvent(new Event('scroll'));
        }

        const elapsed = Date.now() - start;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);
        setTimeout(hideLoader, remainingTime);

        // vídeos carregam depois do conteúdo principal
        const videos = document.querySelectorAll('video[data-src]');
        videos.forEach(video => {
            const source = video.querySelector('source');
            source.src = video.getAttribute('data-src');
            video.load();
        });
    });


// Inicialização
window.addEventListener("DOMContentLoaded", () => {
  initScrollDownVisibility();
  initScrollSections();
  initSectionAnimationOnScroll();
});