function toggleMenu(active) {
  const menuIcon = document.getElementById("menuIcon");
  const menuDropdown = document.getElementById("menuDropdown");
  menuIcon.classList.toggle("active", active);
  menuDropdown.classList.toggle("active", active);
  document.body.style.overflow = active ? "hidden" : "";
}

function initMenuEvents() {
  const menuIcon = document.getElementById("menuIcon");
  const closeMenu = document.getElementById("closeMenu");
  const menuDropdown = document.getElementById("menuDropdown");

  menuIcon.addEventListener("click", () => toggleMenu(true));
  closeMenu.addEventListener("click", () => toggleMenu(false));

  document.addEventListener("click", (e) => {
    if (!menuDropdown.contains(e.target) && !menuIcon.contains(e.target)) {
      toggleMenu(false);
    }
  });

  window.addEventListener("scroll", handleHeaderScroll);
}

window.addEventListener("DOMContentLoaded", () => {
    initMenuEvents()
});