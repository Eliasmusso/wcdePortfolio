// WCD(E) – One-Page Interactions

// Smooth scrolling for in-page anchors & custom buttons -------------------
function smoothScrollTo(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const headerOffset = document.querySelector(".site-header")?.offsetHeight || 0;
  const rect = target.getBoundingClientRect();
  const offset = rect.top + window.scrollY - headerOffset - 12;

  window.scrollTo({
    top: offset,
    behavior: "smooth",
  });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href^='#'], .scroll-down[data-target]");
  if (!link) return;

  let targetId = null;

  if (link.matches(".scroll-down")) {
    targetId = link.getAttribute("data-target");
  } else {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#") && href.length > 1) {
      targetId = href;
    }
  }

  if (targetId) {
    event.preventDefault();
    smoothScrollTo(targetId);
  }
});

// Parallax background for #home -------------------------------------------
const parallaxConfig = [
  { selector: ".layer-back", speed: 0.15 },
  { selector: ".layer-mid", speed: 0.25 },
  { selector: ".layer-front", speed: 0.45 },
];

const parallaxLayers = parallaxConfig
  .map((cfg) => {
    const el = document.querySelector(cfg.selector);
    return el ? { el, speed: cfg.speed } : null;
  })
  .filter(Boolean);

let latestScrollY = window.scrollY || 0;
let ticking = false;

function updateParallax() {
  parallaxLayers.forEach(({ el, speed }) => {
    const translateY = latestScrollY * speed;
    el.style.transform = `translate3d(0, ${translateY}px, 0)`;
  });
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    latestScrollY = window.scrollY || 0;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  },
  { passive: true }
);

// Footer year --------------------------------------------------------------
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

// Dummy submit handler for contact form (prevent real navigation) --------
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Minimal feedback – in echten Projekten würdest du hier
    // ein Request an dein Backend oder ein Form-Service senden.
    contactForm.reset();
    const button = contactForm.querySelector("button[type='submit']");
    if (!button) return;

    const originalText = button.textContent;
    button.textContent = "Sent";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1800);
  });
}


