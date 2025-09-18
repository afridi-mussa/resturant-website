// script.js - capture-phase anchor interception + requestAnimationFrame smooth scroll
(function () {
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // animated scroll to Y using rAF
  let rafId = null;
  function animateScrollTo(targetY, duration = 600) {
    if (rafId) cancelAnimationFrame(rafId);
    const startY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const diff = targetY - startY;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(t);
      window.scrollTo(0, Math.round(startY + diff * eased));
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
      }
    }
    rafId = requestAnimationFrame(step);
  }

  // compute scroll target accounting for fixed navbar
  function getTopForElement(el, navbar) {
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const rect = el.getBoundingClientRect();
    return window.pageYOffset + rect.top - navHeight - 8;
  }

  // main init on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const navToggle = document.querySelector(".nav-toggle");
    const primaryNav = document.getElementById("primary-nav");
    const navLinks = document.querySelectorAll(".nav-link");

    // mobile toggle
    if (navToggle) {
      navToggle.addEventListener("click", () => {
        const expanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!expanded));
        if (primaryNav) primaryNav.classList.toggle("open");
      });
    }

    // Theme Switcher
    const lightBtn = document.getElementById("lightBtn");
    const darkBtn = document.getElementById("darkBtn");

    lightBtn.addEventListener("click", () => {
      document.body.classList.remove("dark-theme");
    });

    darkBtn.addEventListener("click", () => {
      document.body.classList.add("dark-theme");
    });


    // HERO buttons
    const viewMenuBtn = document.querySelector(".hero-left .btn");
    const reserveBtn = document.querySelector(".hero-right .btn");

    if (viewMenuBtn) {
      viewMenuBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const menuSection = document.getElementById("menu");
        if (menuSection) {
          const top = getTopForElement(menuSection, navbar);
          animateScrollTo(top, 700);
        }
      });
    }

    if (reserveBtn) {
      reserveBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          const top = getTopForElement(contactSection, navbar);
          animateScrollTo(top, 700);
        }
      });
    }

    // CAPTURING document click handler for anchor links (runs early)
    document.addEventListener("click", function (ev) {

      const a = ev.target.closest && ev.target.closest("a");
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;


      ev.preventDefault();


      if (href === "#" || href === "#home") {
        const top = 0;
        animateScrollTo(top, 700);
      } else {
        const target = document.querySelector(href);
        if (target) {
          const top = getTopForElement(target, navbar);
          animateScrollTo(top, 700);
        }
      }

      // if this anchor is one of the nav links, set active class and close mobile menu
      if (a.classList.contains("nav-link")) {
        navLinks.forEach(l => l.classList.remove("active"));
        a.classList.add("active");
        if (primaryNav && primaryNav.classList.contains("open")) {
          primaryNav.classList.remove("open");
          if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        }
      }
    }, true);

    // Close mobile menu on resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 880 && primaryNav && primaryNav.classList.contains("open")) {
        primaryNav.classList.remove("open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      }
    });


  });

  // ===== Specials Section Flip Card =====
  const card = document.querySelector(".special-card");
  const showBtn = document.getElementById("toggleSpecial");
  const hideBtn = document.getElementById("hideSpecial");

  if (card && showBtn && hideBtn) {
    showBtn.addEventListener("click", () => card.classList.add("flipped"));
    hideBtn.addEventListener("click", () => card.classList.remove("flipped"));
  }

  // ===== Contact form validation with live feedback =====
  const form = document.getElementById("reservationForm");
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailError");

  function validateEmail(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (/^\d+$/.test(value)) return { valid: false, message: "Email cannot be only numbers." };
    if (!emailPattern.test(value)) return { valid: false, message: "Please enter a valid email address." };
    return { valid: true, message: "Valid email address ✔" };
  }

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      const value = emailInput.value.trim();
      const { valid, message } = validateEmail(value);
      if (value === "") {
        if (emailError) emailError.style.display = "none";
        emailInput.classList.remove("error", "success");
        return;
      }
      if (!valid) {
        emailInput.classList.add("error");
        emailInput.classList.remove("success");
        if (emailError) {
          emailError.textContent = message;
          emailError.classList.add("error");
          emailError.classList.remove("success");
          emailError.style.display = "block";
        }
      } else {
        emailInput.classList.add("success");
        emailInput.classList.remove("error");
        if (emailError) {
          emailError.textContent = message;
          emailError.classList.add("success");
          emailError.classList.remove("error");
          emailError.style.display = "block";
        }
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = (emailInput && emailInput.value.trim()) || "";
      const { valid } = validateEmail(value);
      if (!valid) {
        if (emailInput) emailInput.classList.add("error");
        if (emailError) emailError.style.display = "block";
        return;
      }
      alert("🎉 Booking Confirmed! We’ll contact you soon.");
      form.reset();
      if (emailInput) emailInput.classList.remove("error", "success");
      if (emailError) emailError.style.display = "none";
    });
  }
})();



