/* ============ Cuba4Rent — App ============ */
(function () {
  "use strict";
  var FLEET = window.FLEET, CITIES = window.CITIES, I18N = window.I18N, AGENT = window.AGENT_WA;
  var lang = localStorage.getItem("c4r_lang") || "es";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var t = function (k) { return (I18N[lang] && I18N[lang][k]) || (I18N.es[k]) || k; };

  /* ─── i18n ─── */
  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      var svg = el.querySelector("svg");
      if (svg && el.childNodes.length > 1) { el.childNodes[0].nodeValue = t(k) + " "; }
      else { el.innerHTML = t(k); }
    });
    $$("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.getAttribute("data-i18n-ph")); });
    $$(".lang-toggle button").forEach(function (b) { b.classList.toggle("on", b.dataset.lang === lang); });
    updateFilterLabels();
    renderFleet();
    renderLastMinute();
    renderEarlyBird();
    renderCategories();
    fillSelects();
    if (current) refreshModalTexts();
  }

  /* ─── lang toggle ─── */
  $$(".lang-toggle button").forEach(function (b) {
    b.addEventListener("click", function () { lang = b.dataset.lang; localStorage.setItem("c4r_lang", lang); applyLang(); });
  });

  /* ─── Icons ─── */
  var IC = {
    trans:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 4v16M17 4v16M7 9h10M7 14h10"/></svg>',
    bags:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    gas:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="11" height="18" rx="1"/><path d="M14 8h3l3 3v6a2 2 0 0 1-4 0v-3h-2"/></svg>',
    doors:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
    seats:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="3"/><path d="M2 21a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="2.5"/><path d="M13 21a5 5 0 0 1 8 0"/></svg>',
    shield:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    check:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>',
    clock24:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    tag:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/></svg>'
  };

  /* ─── Build one car card (Gran Azul style) ─── */
  function carImageHTML(c) {
    if (c.slot) {
      var ph = c.id === "suv" ? t("slot.suv") : t("slot.classic");
      return '<image-slot id="' + c.slot + '" shape="cover" radius="0" placeholder="' + ph + '"></image-slot>';
    }
    return '<img src="' + c.img + '" alt="' + c.name + '" loading="lazy">';
  }

  function buildCard(c) {
    var discBadge  = c.discount ? '<div class="cc-discount">-' + c.discount + '%</div>' : '';
    var origPrice  = c.origPrice ? '<span class="cc-orig">' + t("coll.before") + ' $' + c.origPrice + '</span>' : '';
    return (
      '<div class="car-card" data-cat="' + c.filterCat + '">' +
        '<div class="cc-img">' +
          carImageHTML(c) +
          discBadge +
        '</div>' +
        '<div class="cc-body">' +
          '<div class="cc-category">' + c.cat[lang] + '</div>' +
          '<h3 class="cc-name">' + c.name + '</h3>' +
          '<ul class="cc-specs">' +
            '<li>' + IC.trans  + '<span>' + c.specs.trans[lang] + '</span></li>' +
            '<li>' + IC.bags   + '<span>' + c.bags + ' ' + t("coll.bags") + '</span></li>' +
            '<li>' + IC.gas    + '<span>' + c.gasPolicy[lang] + '</span></li>' +
            '<li>' + IC.doors  + '<span>' + c.doors + ' ' + t("coll.doors") + '</span></li>' +
            '<li>' + IC.seats  + '<span>' + c.specs.seats + (lang === "es" ? " asientos" : " seats") + '</span></li>' +
            '<li>' + IC.shield + '<span>' + t("coll.insurance") + '</span></li>' +
          '</ul>' +
          '<div class="cc-footer">' +
            '<div class="cc-price-block">' +
              origPrice +
              '<div class="cc-price-main">' + t("coll.from") + ' <strong>$' + c.price + '</strong><span>' + t("coll.day") + '</span></div>' +
            '</div>' +
            '<button class="btn btn-red cc-book" data-book="' + c.id + '">' + t("coll.book") + '</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* ─── Render fleet grid ─── */
  var activeFilter = "all";

  function renderFleet() {
    var grid = $("#fleetGrid"); if (!grid) return;
    grid.innerHTML = FLEET.map(buildCard).join("");
    bindBookButtons(grid);
    applyFilter(activeFilter);
  }

  function renderLastMinute() {
    var grid = $("#lastminGrid"); if (!grid) return;
    var cars = FLEET.filter(function (c) { return c.lastMinute; });
    grid.innerHTML = cars.map(buildCard).join("");
    bindBookButtons(grid);
  }

  function renderEarlyBird() {
    var grid = $("#earlybirdGrid"); if (!grid) return;
    var cars = FLEET.filter(function (c) { return c.earlyBird; });
    grid.innerHTML = cars.map(buildCard).join("");
    bindBookButtons(grid);
  }

  function bindBookButtons(container) {
    $$("[data-book]", container).forEach(function (b) {
      b.addEventListener("click", function () { openModal(b.getAttribute("data-book")); });
    });
  }

  /* ─── Category grid ─── */
  function renderCategories() {
    var grid = $("#catGrid"); if (!grid) return;
    grid.innerHTML = FLEET.map(function (c) {
      var imgHtml = c.slot
        ? '<div class="cat-slot-ph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48"><path d="M5 17h14v-3.3a4 4 0 0 0-.8-2.4L16 8H8l-2.2 3.3A4 4 0 0 0 5 13.7z"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/></svg></div>'
        : '<img src="' + c.img + '" alt="' + c.name + '" loading="lazy">';
      return (
        '<div class="cat-card" data-book="' + c.id + '">' +
          '<div class="cat-img">' + imgHtml + '</div>' +
          '<div class="cat-info">' +
            '<div class="cat-label">' + c.cat[lang] + '</div>' +
            '<div class="cat-name">' + c.name + '</div>' +
            '<div class="cat-price">' + t("cat.from") + ' <strong>$' + c.price + '</strong>' + t("coll.day") + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join("");
    $$(".cat-card").forEach(function (card) {
      card.addEventListener("click", function () { openModal(card.dataset.book); });
    });
  }

  /* ─── Fleet filters ─── */
  function applyFilter(cat) {
    activeFilter = cat;
    $$(".car-card", $("#fleetGrid")).forEach(function (card) {
      card.classList.toggle("card-hidden", cat !== "all" && card.dataset.cat !== cat);
    });
    $$(".ff-btn").forEach(function (b) { b.classList.toggle("active", b.dataset.cat === cat); });
  }

  function updateFilterLabels() {
    var map = { "all":"filter.all","economico":"filter.eco","estandar":"filter.std","suv":"filter.suv","premium":"filter.prem","luxury":"filter.lux","clasico":"filter.cls" };
    $$(".ff-btn").forEach(function (b) { if (map[b.dataset.cat]) b.textContent = t(map[b.dataset.cat]); });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".ff-btn");
    if (btn) applyFilter(btn.dataset.cat);
  });

  /* ─── Fill selects ─── */
  function fillSelects() {
    var cityOpts = CITIES.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join("");
    [["#sCity","hf.pickCity"],["#mCity","hf.pickCity"]].forEach(function (p) {
      var sel = $(p[0]); if (!sel) return;
      var val = sel.value;
      sel.innerHTML = '<option value="">' + t(p[1]) + '</option>' + cityOpts;
      sel.value = val;
    });
  }

  /* ─── Stats counter ─── */
  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      statsObserver.unobserve(entry.target);
      $$(".stat-num", entry.target).forEach(function (el) {
        var target = parseInt(el.dataset.target, 10), start = 0;
        var step = target / (1600 / 16);
        var timer = setInterval(function () {
          start = Math.min(start + step, target);
          el.textContent = Math.floor(start).toLocaleString();
          if (start >= target) clearInterval(timer);
        }, 16);
      });
    });
  }, { threshold: 0.3 });
  var statsSec = $("#statsSec");
  if (statsSec) statsObserver.observe(statsSec);

  /* ─── FAQ accordion ─── */
  document.addEventListener("click", function (e) {
    var head = e.target.closest(".faq-head");
    if (!head) return;
    var item = head.parentElement;
    var isOpen = item.classList.contains("open");
    $$(".faq-item.open").forEach(function (i) { i.classList.remove("open"); });
    if (!isOpen) item.classList.add("open");
  });

  /* ─── Steps accordion ─── */
  $$(".acc-item .acc-head").forEach(function (h) {
    h.addEventListener("click", function () {
      var item = h.parentElement, open = item.classList.contains("open");
      $$(".acc-item").forEach(function (i) { i.classList.remove("open"); });
      if (!open) item.classList.add("open");
    });
  });

  /* ─── Sticky bar ─── */
  var stickyBar = $("#stickyBar");
  var heroEl    = $("#top");
  if (stickyBar && heroEl) {
    var stickyShown = false;
    window.addEventListener("scroll", function () {
      var show = window.scrollY > (heroEl.offsetTop + heroEl.offsetHeight);
      if (show !== stickyShown) { stickyShown = show; stickyBar.classList.toggle("show", show); }
    }, { passive: true });
  }

  /* ─── Mobile nav ─── */
  var mnav = $("#mobileNav");
  $("#burger").addEventListener("click", function () { mnav.classList.add("show"); });
  mnav.addEventListener("click", function (e) { if (e.target === mnav || e.target.tagName === "A") mnav.classList.remove("show"); });

  /* ─── Header active link ─── */
  window.addEventListener("scroll", function () {
    var pos = window.scrollY + 120, cur = "top";
    ["top","fleet","about","contact"].forEach(function (id) {
      var el = document.getElementById(id); if (el && el.offsetTop <= pos) cur = id;
    });
    $$(".nav a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + cur); });
  }, { passive: true });

  /* ══════════════ Booking modal ══════════════ */
  var modal = $("#bookingModal"), current = null, viewerTimer = null;
  var prefillData = {};

  function carById(id) { return FLEET.filter(function (c) { return c.id === id; })[0]; }

  var CAR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" style="width:48px;height:34px;opacity:.7"><path d="M5 17h14v-3.3a4 4 0 0 0-.8-2.4L16 8H8l-2.2 3.3A4 4 0 0 0 5 13.7z"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/></svg>';

  function openModal(id, pf) {
    current = carById(id); if (!current) return;
    var pref = pf || prefillData;
    var thumb = $(".modal-head .car-thumb"), holder = thumb.firstElementChild;
    if (current.slot) {
      holder.outerHTML = '<div id="mImg" style="width:88px;height:56px;display:grid;place-items:center;flex:none">' + CAR_ICON + '</div>';
    } else {
      holder.outerHTML = '<img id="mImg" src="' + current.img + '" alt="' + current.name + '">';
    }
    $("#mCat").textContent  = current.cat[lang];
    $("#mTitle").textContent = current.name;
    $("#mPrice").textContent = "$" + current.price;
    goStep(1); clearErrors();
    var iso = new Date().toISOString().slice(0, 10);
    $("#mFrom").min = iso; $("#mTo").min = iso;
    if (pref.city) $("#mCity").value = pref.city;
    if (pref.from) { $("#mFrom").value = pref.from; syncMinReturn(); }
    if (pref.to)   $("#mTo").value   = pref.to;
    recalc(); startViewers();
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    setTimeout(function () { $("#mCity").focus(); }, 300);
  }

  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    if (viewerTimer) clearInterval(viewerTimer);
    current = null;
  }

  function startViewers() {
    function set() { $("#mViewers").textContent = (Math.floor(Math.random() * 8) + 3) + " " + t("m.viewing"); }
    set();
    if (viewerTimer) clearInterval(viewerTimer);
    viewerTimer = setInterval(set, 15000);
  }

  function goStep(n) {
    $("#mStep1").classList.toggle("hidden", n !== 1);
    $("#mStep2").classList.toggle("hidden", n !== 2);
    $$(".progress .pstep").forEach(function (p) {
      p.classList.toggle("active", +p.dataset.p === n);
      p.classList.toggle("done",   +p.dataset.p < n);
    });
    modal.querySelector(".modal").scrollTop = 0;
  }

  function daysBetween(a, b) {
    if (!a || !b) return 0;
    var d = (new Date(b) - new Date(a)) / 86400000;
    return d > 0 ? Math.round(d) : 0;
  }
  function recalc() {
    if (!current) return;
    var days = daysBetween($("#mFrom").value, $("#mTo").value);
    var total = days * current.price;
    var dl = days === 1 ? t("m.day") : t("m.days_p");
    var dtxt = days ? days + " " + dl : "—";
    $("#mDays").textContent  = dtxt;
    $("#mDays2").textContent = dtxt;
    $("#mTotal").textContent  = "$" + total;
    $("#mTotal2").textContent = "$" + total;
    $("#mSummary").textContent = current.name + ($("#mCity").value ? " · " + $("#mCity").value : "");
  }
  ["#mFrom","#mTo","#mCity"].forEach(function (s) {
    document.addEventListener("change", function (e) { if (e.target.matches(s)) { if (s === "#mFrom") syncMinReturn(); recalc(); } });
  });
  function syncMinReturn() {
    var f = $("#mFrom").value;
    if (f) { $("#mTo").min = f; if ($("#mTo").value && $("#mTo").value < f) $("#mTo").value = ""; }
  }

  function clearErrors() {
    $$(".field.show-err").forEach(function (f) { f.classList.remove("show-err"); });
    $$("input.err,select.err").forEach(function (i) { i.classList.remove("err"); });
  }
  function fail(fs, is) { $(fs).classList.add("show-err"); if (is) $(is).classList.add("err"); }

  function refreshModalTexts() {
    if (!current) return;
    $("#mCat").textContent = current.cat[lang]; recalc();
    var n = ($("#mViewers").textContent.match(/\d+/) || [Math.floor(Math.random() * 8) + 3])[0];
    $("#mViewers").textContent = n + " " + t("m.viewing");
  }

  $("#mNext").addEventListener("click", function () {
    clearErrors(); var ok = true;
    if (!$("#mCity").value) { fail("#fCity","#mCity"); ok = false; }
    if (!$("#mFrom").value || !$("#mTo").value) { fail("#fTo","#mTo"); ok = false; }
    else if (daysBetween($("#mFrom").value, $("#mTo").value) < 1) {
      $("#fTo").classList.add("show-err"); $("#fTo .err-msg").textContent = t("m.errDate2"); $("#mTo").classList.add("err"); ok = false;
    }
    if (ok) goStep(2);
  });
  $("#mBack").addEventListener("click", function () { goStep(1); });

  function fmtDate(s) { var d = new Date(s + "T00:00:00"); return ("0"+d.getDate()).slice(-2)+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+d.getFullYear(); }
  function buildMessage() {
    var days = daysBetween($("#mFrom").value, $("#mTo").value), total = days * current.price;
    return encodeURIComponent("🚗 *RESERVA Cuba4Rent*\n\nAuto: *" + current.name + "*\nCategoría: " + current.cat.es + "\nPrecio: $" + current.price + "/día\n\n👤 Cliente: " + $("#mName").value.trim() + "\n📱 Contacto: " + $("#mPhone").value.trim() + "\n📍 Ciudad: " + $("#mCity").value + "\n📅 Recogida: " + fmtDate($("#mFrom").value) + "\n📅 Devolución: " + fmtDate($("#mTo").value) + "\n⏱ Duración: " + days + " día" + (days > 1 ? "s" : "") + "\n💰 Total: *$" + total + " USD*\n" + ($("#mNotes").value.trim() ? "📝 Notas: " + $("#mNotes").value.trim() + "\n" : "") + "\n_Generado desde Cuba4Rent.com_");
  }

  $("#mSend").addEventListener("click", function () {
    clearErrors(); var ok = true;
    if ($("#mName").value.trim().length < 2) { fail("#fName","#mName"); ok = false; }
    if ($("#mPhone").value.replace(/[^\d]/g,"").length < 7) { fail("#fPhone","#mPhone"); ok = false; }
    if (!ok) return;
    window.open("https://wa.me/" + AGENT + "?text=" + buildMessage(), "_blank");
  });

  $("#mClose").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("show")) closeModal(); });

  /* ─── Hero search form → store prefill + scroll to fleet ─── */
  var heroForm = $("#heroForm");
  if (heroForm) {
    var iso = new Date().toISOString().slice(0, 10);
    var sFrom = $("#sFrom"), sTo = $("#sTo");
    if (sFrom) { sFrom.min = iso; sTo.min = iso; }
    if (sFrom) sFrom.addEventListener("change", function () { if (sFrom.value) sTo.min = sFrom.value; });
    heroForm.addEventListener("submit", function (e) {
      e.preventDefault();
      prefillData = { city: $("#sCity").value, from: sFrom ? sFrom.value : "", to: sTo ? sTo.value : "" };
      var fleet = document.getElementById("fleet");
      if (fleet) fleet.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ─── Init ─── */
  fillSelects();
  applyLang();
})();
