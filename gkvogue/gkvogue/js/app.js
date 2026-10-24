(function () {
  "use strict";
  var C = window.GK, P = window.GK_PRODUCTS, R = window.GK_REVIEWS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return C.currency + n.toLocaleString("en-IN"); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var store = {
    get: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var wish = store.get("gk_wish", []);
  var byId = function (id) { return P.filter(function (p) { return p.id === id; })[0]; };
  var off = function (p) { return Math.round((1 - p.price / p.mrp) * 100); };
  var CATNAME = { men: "Men", women: "Women", kids: "Kids" };
  var waLink = function (text) { return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text); };
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* ---------- toast ---------- */
  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 2000);
  }

  /* ---------- header / footer ---------- */
  var THEMES = [["pop", "#ff3d81", "Pop pink"], ["sunset", "#ff6b35", "Sunset orange"], ["mint", "#2ad4a0", "Fresh mint"], ["citrus", "#a6e22e", "Citrus lime"]];
  function themeButtons(cls) {
    var cur = document.documentElement.getAttribute("data-theme");
    return THEMES.map(function (t) {
      return '<button type="button" data-theme-btn="' + t[0] + '" style="background:' + t[1] + '" aria-label="' + t[2] + ' theme" aria-pressed="' + (cur === t[0]) + '"></button>';
    }).join("");
  }
  function renderChrome() {
    var link = function (href, label, match) { return '<a href="' + href + '"' + (match.indexOf(page) > -1 ? ' class="active"' : "") + ">" + label + "</a>"; };
    var shopActive = ["shop.html", "men.html", "women.html", "kids.html"].indexOf(page) > -1;
    var msgs = '<span>🔥 <b>END OF SEASON SALE</b> — up to 50% off</span><span>💬 Order on WhatsApp</span><span>🛍️ Fresh drops every week</span><span>✨ Youth-approved fits, pocket-friendly prices</span>';
    $("#site-header").innerHTML =
      '<div class="announce" aria-label="Announcements"><div class="track">' + msgs + msgs + msgs + msgs + '</div></div>' +
      '<header class="site-header"><div class="wrap hbar">' +
      '<a class="logo" href="index.html" aria-label="GK Vogue home"><span class="logo-mark" aria-hidden="true">GK</span><span>Vogue</span></a>' +
      '<nav class="nav" id="nav" aria-label="Main">' + link("index.html", "Home", ["index.html"]) +
      '<div class="dd"><button type="button"' + (shopActive ? ' style="background:var(--s);border-color:var(--ink)"' : "") + '>Shop ▾</button><div class="dd-menu">' +
      link("shop.html", "All", ["shop.html"]) + link("men.html", "Men", ["men.html"]) + link("women.html", "Women", ["women.html"]) + link("kids.html", "Kids", ["kids.html"]) + "</div></div>" +
      link("size-guide.html", "Size Guide", ["size-guide.html"]) + link("about.html", "About", ["about.html"]) + link("contact.html", "Contact", ["contact.html"]) +
      '<div class="mobile-themes"><span>Colours:</span>' + themeButtons() + "</div></nav>" +
      '<div class="tools"><form class="hsearch" action="shop.html" role="search"><label class="sr" for="hs">Search products</label><input id="hs" name="q" type="search" placeholder="Search…"><button aria-label="Search">🔍</button></form>' +
      '<div class="themes" role="group" aria-label="Colour theme">' + themeButtons() + "</div>" +
      '<a class="icon-btn" href="wishlist.html" aria-label="Wishlist">♥<span class="count" id="wcount">0</span></a>' +
      '<button class="icon-btn burger" id="burger" aria-label="Menu" aria-expanded="false">☰</button></div></div></header>';

    $("#site-footer").innerHTML =
      '<footer class="site-footer"><div class="wrap"><div class="fgrid">' +
      '<div><a class="logo" href="index.html" style="color:#fff;display:flex"><span class="logo-mark" style="color:var(--ink)">GK</span><span>Vogue</span></a><p style="margin-top:12px">' + esc(C.tagline) + " Trendy clothing for men, women & kids at prices that don’t hurt.</p></div>" +
      '<div><h4>Shop</h4><a href="men.html">Men</a><a href="women.html">Women</a><a href="kids.html">Kids</a><a href="size-guide.html">Size guide</a></div>' +
      '<div><h4>Company</h4><a href="about.html">About us</a><a href="contact.html">Contact</a><a href="wishlist.html">My wishlist</a><a href="https://instagram.com/' + esc(C.instagram) + '" target="_blank" rel="noopener">Instagram</a></div>' +
      "<div><h4>Visit / Call</h4><p>" + esc(C.address) + "<br>" + esc(C.hours) + '</p><a href="tel:' + esc(C.phone.replace(/\s/g, "")) + '">📞 ' + esc(C.phone) + '</a><a href="mailto:' + esc(C.email) + '">✉️ ' + esc(C.email) + "</a></div>" +
      '</div><p class="copy">© ' + new Date().getFullYear() + " GK Vogue. All rights reserved. Prices and stock may vary in store.</p></div></footer>" +
      '<a class="wa-float" href="' + waLink("Hi GK Vogue! I have a question.") + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">💬</a>';

    $("#burger").addEventListener("click", function () {
      var open = $("#nav").classList.toggle("open"); this.setAttribute("aria-expanded", open);
    });
    $$("[data-theme-btn]").forEach(function (b) {
      b.addEventListener("click", function () {
        var t = b.getAttribute("data-theme-btn");
        document.documentElement.setAttribute("data-theme", t);
        try { localStorage.setItem("gk_theme", t); } catch (e) {}
        $$("[data-theme-btn]").forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-theme-btn") === t); });
      });
    });
    updateCount();
  }
  function updateCount() { var el = $("#wcount"); if (el) el.textContent = wish.length; }

  /* ---------- cards ---------- */
  function card(p) {
    var saved = wish.indexOf(p.id) > -1;
    var tag = p.tag ? '<span class="tag ' + p.tag + '">' + (p.tag === "sale" ? off(p) + "% off" : p.tag) + "</span>" : "";
    var visual = p.img ? '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' : '<span aria-hidden="true">' + p.emoji + "</span>";
    return '<article class="card" data-open="' + p.id + '" tabindex="0" aria-label="' + esc(p.name) + '">' +
      '<button class="heart" data-heart="' + p.id + '" aria-pressed="' + saved + '" aria-label="Save ' + esc(p.name) + ' to wishlist">' + (saved ? "♥" : "♡") + "</button>" +
      '<div class="ph" style="--c1:' + p.c1 + ";--c2:" + p.c2 + '">' + visual + tag + "</div>" +
      '<div class="meta"><h3>' + esc(p.name) + '</h3><p class="type">' + CATNAME[p.cat] + " · " + esc(p.type) + '</p><div class="price"><b>' + money(p.price) + "</b><s>" + money(p.mrp) + "</s><em>" + off(p) + "% off</em></div></div></article>";
  }
  function bindCards(root, onChange) {
    root.addEventListener("click", function (e) {
      var h = e.target.closest("[data-heart]");
      if (h) { e.stopPropagation(); toggleWish(h.getAttribute("data-heart")); if (onChange) onChange(); else refreshHearts(root); return; }
      var c = e.target.closest("[data-open]");
      if (c) openModal(c.getAttribute("data-open"), onChange);
    });
    root.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-open]")) { e.preventDefault(); openModal(e.target.getAttribute("data-open"), onChange); }
    });
  }
  function toggleWish(id) {
    var i = wish.indexOf(id);
    if (i > -1) { wish.splice(i, 1); toast("Removed from wishlist"); } else { wish.push(id); toast("Saved to wishlist ♥"); }
    store.set("gk_wish", wish); updateCount();
  }
  function refreshHearts(root) {
    $$("[data-heart]", root).forEach(function (b) {
      var s = wish.indexOf(b.getAttribute("data-heart")) > -1;
      b.setAttribute("aria-pressed", s); b.textContent = s ? "♥" : "♡";
    });
  }

  /* ---------- modal ---------- */
  var modal, lastFocus;
  function openModal(id, onChange) {
    var p = byId(id); if (!p) return;
    lastFocus = document.activeElement;
    if (!modal) {
      modal = document.createElement("div"); modal.className = "modal"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true");
      document.body.appendChild(modal);
      modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest(".close")) closeModal(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
    }
    var size = "";
    var visual = p.img ? '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '">' : '<span aria-hidden="true">' + p.emoji + "</span>";
    modal.setAttribute("aria-label", p.name);
    modal.innerHTML = '<div class="mbox"><button class="close" aria-label="Close">✕</button><div class="ph" style="--c1:' + p.c1 + ";--c2:" + p.c2 + '">' + visual + "</div>" +
      '<div class="mbody"><p class="eyebrow" style="align-self:flex-start;margin:0">' + CATNAME[p.cat] + " · " + esc(p.type) + "</p><h2>" + esc(p.name) + '</h2><div class="price"><b>' + money(p.price) + "</b><s>" + money(p.mrp) + "</s><em>" + off(p) + "% off</em></div>" +
      "<div><strong>Size</strong></div><div class=\"sizes\">" + p.sizes.map(function (s) { return '<button type="button" class="size" aria-pressed="false">' + s + "</button>"; }).join("") + "</div>" +
      '<a href="size-guide.html" style="font-weight:600;font-size:.9rem">📏 Not sure? See size guide</a>' +
      '<div class="actions"><a class="btn wa" id="m-wa" target="_blank" rel="noopener" href="#">💬 Order on WhatsApp</a>' +
      '<a class="btn white" href="tel:' + esc(C.phone.replace(/\s/g, "")) + '">📞 Call</a>' +
      '<button class="btn alt" id="m-heart" type="button"></button></div><p class="note">No online payment — we confirm availability and details on WhatsApp / call. Photos are sample placeholders.</p></div></div>';

    function sync() {
      var msg = "Hi GK Vogue! I'd like to order:\n• " + p.name + " (" + CATNAME[p.cat] + ")\n• Size: " + (size || "please confirm") + "\n• Price: " + money(p.price) + "\nIs it available?";
      $("#m-wa").setAttribute("href", waLink(msg));
      var s = wish.indexOf(p.id) > -1; $("#m-heart").textContent = s ? "♥ Saved" : "♡ Save";
    }
    $$(".size", modal).forEach(function (b) {
      b.addEventListener("click", function () {
        size = b.textContent; $$(".size", modal).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); sync();
      });
    });
    $("#m-heart").addEventListener("click", function () { toggleWish(p.id); sync(); if (onChange) onChange(); else refreshHearts(document); });
    sync();
    modal.classList.add("open"); document.body.style.overflow = "hidden"; $(".close", modal).focus();
  }
  function closeModal() { modal.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus && lastFocus.focus) lastFocus.focus(); }

  /* ---------- catalogue (shop, men, women, kids) ---------- */
  function initCatalogue() {
    var el = $("#catalogue"); if (!el) return;
    var cat = el.getAttribute("data-cat");
    var pool = P.filter(function (p) { return cat === "all" || p.cat === cat; });
    var types = []; pool.forEach(function (p) { if (types.indexOf(p.type) < 0) types.push(p.type); });
    var sizeSet = []; pool.forEach(function (p) { p.sizes.forEach(function (s) { if (sizeSet.indexOf(s) < 0) sizeSet.push(s); }); });
    var maxP = Math.ceil(Math.max.apply(null, pool.map(function (p) { return p.price; })) / 100) * 100;
    var st = { q: (new URLSearchParams(location.search).get("q") || "").trim(), cat: "all", type: "All", size: "", max: maxP, sale: false, sort: "featured" };

    var catChips = cat === "all" ? '<div class="field"><span>Category</span><div class="chips" id="f-cat">' + ["all", "men", "women", "kids"].map(function (c) { return '<button type="button" class="chip" data-v="' + c + '" aria-pressed="' + (c === "all") + '">' + (c === "all" ? "All" : CATNAME[c]) + "</button>"; }).join("") + "</div></div>" : "";
    el.innerHTML = '<div class="toolbar"><div class="trow"><label class="field">Search<input type="search" id="f-q" placeholder="Try “hoodie” or “jeans”" value="' + esc(st.q) + '"></label>' +
      '<label class="field">Size<select id="f-size"><option value="">Any size</option>' + sizeSet.map(function (s) { return "<option>" + s + "</option>"; }).join("") + "</select></label>" +
      '<label class="field">Max price: <span id="f-maxv">' + money(maxP) + '</span><input type="range" id="f-max" min="200" max="' + maxP + '" step="50" value="' + maxP + '"></label>' +
      '<label class="field">Sort<select id="f-sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="off">Biggest discount</option></select></label>' +
      '<label class="check"><input type="checkbox" id="f-sale"> Sale only</label></div>' +
      catChips + '<div class="field"><span>Type</span><div class="chips" id="f-type"></div></div></div>' +
      '<p class="count-line" id="f-count" aria-live="polite"></p><div class="grid" id="f-grid"></div>';

    function typeChips() {
      var list = pool.filter(function (p) { return st.cat === "all" || p.cat === st.cat; }), ts = ["All"];
      list.forEach(function (p) { if (ts.indexOf(p.type) < 0) ts.push(p.type); });
      if (ts.indexOf(st.type) < 0) st.type = "All";
      $("#f-type").innerHTML = ts.map(function (t) { return '<button type="button" class="chip" data-v="' + esc(t) + '" aria-pressed="' + (t === st.type) + '">' + esc(t) + "</button>"; }).join("");
    }
    function render() {
      var q = st.q.toLowerCase();
      var list = pool.filter(function (p) {
        return (st.cat === "all" || p.cat === st.cat) && (st.type === "All" || p.type === st.type) && (!st.size || p.sizes.indexOf(st.size) > -1) &&
          p.price <= st.max && (!st.sale || p.tag === "sale" || off(p) >= 40) &&
          (!q || (p.name + " " + p.type + " " + CATNAME[p.cat]).toLowerCase().indexOf(q) > -1);
      });
      if (st.sort === "low") list.sort(function (a, b) { return a.price - b.price; });
      if (st.sort === "high") list.sort(function (a, b) { return b.price - a.price; });
      if (st.sort === "off") list.sort(function (a, b) { return off(b) - off(a); });
      $("#f-count").textContent = list.length + (list.length === 1 ? " item" : " items") + (st.q ? ' for “' + st.q + "”" : "");
      $("#f-grid").innerHTML = list.length ? list.map(card).join("") : "";
      if (!list.length) $("#f-grid").innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="e">🕵️</div><h3>Nothing matches</h3><p>Try clearing a filter or searching something else.</p></div>';
    }
    typeChips(); render();
    $("#f-q").addEventListener("input", function () { st.q = this.value.trim(); render(); });
    $("#f-size").addEventListener("change", function () { st.size = this.value; render(); });
    $("#f-sort").addEventListener("change", function () { st.sort = this.value; render(); });
    $("#f-sale").addEventListener("change", function () { st.sale = this.checked; render(); });
    $("#f-max").addEventListener("input", function () { st.max = +this.value; $("#f-maxv").textContent = money(st.max); render(); });
    el.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      if (b.parentNode.id === "f-cat") { st.cat = b.getAttribute("data-v"); $$("#f-cat .chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); typeChips(); }
      else { st.type = b.getAttribute("data-v"); $$("#f-type .chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); }
      render();
    });
    bindCards(el);
  }

  /* ---------- home ---------- */
  function initHome() {
    var t = $("#trending");
    if (t) { t.innerHTML = P.filter(function (p) { return p.tag === "hot" || p.tag === "new"; }).slice(0, 8).map(card).join(""); bindCards(t); }
    var r = $("#reviews");
    if (r) r.innerHTML = R.map(function (x) {
      return '<figure class="review" style="margin:0"><div class="stars" aria-label="' + x.s + ' out of 5">' + "★".repeat(x.s) + "☆".repeat(5 - x.s) + "</div><blockquote style=\"margin:10px 0\">“" + esc(x.t) + '”</blockquote><figcaption><p class="who">' + esc(x.n) + '</p><span class="for">bought: ' + esc(x.p) + "</span></figcaption></figure>";
    }).join("");
    var ig = $("#insta");
    if (ig) {
      var em = ["👕", "👗", "🧥", "👖", "🧒", "✨"];
      ig.innerHTML = em.map(function (e, i) { var c = ["#ff8fab", "#ffd23f", "#8ecae6", "#b8f2c9", "#c3a6ff", "#ffb27a"][i]; return '<a href="https://instagram.com/' + esc(C.instagram) + '" target="_blank" rel="noopener" style="--c1:' + c + ';--c2:#fff" aria-label="Instagram post placeholder ' + (i + 1) + '">' + e + "</a>"; }).join("");
      var h = $("#ig-handle"); if (h) { h.textContent = "@" + C.instagram; h.href = "https://instagram.com/" + C.instagram; }
    }
  }

  /* ---------- shared fills: map, contact info, wishlist, size guide, form ---------- */
  function initShared() {
    $$("[data-fill]").forEach(function (n) {
      var k = n.getAttribute("data-fill");
      if (k === "address") n.textContent = C.address;
      if (k === "hours") n.textContent = C.hours;
      if (k === "phone") { n.textContent = C.phone; n.href = "tel:" + C.phone.replace(/\s/g, ""); }
      if (k === "email") { n.textContent = C.email; n.href = "mailto:" + C.email; }
      if (k === "wa") n.href = waLink("Hi GK Vogue! I have a question.");
    });
    $$("[data-map]").forEach(function (m) {
      if (C.mapEmbed) m.innerHTML = '<iframe src="' + esc(C.mapEmbed) + '" title="GK Vogue location" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
      else m.innerHTML = '<div class="pin"><div class="e">📍</div><strong>Map coming soon</strong><p style="margin:4px 0 0;color:var(--muted)">Shop location will appear here.</p></div>';
    });
  }
  function initWishlist() {
    var el = $("#wishlist"); if (!el) return;
    function render() {
      var items = wish.map(byId).filter(Boolean);
      var bar = $("#wish-bar");
      if (!items.length) { el.innerHTML = '<div class="empty"><div class="e">💔</div><h3>Your wishlist is empty</h3><p>Tap the ♡ on anything you like and it will show up here.</p><a class="btn" href="shop.html">Start shopping</a></div>'; bar.innerHTML = ""; return; }
      el.innerHTML = '<div class="grid">' + items.map(card).join("") + "</div>";
      var msg = "Hi GK Vogue! I'm interested in these:\n" + items.map(function (p, i) { return (i + 1) + ". " + p.name + " (" + CATNAME[p.cat] + ") – " + money(p.price); }).join("\n") + "\nPlease confirm availability & sizes.";
      bar.innerHTML = '<a class="btn wa" target="_blank" rel="noopener" href="' + waLink(msg) + '">💬 Send my wishlist on WhatsApp</a> <button class="btn white" id="wclear" type="button">Clear all</button>';
      $("#wclear").addEventListener("click", function () { wish = []; store.set("gk_wish", wish); updateCount(); render(); });
    }
    render(); bindCards(el, render);
  }
  function initSizeGuide() {
    var tabs = $$("[data-sg]"); if (!tabs.length) return;
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.setAttribute("aria-pressed", x === t); });
        $$(".sg-panel").forEach(function (p) { p.hidden = p.id !== "sg-" + t.getAttribute("data-sg"); });
      });
    });
  }
  function initForm() {
    var f = $("#contact-form"); if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = { name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), topic: f.topic.value, message: f.message.value.trim() };
      var ok = $("#form-ok");
      function done(msg) { ok.textContent = msg; ok.classList.add("show"); f.reset(); }
      if (C.formEndpoint) {
        fetch(C.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) })
          .then(function (r) { if (!r.ok) throw 0; done("Thanks " + d.name + "! We’ll reply to " + d.email + " soon. 🎉"); })
          .catch(function () { ok.textContent = "Couldn’t send right now — please WhatsApp or call us."; ok.classList.add("show"); });
      } else {
        var body = "Name: " + d.name + "\nEmail: " + d.email + "\nPhone: " + d.phone + "\nTopic: " + d.topic + "\n\n" + d.message;
        window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent("GK Vogue enquiry – " + d.topic) + "&body=" + encodeURIComponent(body);
        done("Opening your email app… if nothing opens, WhatsApp us instead!");
      }
    });
  }

  renderChrome(); initShared(); initHome(); initCatalogue(); initWishlist(); initSizeGuide(); initForm();
})();
