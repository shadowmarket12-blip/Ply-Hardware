(function () {
  var $ = function (s, c) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  $("#yr").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Scroll reveal
  var rv = $(".bl-rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    rv.forEach(function (el) {
      io.observe(el);
    });
  } else
    rv.forEach(function (el) {
      el.classList.add("in");
    });

  // Card tilt (mouse devices only)
  if (matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
    $(".bl-card").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height;
        c.style.setProperty("--ty", (x - 0.5) * 8 + "deg");
        c.style.setProperty("--tx", (0.5 - y) * 8 + "deg");
        c.style.setProperty("--mx", x * 100 + "%");
        c.style.setProperty("--my", y * 100 + "%");
      });
      c.addEventListener("pointerleave", function () {
        c.style.setProperty("--tx", "0deg");
        c.style.setProperty("--ty", "0deg");
      });
    });
  }

  // TOC: highlight current section (and keep the pill visible on mobile)
  var links = $('.bl-toc a[href^="#"]'),
    map = {};
  links.forEach(function (a) {
    map[a.getAttribute("href").slice(1)] = a;
  });
  if ("IntersectionObserver" in window && links.length) {
    var so = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var a = map[e.target.id];
          if (!a) return;
          links.forEach(function (l) {
            l.classList.remove("on");
          });
          a.classList.add("on");
          var ol = a.closest("ol");
          if (ol && ol.scrollWidth > ol.clientWidth)
            ol.scrollTo({
              left: a.parentNode.offsetLeft - 16,
              behavior: reduce ? "auto" : "smooth",
            });
        });
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    $(".bl-sec").forEach(function (s) {
      so.observe(s);
    });
  }
})();
