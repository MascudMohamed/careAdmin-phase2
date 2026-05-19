/**
 * Care Admin Solutions — Main interactions
 */
(function () {
  "use strict";

  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const stickyCta = document.getElementById("sticky-cta");
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");
  const yearEl = document.getElementById("current-year");

  /* Current year in footer */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Header scroll state */
  function onScroll() {
    const scrolled = window.scrollY > 40;
    header?.classList.toggle("scrolled", scrolled);
    stickyCta?.classList.toggle("visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile navigation */
  function closeMobileNav() {
    menuToggle?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
    mobileNav?.classList.remove("open");
    document.body.style.overflow = "";
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileNav?.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMobileNav();
      const offset = header ? header.offsetHeight + 16 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* FAQ accordion */
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isActive = item?.classList.contains("active");

      document.querySelectorAll(".faq-item.active").forEach((open) => {
        if (open !== item) {
          open.classList.remove("active");
          open.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
        }
      });

      item?.classList.toggle("active", !isActive);
      btn.setAttribute("aria-expanded", String(!isActive));
    });
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* Animated stat counters */
  const statNumbers = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && statNumbers.length) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          const suffix = el.getAttribute("data-suffix") || "";
          const duration = 1600;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          countObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach((el) => countObserver.observe(el));
  }

  /* Contact form */
 contactForm?.addEventListener("submit", async (e) => {
   e.preventDefault();

   const formData = new FormData(contactForm);
   const data = Object.fromEntries(formData.entries());

   if (!data.name?.trim() || !data.email?.trim()) {
     alert("Please enter your name and work email.");
     return;
   }

   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   if (!emailPattern.test(data.email)) {
     alert("Please enter a valid email address.");
     return;
   }

   const submitBtn = contactForm.querySelector('button[type="submit"]');
   const originalText = submitBtn?.textContent;

   if (submitBtn) {
     submitBtn.disabled = true;
     submitBtn.textContent = "Sending…";
   }

   try {
     const response = await fetch("https://formspree.io/f/xanpgjqp", {
       method: "POST",
       headers: {
         Accept: "application/json",
       },
       body: formData,
     });

     if (response.ok) {
       contactForm.style.display = "none";
       formSuccess?.classList.add("show");
       contactForm.reset();
     } else {
       alert("Something went wrong. Please try again.");
     }
   } catch (error) {
     console.error(error);
     alert("Network error. Please check your connection.");
   }

   if (submitBtn) {
     submitBtn.disabled = false;
     submitBtn.textContent = originalText;
   }
 });
  /* Sticky CTA scroll to contact */
  document.querySelectorAll("[data-scroll-contact]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* Callback modal trigger (scroll to contact with subject) */
  document.querySelectorAll("[data-callback]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const subject = document.getElementById("inquiry-type");
      if (subject) subject.value = "callback";
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => document.getElementById("name")?.focus(), 600);
    });
  });
})();
