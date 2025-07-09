document.body.style.overflow = "hidden";

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
  // let touchStartY = 0;
  // window.addEventListener(
  //   "touchstart",
  //   (e) => {
  //     touchStartY = e.touches[0].clientY;
  //   },
  //   { passive: true }
  // );

  // window.addEventListener(
  //   "touchend",
  //   (e) => {
  //     const diff = touchStartY - e.changedTouches[0].clientY;
  //     if (Math.abs(diff) > 5) {
  //       smoothScrollTo(currentSectionIndex + (diff > 0 ? 1 : -1));
  //     }
  //   },
  //   { passive: false }
  // );
let touchStartY = 0;
let touchEndY = 0;

window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener("touchmove", (e) => {
  e.preventDefault(); // Impede o scroll natural
}, { passive: false });

window.addEventListener("touchend", (e) => {
  touchEndY = e.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;
  if (Math.abs(diff) > 30) {
    smoothScrollTo(currentSectionIndex + (diff > 0 ? 1 : -1));
  }
}, { passive: false });

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
document.querySelectorAll('.arrow-down-fixed').forEach(arrow => {
  arrow.addEventListener('click', function (e) {
    // Encontra a seção atualmente visível
    const sections = document.querySelectorAll('.scroll-section');
    let currentSection = null;
    let minDiff = Infinity;
    const scrollY = window.scrollY || window.pageYOffset;

    sections.forEach(section => {
      const diff = Math.abs(section.offsetTop - scrollY);
      if (diff < minDiff) {
        minDiff = diff;
        currentSection = section;
      }
    });

    if (currentSection && typeof window.smoothScrollToSection === 'function') {
      window.smoothScrollToSection(currentSection, 1); // Vai para a próxima seção
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
    }, 800);
});

function parallaxBackgroundVideos() {
  const videos = document.querySelectorAll('.background-video');
  const scrollY = window.scrollY || window.pageYOffset;
  videos.forEach(video => {
    const speed = 0.1; 
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


function toggleArrowDownVisibility() {
  const arrow = document.querySelector('.arrow-down-fixed');
  const sections = document.querySelectorAll('.scroll-section');
  if (!arrow || sections.length === 0) return;

  // Detecta se está na última seção OU se está próximo do final da página
  const lastSection = sections[sections.length - 1];
  const lastRect = lastSection.getBoundingClientRect();
  const threshold = 100; // px de tolerância do final

  // Alternativa 1: pelo scroll (mais confiável)
  const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - threshold);

  // Alternativa 2: pela seção visível
  const isLastVisible = lastRect.top < window.innerHeight * 0.5 && lastRect.bottom > window.innerHeight * 0.2;

  if (nearBottom || isLastVisible) {
    arrow.style.display = 'none';
  } else {
    arrow.style.display = 'block';
  }
}
window.addEventListener('scroll', toggleArrowDownVisibility);
window.addEventListener('resize', toggleArrowDownVisibility);
window.addEventListener('DOMContentLoaded', toggleArrowDownVisibility);