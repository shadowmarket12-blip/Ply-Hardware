const WA = "918895812022";

/* ---------- Main site logic ---------- */
(() => {
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)],
    root = document.documentElement;

  const WA_HELLO =
    "Hi Parbati Ply & Hardware, I'd like to enquire about your products.";

  // sticky WhatsApp icon + tel links
  const wafloat = $("#wafloat");
  if (wafloat)
    wafloat.href = `https://wa.me/${WA}?text=${encodeURIComponent(WA_HELLO)}`;
  const phoneText = `+${WA.slice(0, 2)} ${WA.slice(2, 7)} ${WA.slice(7)}`;
  $$("[data-tel]").forEach((a) => {
    a.href = `tel:+${WA}`;
    if (a.textContent.trim().startsWith("+")) a.textContent = phoneText;
  });

  // header + mobile menu
  const hd = $("header"),
    menu = $("#menu"),
    bg = $("#burger");
  const sc = () => hd && hd.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", sc, { passive: true });
  sc();
  const sm = (o) => {
    if (!menu || !bg) return;
    menu.classList.toggle("open", o);
    bg.setAttribute("aria-expanded", o);
    bg.setAttribute("aria-label", o ? "Close menu" : "Open menu");
  };
  if (bg) bg.onclick = () => sm(!menu.classList.contains("open"));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") sm(false);
  });

  // theme
  const themeBtn = $("#theme");
  if (themeBtn)
    themeBtn.onclick = () => {
      const d =
        (root.dataset.theme ||
          (matchMedia("(prefers-color-scheme:dark)").matches
            ? "dark"
            : "light")) === "dark";
      root.dataset.theme = d ? "light" : "dark";
    };

  // enquiry form -> WhatsApp
  const vform = $("#vform");
  if (vform)
    vform.onsubmit = (e) => {
      e.preventDefault();
      const f = e.target;
      const msg = `Hi Parbati Ply & Hardware, I'd like to enquire about your products. My name is ${f.n.value}, phone ${f.p.value}. I am looking for: ${f.d.value}.`;
      window.open(
        `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,
        "_blank",
        "noopener",
      );
    };

  // reliable in-page navigation (lands at section top, below sticky header)
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const t = id === "#top" ? null : document.querySelector(id);
    if (id !== "#top" && !t) return;
    e.preventDefault();
    sm(false);
    const y = t
      ? Math.max(0, t.getBoundingClientRect().top + scrollY - hd.offsetHeight)
      : 0;
    scrollTo({ top: y, behavior: "smooth" });
    history.replaceState(null, "", id === "#top" ? location.pathname : id);
  });

  // enquiry links -> WhatsApp
  $$("[data-enq]").forEach((a) => {
    a.href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hi Parbati Ply & Hardware, I'd like to enquire about: ${a.dataset.enq}.`)}`;
    a.target = "_blank";
    a.rel = "noopener";
  });

  // brand logo marquee: put logo files in /brands/ (png, jpg, jpeg, webp, svg)
  const EXTS = ["png", "jpg", "jpeg", "webp", "svg"];
  const BRANDS = {
    1: [
      ["Century Ply", "century-ply"],
      ["Greenply", "greenply"],
      ["Merino", "merino"],
      ["Kitply", "kitply"],
      ["Hettich", "hettich"],
      ["Fevicol", "fevicol"],
    ],
    2: [
      ["Sylvan Ply", "sylvan-ply"],
      ["Century Laminates", "century-laminates"],
      ["Croma Laminates", "croma-laminates"],
      ["Godrej", "godrej"],
      ["Europa", "europa"],
      ["Chrome Plus", "chrome-plus"],
    ],
  };
  $$(".mq-track").forEach((track) => {
    const frag = document.createDocumentFragment();
    for (let copy = 0; copy < 4; copy++) {
      (BRANDS[track.dataset.row] || []).forEach(([name, slug]) => {
        const chip = document.createElement("div");
        chip.className = "bchip";
        if (copy) chip.setAttribute("aria-hidden", "true");
        const img = new Image();
        let n = 0;
        img.alt = copy ? "" : `${name} logo`;
        img.width = 170;
        img.height = 80;
        img.decoding = "async";
        img.loading = "lazy";
        img.onerror = () => {
          n++;
          if (n < EXTS.length) {
            img.src = `brands/${slug}.${EXTS[n]}`;
          } else {
            chip.innerHTML = "";
            const s = document.createElement("span");
            s.className = "bname";
            s.textContent = name;
            chip.appendChild(s);
          }
        };
        img.src = `brands/${slug}.${EXTS[0]}`;
        chip.appendChild(img);
        frag.appendChild(chip);
      });
    }
    track.appendChild(frag);
  });

  // reveal on scroll
  const els = $$(".rv");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add("in");
            io.unobserve(x.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((el, k) => {
      el.style.transitionDelay = (k % 4) * 90 + "ms";
      io.observe(el);
    });
  } else {
    els.forEach((el) => el.classList.add("in"));
  }

  // footer newsletter (FIXED: id is "ppf-news" in the HTML, not "news")
  const news = $("#ppf-news") || $("#news");
  if (news)
    news.onsubmit = (e) => {
      e.preventDefault();
      const input = news.querySelector("input");
      if (input && !input.checkValidity()) {
        input.reportValidity();
        return;
      }
      if (input) input.value = "";
      const label =
        news.querySelector("button span") || news.querySelector("button");
      if (label) label.textContent = "Thanks!";
    };

  const yr = $("#yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* ---------- Mega menu + parallax ---------- */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mg = $(".mg"),
    btn = $(".mt"),
    body = document.body;
  const desk = () => matchMedia("(min-width:961px)").matches;
  let tOpen, tClose;

  if (mg && btn) {
    const set = (o) => {
      mg.classList.toggle("open", o);
      btn.setAttribute("aria-expanded", o);
      body.classList.toggle("mopen", o && desk());
    };
    mg.addEventListener("mouseenter", () => {
      if (!desk()) return;
      clearTimeout(tClose);
      tOpen = setTimeout(() => set(true), 80);
    });
    mg.addEventListener("mouseleave", () => {
      if (!desk()) return;
      clearTimeout(tOpen);
      tClose = setTimeout(() => set(false), 300);
    });
    // desktop: click keeps it open (hover already opens it); mobile: toggle
    btn.addEventListener("click", () => {
      clearTimeout(tClose);
      set(desk() ? true : !mg.classList.contains("open"));
    });
    mg.addEventListener("focusout", (e) => {
      if (e.relatedTarget && !mg.contains(e.relatedTarget)) set(false);
    });
    mg.addEventListener("click", (e) => {
      if (e.target.closest(".mega a")) set(false);
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        set(false);
        btn.focus();
      }
    });
    addEventListener("resize", () => set(false));
    $$(".menu > li:not(.mg)").forEach((li) =>
      li.addEventListener("mouseenter", () => desk() && set(false)),
    );
  }

  /* hero mouse tilt (desktop) */
  const stage = $(".stage");
  if (
    stage &&
    desk() &&
    !matchMedia("(prefers-reduced-motion:reduce)").matches
  ) {
    stage.addEventListener("mousemove", (e) => {
      const b = stage.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width - 0.5,
        y = (e.clientY - b.top) / b.height - 0.5;
      stage.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
    });
    stage.addEventListener("mouseleave", () => (stage.style.transform = ""));
    stage.style.transition = "transform .4s ease-out";
  }

  /* smooth parallax */
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const map = [
    [".stage .room", -0.07],
    [".spin", 0.14],
    [".fc", -0.12],
    [".hero h1", 0.05],
    [".hero .lead", 0.08],
    [".layers", -0.08],
    [".craft .ticks", 0.05],
    [".cust .show", -0.07],
    [".cust .sw", 0.04],
    [".bento .tile.big svg", -0.08],
    [".vcard", 0.03],
    [".vform", -0.03],
    [".sec-head h2", 0.04],
  ];
  const items = [];
  map.forEach(([sel, k]) =>
    $$(sel).forEach((el) => {
      el.dataset.p = k;
      items.push({ el, k, y: 0, t: 0 });
    }),
  );
  $$(".tile svg").forEach((el) => {
    if (!el.dataset.p) items.push({ el, k: -0.05, y: 0, t: 0 });
  });

  const prog = $(".prog");
  let raf = 0;
  const tick = () => {
    raf = 0;
    const vh = innerHeight;
    let moving = false;
    const on = [];
    for (const it of items) {
      const r = it.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const base = r.top - it.y;
      it.t = -(base + r.height / 2 - vh / 2) * it.k;
      on.push(it);
    }
    for (const it of on) {
      it.y += (it.t - it.y) * 0.14;
      if (Math.abs(it.t - it.y) > 0.15) moving = true;
      it.el.style.translate = `0 ${it.y.toFixed(2)}px`;
    }
    const max = document.documentElement.scrollHeight - vh;
    if (prog) prog.style.setProperty("--sp", max > 0 ? scrollY / max : 0);
    if (moving) raf = requestAnimationFrame(tick);
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", kick);
  kick();
})();
