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
  if(!scrollDownIcon) return;
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
        const progress = Math.min(timeElapsed / 200, 1);
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
    }, 350);
  }

  // Exponha para uso externo (seta)
  window.smoothScrollToSection = function(section, direction) {
    const idx = Array.from(sections).indexOf(section);
    if (idx !== -1) {
      smoothScrollTo(idx + direction);
    }
  };

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
        rect.top < window.innerHeight * 0.4 &&
        rect.bottom > window.innerHeight * 0.4;

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

// Adiciona o evento de clique para cada seta
document.querySelectorAll('.arrow-down').forEach(arrow => {
  arrow.addEventListener('click', function (e) {
    let section = arrow.closest('.scroll-section');
    if (section && typeof window.smoothScrollToSection === 'function') {
      window.smoothScrollToSection(section, 1); // 1 = próxima seção
    }
  });
});

window.addEventListener('load', function () {
    setTimeout(function () {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => { 
        loader.style.display = 'none';
    }, 500);
    }, 1500);
});

function parallaxBackgroundVideos() {
  const videos = document.querySelectorAll('.background-video');
  const scrollY = window.scrollY || window.pageYOffset;
  videos.forEach(video => {
    const speed = 0.8; 
    const offset = video.parentElement.offsetTop;
    const yPos = (scrollY - offset) * speed;
    video.style.transform = `translateY(${yPos}px)`;
  });
}

window.addEventListener('scroll', parallaxBackgroundVideos);
window.addEventListener('resize', parallaxBackgroundVideos);

// Inicialização
window.addEventListener("DOMContentLoaded", () => {
  initScrollDownVisibility();
  initScrollSections();
  initSectionAnimationOnScroll();
});