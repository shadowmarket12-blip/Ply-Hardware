/* Parbati Ply & Hardware, 3D tilt + glass shine (load after script.js) */
(() => {
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const els = [...document.querySelectorAll(".ccard,.scard,.wcard,.bcard,.vcard,.vform,.show")];

  els.forEach((el) => {
    el.classList.add("tilt");
    if (!fine || calm) return;
    let raf = 0;
    el.addEventListener("pointerenter", () => (el.style.transitionDelay = "0ms"));
    el.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const b = el.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width;
        const y = (e.clientY - b.top) / b.height;
        el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
        el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
        el.style.setProperty("--mx", `${x * 100}%`);
        el.style.setProperty("--my", `${y * 100}%`);
      });
    });
    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });
})();
