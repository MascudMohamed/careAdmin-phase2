/* CareAdmin Solutions — Main */
(function () {
  "use strict";

  const header = document.getElementById("site-header");
  const toggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  function closeMenu() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    mobileNav.classList.remove("open");
    document.body.classList.remove("nav-open");
  }

  function openMenu() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    mobileNav.classList.add("open");
    document.body.classList.add("nav-open");
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") === "true";
      if (open) closeMenu();
      else openMenu();
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 980) closeMenu();
    });
  }

  function normalizePage(value) {
    var page = String(value || "").split("/").pop().toLowerCase().split("?")[0].split("#")[0];
    if (!page || page === "index.htm") return "index.html";
    if (page.indexOf(".") === -1) return page + ".html";
    return page;
  }

  var path = normalizePage(window.location.pathname);
  document.querySelectorAll(".nav-desktop a, .mobile-nav a").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return;
    if (normalizePage(href) === path) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  // Smooth in-page anchors with header offset
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = header ? header.offsetHeight + 12 : 24;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
      closeMenu();
    });
  });

  // Current year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
