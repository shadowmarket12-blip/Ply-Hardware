(function () {
  var data = (window.BLOGS || []).slice();
  var MIN_SLOTS = 3; // grid always shows at least this many cards (rest = "coming soon")
  var feat = document.getElementById("blFeat"),
    grid = document.getElementById("blGrid"),
    filters = document.getElementById("blFilters"),
    search = document.getElementById("blSearch"),
    empty = document.getElementById("blEmpty"),
    count = document.getElementById("blCount");
  var cat = "All",
    q = "";
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  };
  var arrow =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function img(b, eager) {
    return (
      '<div class="bls-img"><img src="' +
      esc(b.image) +
      '" alt="' +
      esc(b.alt || b.title) +
      '" width="800" height="550" ' +
      (eager ? 'fetchpriority="high"' : 'loading="lazy"') +
      ' decoding="async" onerror="this.parentNode.classList.add(\'is-fallback\');this.remove()"></div>'
    );
  }
  function meta(b) {
    return (
      '<div class="bls-meta"><span class="bls-cat">' +
      esc(b.category) +
      "</span>" +
      (b.readTime ? "<span>" + esc(b.readTime) + "</span>" : "") +
      "</div>"
    );
  }
  function card(b, i) {
    return (
      '<a class="bls-card" style="--d:' +
      i * 80 +
      'ms" href="' +
      esc(b.url) +
      '">' +
      img(b) +
      '<div class="bls-info">' +
      meta(b) +
      "<h3>" +
      esc(b.title) +
      "</h3><p>" +
      esc(b.excerpt) +
      '</p><span class="bls-more">Read blog ' +
      arrow +
      "</span></div></a>"
    );
  }
  function soon(i) {
    return (
      '<div class="bls-card bls-soon" style="--d:' +
      i * 80 +
      'ms" aria-hidden="true"><div class="bls-img is-fallback"></div><div class="bls-info"><div class="bls-meta"><span class="bls-cat">Coming soon</span></div><h3>New guide on the way</h3><p>We are writing more plywood and interior material guides for you.</p></div></div>'
    );
  }
  function featured(b) {
    return (
      '<a class="bls-feat" href="' +
      esc(b.url) +
      '">' +
      img(b, true) +
      '<div class="bls-feat-info"><span class="bl-tag">Featured</span>' +
      meta(b) +
      "<h2>" +
      esc(b.title) +
      "</h2><p>" +
      esc(b.excerpt) +
      '</p><span class="bl-btn">Read full blog</span></div></a>'
    );
  }
  function tiltBind(root) {
    if (
      !matchMedia("(hover:hover)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    root
      .querySelectorAll(".bls-card:not(.bls-soon),.bls-feat")
      .forEach(function (c) {
        c.addEventListener("pointermove", function (e) {
          var r = c.getBoundingClientRect(),
            x = (e.clientX - r.left) / r.width,
            y = (e.clientY - r.top) / r.height;
          c.style.setProperty("--ty", (x - 0.5) * 7 + "deg");
          c.style.setProperty("--tx", (0.5 - y) * 7 + "deg");
          c.style.setProperty("--mx", x * 100 + "%");
          c.style.setProperty("--my", y * 100 + "%");
        });
        c.addEventListener("pointerleave", function () {
          c.style.setProperty("--tx", "0deg");
          c.style.setProperty("--ty", "0deg");
        });
      });
  }
  function matches(b) {
    var okC = cat === "All" || b.category === cat;
    var t = (b.title + " " + b.excerpt + " " + b.category).toLowerCase();
    return okC && (!q || t.indexOf(q) > -1);
  }
  function render() {
    var list = data.filter(matches),
      filtering = cat !== "All" || q;
    var first = filtering ? null : list[0],
      rest = filtering ? list : list.slice(1);
    feat.innerHTML = first ? featured(first) : "";
    var html = rest.map(card);
    if (!filtering)
      for (var i = rest.length; i < MIN_SLOTS; i++) html.push(soon(i));
    grid.innerHTML = html.join("");
    document.querySelector(".bls-head").hidden = !rest.length && !html.length;
    count.textContent = list.length + (list.length === 1 ? " blog" : " blogs");
    empty.hidden = list.length > 0;
    tiltBind(feat);
    tiltBind(grid);
  }
  var cats = ["All"].concat(
    data
      .map(function (b) {
        return b.category;
      })
      .filter(function (c, i, a) {
        return a.indexOf(c) === i;
      }),
  );
  filters.innerHTML = cats
    .map(function (c, i) {
      return (
        '<button type="button" role="tab" class="' +
        (i ? "" : "on") +
        '" data-c="' +
        esc(c) +
        '">' +
        esc(c) +
        "</button>"
      );
    })
    .join("");
  filters.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    cat = b.getAttribute("data-c");
    filters.querySelectorAll("button").forEach(function (x) {
      x.classList.toggle("on", x === b);
    });
    render();
  });
  search.addEventListener("input", function () {
    q = search.value.trim().toLowerCase();
    render();
  });
  document.querySelectorAll("#yr").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
  render();
})();
