/* Parbati Ply & Hardware - About page 3D scroll + tilt (load after script.js and premium.js) */
(() => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const out = $$("[data-out]"), pin = $$("[data-pin]"), trk = $$("[data-track]");
  let raf = 0;

  const run = () => {
    raf = 0;
    const vh = innerHeight;
    out.forEach((el) => { const r = el.getBoundingClientRect(); el.style.setProperty("--o", clamp(-r.top / r.height).toFixed(3)); });
    pin.forEach((el) => { const r = el.getBoundingClientRect(); el.style.setProperty("--p", clamp((vh * 0.6 - r.top) / r.height).toFixed(3)); });
    trk.forEach((el) => { const r = el.getBoundingClientRect(); el.style.setProperty("--t", clamp((vh - r.top) / (vh + r.height)).toFixed(3)); });
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(run); };
  if (!calm) { addEventListener("scroll", kick, { passive: true }); addEventListener("resize", kick); }
  run();

  // mouse depth on the hero scene
  const scene = document.querySelector(".lx-scene");
  if (scene && fine && !calm) {
    scene.addEventListener("pointermove", (e) => {
      const b = scene.getBoundingClientRect();
      scene.style.setProperty("--mx", ((e.clientX - b.left) / b.width - 0.5).toFixed(3));
      scene.style.setProperty("--my", ((e.clientY - b.top) / b.height - 0.5).toFixed(3));
    });
    scene.addEventListener("pointerleave", () => { scene.style.setProperty("--mx", 0); scene.style.setProperty("--my", 0); });
  }

  // card tilt for stats + steps
  if (fine && !calm) {
    $$(".lx-stat,.lx-step").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  // count-up numbers
  const nums = $$("[data-n]");
  const count = (el) => {
    const end = +el.dataset.n; let t0;
    const step = (t) => { t0 = t0 || t; const k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    calm ? (el.textContent = end) : requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { count(x.target); io.unobserve(x.target); } }), { threshold: 0.6 });
    nums.forEach((n) => io.observe(n));
  } else nums.forEach(count);
})();
