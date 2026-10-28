/* hero3d.js - loops the columns, 3D scroll depth and mouse tilt */
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("hx");
  if (!hero) return;

  // 1) Duplicate cards so the vertical loop is seamless
  hero.querySelectorAll(".hx-track").forEach((track) => {
    [...track.children].forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  });

  const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  if (calm) return;

  // 2) Smooth scroll-driven 3D rotation + background parallax
  let ticking = false;
  const update = () => {
    const h = hero.offsetHeight || 1;
    const y = Math.max(0, window.scrollY);
    hero.style.setProperty("--p", Math.min(1, y / h).toFixed(3));
    hero.style.setProperty("--sy", y.toFixed(0));
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();

  // 3) Mouse tilt (desktop only)
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (fine) {
    hero.addEventListener("mousemove", (e) => {
      const b = hero.getBoundingClientRect();
      hero.style.setProperty(
        "--mx",
        ((e.clientX - b.left) / b.width - 0.5) * 10,
      );
      hero.style.setProperty(
        "--my",
        ((e.clientY - b.top) / b.height - 0.5) * -8,
      );
    });
    hero.addEventListener("mouseleave", () => {
      hero.style.setProperty("--mx", 0);
      hero.style.setProperty("--my", 0);
    });
  }
});
