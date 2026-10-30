/* Parbati Ply & Hardware – page scripts (scroll-performance tuned) */
(function () {
  "use strict";

  var root = document.documentElement;

  /* Footer year */
  document.querySelectorAll("#yr").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Decode images off the main thread so scrolling never stalls on them */
  document.querySelectorAll(".pm img, .hx img").forEach(function (img) {
    img.decoding = "async";
  });

  /* While scrolling: pause hover/tilt work (CSS: html.is-scrolling) */
  var scrollTimer = 0,
    scrolling = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!scrolling) {
        scrolling = true;
        root.classList.add("is-scrolling");
      }
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        scrolling = false;
        root.classList.remove("is-scrolling");
      }, 140);
    },
    { passive: true },
  );

  /* Scroll reveal — marks element .done when finished so hover transitions work */
  var els = document.querySelectorAll(".pm-rv");
  function finish(el) {
    el.classList.add("done");
  }
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) {
      el.classList.add("in", "done");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          el.classList.add("in");
          el.addEventListener("transitionend", function h(e) {
            if (e.target === el && e.propertyName === "opacity") {
              finish(el);
              el.removeEventListener("transitionend", h);
            }
          });
          setTimeout(function () {
            finish(el);
          }, 1600); /* safety fallback */
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach(function (el, i) {
      el.style.setProperty("--d", (i % 3) * 0.1 + "s");
      io.observe(el);
    });
  }

  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Card tilt — rect measured once on enter, one rAF per frame, no layout reads while moving */
  if (fine) {
    document.querySelectorAll(".pm-card").forEach(function (card) {
      var raf = 0,
        px = 0,
        py = 0,
        rect = null;

      function apply() {
        raf = 0;
        if (!rect) return;
        var x = (px - rect.left) / rect.width - 0.5;
        var y = (py - rect.top) / rect.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateY(" +
          x * 7 +
          "deg) rotateX(" +
          -y * 7 +
          "deg) translateY(-4px)";
      }

      card.addEventListener(
        "mouseenter",
        function () {
          rect = card.getBoundingClientRect();
          card.classList.add("is-tilt");
        },
        { passive: true },
      );

      card.addEventListener(
        "mousemove",
        function (e) {
          if (scrolling) return;
          px = e.clientX;
          py = e.clientY;
          if (!raf) raf = requestAnimationFrame(apply);
        },
        { passive: true },
      );

      card.addEventListener("mouseleave", function () {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        rect = null;
        card.classList.remove("is-tilt");
        card.style.transform = "";
      });
    });
  }

  /* Hero: parallax (rAF, direct transform on one element) + pause animations off-screen */
  var scene = document.getElementById("hxScene");
  var hero = document.getElementById("hero");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(
      function (en) {
        hero.classList.toggle("is-off", !en[0].isIntersecting);
      },
      { threshold: 0 },
    ).observe(hero);
  }
  if (scene && fine) {
    var rig = scene.querySelector(".hx-rig");
    var raf2 = 0,
      mx = 0,
      my = 0,
      sr = null;

    function applyHero() {
      raf2 = 0;
      if (!sr || !rig) return;
      var ry = ((mx - sr.left) / sr.width - 0.5) * 14;
      var rx = (0.5 - (my - sr.top) / sr.height) * 10;
      rig.style.transform =
        "rotateY(" + (-18 + ry) + "deg) rotateX(" + (8 + rx) + "deg)";
    }

    scene.addEventListener(
      "mouseenter",
      function () {
        sr = scene.getBoundingClientRect();
      },
      { passive: true },
    );
    scene.addEventListener(
      "mousemove",
      function (e) {
        if (scrolling) return;
        mx = e.clientX;
        my = e.clientY;
        if (!raf2) raf2 = requestAnimationFrame(applyHero);
      },
      { passive: true },
    );
    scene.addEventListener("mouseleave", function () {
      if (raf2) {
        cancelAnimationFrame(raf2);
        raf2 = 0;
      }
      sr = null;
      if (rig) rig.style.transform = ""; /* back to CSS default */
    });
  }
})();

document.querySelectorAll(".pm-svc-card").forEach(function (card) {
  card.addEventListener("mousemove", function (e) {
    var r = card.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform =
      "rotateY(" + x * 5 + "deg) rotateX(" + -y * 5 + "deg) translateY(-6px)";
  });
  card.addEventListener("mouseleave", function () {
    card.style.transform = "";
  });
});
