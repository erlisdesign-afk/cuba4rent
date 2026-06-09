/**
 * Cuba4Rent — Motion Animations
 * Uses Motion (vanilla JS) via CDN global `Motion`
 */

(function () {
  const { animate, inView, scroll, stagger } = Motion;

  /* ─────────────────────────────────────────────
     Helpers
  ───────────────────────────────────────────── */
  function reveal(selector, opts = {}) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    inView(
      selector,
      ({ target }) => {
        animate(
          target,
          { opacity: [0, 1], y: [opts.y ?? 32, 0], scale: [opts.scale ?? 1, 1] },
          {
            duration: opts.duration ?? 0.6,
            delay: opts.delay ?? 0,
            easing: [0.22, 1, 0.36, 1],
          }
        );
      },
      { margin: "-60px 0px" }
    );
    // Set initial invisible state
    els.forEach((el) => {
      el.style.opacity = "0";
    });
  }

  function revealStagger(selector, opts = {}) {
    const parent = opts.parent ? document.querySelector(opts.parent) : null;
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    const trigger = parent || els[0];
    els.forEach((el) => (el.style.opacity = "0"));

    inView(
      trigger,
      () => {
        animate(
          selector,
          { opacity: [0, 1], y: [opts.y ?? 36, 0] },
          {
            duration: opts.duration ?? 0.55,
            delay: stagger(opts.stagger ?? 0.1, { start: opts.start ?? 0 }),
            easing: [0.22, 1, 0.36, 1],
          }
        );
      },
      { margin: "-40px 0px" }
    );
  }

  /* ─────────────────────────────────────────────
     1. Hero — fade + slide on load
  ───────────────────────────────────────────── */
  const heroText = document.querySelector(".hero-text");
  const heroMedia = document.querySelector(".hero-media");

  if (heroText) {
    animate(heroText, { opacity: [0, 1], x: [-48, 0] }, { duration: 0.8, easing: [0.22, 1, 0.36, 1] });
  }
  if (heroMedia) {
    animate(heroMedia, { opacity: [0, 1], x: [48, 0] }, { duration: 0.8, delay: 0.15, easing: [0.22, 1, 0.36, 1] });
  }

  // Hero badge pop
  const discBadge = document.querySelector(".disc-badge");
  if (discBadge) {
    animate(
      discBadge,
      { opacity: [0, 1], scale: [0.6, 1.08, 1] },
      { duration: 0.7, delay: 0.5, easing: [0.34, 1.56, 0.64, 1] }
    );
  }

  // Hero feature list items stagger
  const heroFeats = document.querySelectorAll(".hero-feats li");
  if (heroFeats.length) {
    heroFeats.forEach((el) => (el.style.opacity = "0"));
    animate(
      ".hero-feats li",
      { opacity: [0, 1], x: [-20, 0] },
      { duration: 0.45, delay: stagger(0.1, { start: 0.55 }), easing: "ease-out" }
    );
  }

  /* ─────────────────────────────────────────────
     2. Search card
  ───────────────────────────────────────────── */
  reveal(".search-card", { y: 40, duration: 0.65 });

  /* ─────────────────────────────────────────────
     3. Section headings
  ───────────────────────────────────────────── */
  document.querySelectorAll(".eyebrow, .sec-title").forEach((el) => (el.style.opacity = "0"));
  inView(".sec", ({ target }) => {
    const eyebrow = target.querySelector(".eyebrow");
    const title = target.querySelector(".sec-title");
    if (eyebrow) animate(eyebrow, { opacity: [0, 1], y: [16, 0] }, { duration: 0.5, easing: "ease-out" });
    if (title)
      animate(title, { opacity: [0, 1], y: [20, 0] }, { duration: 0.55, delay: 0.1, easing: [0.22, 1, 0.36, 1] });
  }, { margin: "-60px 0px" });

  /* ─────────────────────────────────────────────
     4. Fleet cards — stagger grid
  ───────────────────────────────────────────── */
  // Cards are injected by app.js; use MutationObserver to catch them
  const fleetGrid = document.getElementById("fleetGrid");
  if (fleetGrid) {
    const observer = new MutationObserver(() => {
      const cards = fleetGrid.querySelectorAll(".car-card");
      if (!cards.length) return;
      observer.disconnect();
      cards.forEach((c) => (c.style.opacity = "0"));
      inView(
        fleetGrid,
        () => {
          animate(
            ".car-card",
            { opacity: [0, 1], y: [40, 0] },
            { duration: 0.55, delay: stagger(0.1), easing: [0.22, 1, 0.36, 1] }
          );
        },
        { margin: "-40px 0px" }
      );
    });
    observer.observe(fleetGrid, { childList: true, subtree: true });
  }

  /* ─────────────────────────────────────────────
     5. Advantage items — from sides
  ───────────────────────────────────────────── */
  const advLeft = document.querySelectorAll(".adv-col:first-child .adv-item");
  const advRight = document.querySelectorAll(".adv-col.right .adv-item");
  const advMedia = document.querySelector(".adv-media");

  advLeft.forEach((el) => (el.style.opacity = "0"));
  advRight.forEach((el) => (el.style.opacity = "0"));
  if (advMedia) advMedia.style.opacity = "0";

  if (advLeft.length) {
    inView(".adv-grid", () => {
      animate(".adv-col:first-child .adv-item", { opacity: [0, 1], x: [-32, 0] }, {
        duration: 0.55, delay: stagger(0.12), easing: [0.22, 1, 0.36, 1]
      });
      animate(".adv-col.right .adv-item", { opacity: [0, 1], x: [32, 0] }, {
        duration: 0.55, delay: stagger(0.12), easing: [0.22, 1, 0.36, 1]
      });
      if (advMedia) {
        animate(advMedia, { opacity: [0, 1], scale: [0.95, 1] }, { duration: 0.7, delay: 0.15, easing: [0.22, 1, 0.36, 1] });
      }
    }, { margin: "-40px 0px" });
  }

  /* ─────────────────────────────────────────────
     6. About section
  ───────────────────────────────────────────── */
  const aboutMedia = document.querySelector(".about-media");
  const aboutText = document.querySelector(".about-text");
  if (aboutMedia) aboutMedia.style.opacity = "0";
  if (aboutText) aboutText.style.opacity = "0";

  if (aboutMedia) {
    inView(".about-grid", () => {
      animate(aboutMedia, { opacity: [0, 1], x: [-40, 0] }, { duration: 0.7, easing: [0.22, 1, 0.36, 1] });
      if (aboutText)
        animate(aboutText, { opacity: [0, 1], x: [40, 0] }, { duration: 0.7, delay: 0.12, easing: [0.22, 1, 0.36, 1] });
    }, { margin: "-40px 0px" });
  }

  /* ─────────────────────────────────────────────
     7. Service cards
  ───────────────────────────────────────────── */
  revealStagger(".svc-card", { stagger: 0.12, y: 36, parent: ".svc-grid" });

  /* ─────────────────────────────────────────────
     8. Promo banners
  ───────────────────────────────────────────── */
  const promos = document.querySelectorAll(".promo");
  promos.forEach((el) => (el.style.opacity = "0"));
  if (promos.length) {
    inView(".promo-grid", () => {
      animate(".promo", { opacity: [0, 1], scale: [0.97, 1], y: [24, 0] }, {
        duration: 0.6, delay: stagger(0.15), easing: [0.22, 1, 0.36, 1]
      });
    }, { margin: "-40px 0px" });
  }

  /* ─────────────────────────────────────────────
     9. Steps section
  ───────────────────────────────────────────── */
  const stepsMedia = document.querySelector(".steps-media");
  const accItems = document.querySelectorAll(".acc-item");
  if (stepsMedia) stepsMedia.style.opacity = "0";
  accItems.forEach((el) => (el.style.opacity = "0"));

  if (stepsMedia) {
    inView(".steps-grid", () => {
      animate(".acc-item", { opacity: [0, 1], x: [-24, 0] }, {
        duration: 0.5, delay: stagger(0.12), easing: [0.22, 1, 0.36, 1]
      });
      animate(stepsMedia, { opacity: [0, 1], x: [40, 0] }, { duration: 0.7, delay: 0.2, easing: [0.22, 1, 0.36, 1] });
    }, { margin: "-40px 0px" });
  }

  /* ─────────────────────────────────────────────
     10. Discover section — parallax
  ───────────────────────────────────────────── */
  const discoverImg = document.querySelector(".discover img");
  if (discoverImg) {
    scroll(
      animate(discoverImg, { y: [-40, 40] }, { easing: "linear" }),
      { target: document.querySelector(".discover"), offset: ["start end", "end start"] }
    );
  }

  /* ─────────────────────────────────────────────
     11. Testimonials
  ───────────────────────────────────────────── */
  revealStagger(".test-card", { stagger: 0.13, y: 32, parent: ".test-grid" });

  /* ─────────────────────────────────────────────
     12. Blog cards
  ───────────────────────────────────────────── */
  revealStagger(".blog-card", { stagger: 0.13, y: 32, parent: ".blog-grid" });

  /* ─────────────────────────────────────────────
     13. Logos marquee reveal
  ───────────────────────────────────────────── */
  const logoSpans = document.querySelectorAll(".logos span");
  logoSpans.forEach((el) => (el.style.opacity = "0"));
  if (logoSpans.length) {
    inView(".logos", () => {
      animate(".logos span", { opacity: [0, 1], y: [12, 0] }, {
        duration: 0.4, delay: stagger(0.08), easing: "ease-out"
      });
    }, { margin: "-20px 0px" });
  }

  /* ─────────────────────────────────────────────
     14. Final CTA
  ───────────────────────────────────────────── */
  const finalCta = document.querySelector(".final-cta .wrap");
  if (finalCta) {
    finalCta.style.opacity = "0";
    inView(".final-cta", () => {
      animate(finalCta, { opacity: [0, 1], y: [30, 0] }, { duration: 0.65, easing: [0.22, 1, 0.36, 1] });
    }, { margin: "-40px 0px" });
  }

  /* ─────────────────────────────────────────────
     15. WhatsApp FAB — bounce entrance + pulse ring
  ───────────────────────────────────────────── */
  const waFab = document.getElementById("waFab");
  if (waFab) {
    animate(waFab, { opacity: [0, 1], scale: [0, 1.1, 1], y: [30, 0] }, {
      duration: 0.7, delay: 1.2, easing: [0.34, 1.56, 0.64, 1]
    });

    // Pulse ring
    const ring = document.createElement("span");
    ring.style.cssText = `
      position:absolute;inset:-6px;border-radius:50%;
      border:2px solid #25D366;opacity:0;pointer-events:none;
    `;
    waFab.style.position = "relative";
    waFab.appendChild(ring);
    animate(ring, { opacity: [0.6, 0], scale: [1, 1.6] }, {
      duration: 1.4, repeat: Infinity, repeatDelay: 1.2, delay: 2, easing: "ease-out"
    });
  }

  /* ─────────────────────────────────────────────
     16. Hover interactions via CSS + JS spring
  ───────────────────────────────────────────── */

  // Car cards — hover lift
  document.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".car-card");
    if (card) {
      animate(card, { y: -6, boxShadow: "0 28px 56px rgba(12,20,46,0.18)" }, { duration: 0.25, easing: [0.22, 1, 0.36, 1] });
    }
  });
  document.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".car-card");
    if (card) {
      animate(card, { y: 0, boxShadow: "0 24px 60px rgba(206,206,206,0.55)" }, { duration: 0.3, easing: "ease-out" });
    }
  });

  // Service cards — hover lift + arrow nudge
  document.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".svc-card");
    if (card) {
      animate(card, { y: -5 }, { duration: 0.25, easing: [0.22, 1, 0.36, 1] });
      const arrow = card.querySelector(".svc-arrow");
      if (arrow) animate(arrow, { x: 4 }, { duration: 0.2, easing: "ease-out" });
    }
  });
  document.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".svc-card");
    if (card) {
      animate(card, { y: 0 }, { duration: 0.3, easing: "ease-out" });
      const arrow = card.querySelector(".svc-arrow");
      if (arrow) animate(arrow, { x: 0 }, { duration: 0.2, easing: "ease-out" });
    }
  });

  // Blog cards — hover image scale
  document.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".blog-card");
    if (card) {
      const img = card.querySelector("img");
      if (img) animate(img, { scale: 1.05 }, { duration: 0.4, easing: [0.22, 1, 0.36, 1] });
    }
  });
  document.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".blog-card");
    if (card) {
      const img = card.querySelector("img");
      if (img) animate(img, { scale: 1 }, { duration: 0.4, easing: "ease-out" });
    }
  });

  // Buttons — tap spring
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousedown", () => animate(btn, { scale: 0.95 }, { duration: 0.1 }));
    btn.addEventListener("mouseup", () => animate(btn, { scale: 1 }, { duration: 0.3, easing: [0.34, 1.56, 0.64, 1] }));
    btn.addEventListener("mouseleave", () => animate(btn, { scale: 1 }, { duration: 0.2 }));
  });

  /* ─────────────────────────────────────────────
     17. Header scroll shrink (scroll progress)
  ───────────────────────────────────────────── */
  const header = document.querySelector(".header");
  if (header) {
    let scrolled = false;
    window.addEventListener("scroll", () => {
      const now = window.scrollY > 60;
      if (now !== scrolled) {
        scrolled = now;
        animate(
          header,
          { paddingTop: now ? "6px" : "10px", paddingBottom: now ? "6px" : "10px",
            boxShadow: now ? "0 4px 24px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.06)" },
          { duration: 0.3, easing: "ease-out" }
        );
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────
     18. Modal — AnimatePresence-style open/close
  ───────────────────────────────────────────── */
  const modal = document.getElementById("bookingModal");
  const modalInner = modal?.querySelector(".modal");

  if (modal && modalInner) {
    const origOpen = window._openModal;

    // Patch modal open/close
    const observer2 = new MutationObserver(() => {
      const isOpen = modal.classList.contains("open");
      if (isOpen) {
        modal.style.display = "flex";
        animate(modal, { opacity: [0, 1] }, { duration: 0.25, easing: "ease-out" });
        animate(modalInner, { opacity: [0, 1], y: [40, 0], scale: [0.96, 1] }, {
          duration: 0.35, easing: [0.22, 1, 0.36, 1]
        });
      }
    });
    observer2.observe(modal, { attributes: true, attributeFilter: ["class"] });
  }

  /* ─────────────────────────────────────────────
     19. Scroll progress bar
  ───────────────────────────────────────────── */
  const progressBar = document.createElement("div");
  progressBar.id = "scroll-progress";
  progressBar.style.cssText = `
    position:fixed;top:0;left:0;right:0;height:3px;
    background:var(--red, #DD0005);transform-origin:left;
    transform:scaleX(0);z-index:9999;pointer-events:none;
  `;
  document.body.prepend(progressBar);

  scroll(animate(progressBar, { scaleX: [0, 1] }, { easing: "linear" }));

})();
