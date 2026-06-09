/* ============ Cuba4Rent — App logic ============ */
(function () {
  "use strict";
  var FLEET = window.FLEET, CITIES = window.CITIES, I18N = window.I18N, AGENT = window.AGENT_WA;
  var lang = localStorage.getItem("c4r_lang") || "es";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var t = function (k) { return (I18N[lang] && I18N[lang][k]) || (I18N.es[k]) || k; };

  /* ---- i18n apply ---- */
  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      // preserve trailing inline svg (e.g. "Leer más <svg…>")
      var svg = el.querySelector("svg");
      if (svg && el.childNodes.length > 1) {
        el.childNodes[0].nodeValue = t(k) + " ";
      } else {
        el.textContent = t(k);
      }
    });
    $$("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.getAttribute("data-i18n-ph")); });
    $$(".lang-toggle button").forEach(function (b) { b.classList.toggle("on", b.dataset.lang === lang); });
    renderFleet();
    fillSelects();
    if (current) refreshModalTexts();
  }

  /* ---- language toggle ---- */
  $$(".lang-toggle button").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = b.dataset.lang; localStorage.setItem("c4r_lang", lang); applyLang();
    });
  });

  /* ---- icons for specs ---- */
  var IC = {
    year: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    seats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.2"/><path d="M2 21a7 7 0 0 1 14 0M15 21a5 5 0 0 1 7 0"/></svg>',
    trans: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 4v16M17 4v16M7 9h10M7 14h10"/></svg>',
    fuel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="11" height="18" rx="1"/><path d="M14 8h3l3 3v6a2 2 0 0 1-4 0v-3h-2"/></svg>'
  };

  /* ---- render fleet ---- */
  function carImageHTML(c) {
    if (c.slot) {
      var ph = c.id === "suv" ? t("slot.suv") : t("slot.classic");
      return '<image-slot id="' + c.slot + '" shape="rounded" radius="8" placeholder="' + ph + '"></image-slot>';
    }
    return '<img src="' + c.img + '" alt="' + c.name + '">';
  }
  function renderFleet() {
    var grid = $("#fleetGrid"); if (!grid) return;
    grid.innerHTML = FLEET.map(function (c) {
      return '<div class="car-card">' +
        '<div class="car-img">' + carImageHTML(c) + '</div>' +
        '<div class="car-row"><div class="car-price"><b>$' + c.price + '</b><span>' + t("coll.day") + '</span></div>' +
        '<button class="car-book" data-book="' + c.id + '">' + t("coll.book") + '</button></div>' +
        '<div class="car-body"><div class="car-cat">' + c.cat[lang] + '</div>' +
        '<h3 class="car-name">' + c.name + '</h3><div class="car-rule"></div>' +
        '<ul class="car-specs">' +
        '<li>' + IC.year + c.specs.year + '</li>' +
        '<li>' + IC.seats + c.specs.seats + ' ' + (lang === "es" ? "plazas" : "seats") + '</li>' +
        '<li>' + IC.trans + c.specs.trans[lang] + '</li>' +
        '<li>' + IC.fuel + c.specs.fuel[lang] + '</li>' +
        '</ul></div></div>';
    }).join("");
    $$("[data-book]", grid).forEach(function (b) {
      b.addEventListener("click", function () { openModal(b.getAttribute("data-book")); });
    });
  }

  /* ---- fill selects (cities + cars) ---- */
  function fillSelects() {
    var cityOpts = CITIES.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join("");
    [["#sCity", "search.pickCity"], ["#mCity", "search.pickCity"]].forEach(function (p) {
      var sel = $(p[0]); if (!sel) return;
      var val = sel.value;
      sel.innerHTML = '<option value="">' + t(p[1]) + '</option>' + cityOpts;
      sel.value = val;
    });
    var carSel = $("#sCar");
    if (carSel) {
      var val = carSel.value;
      carSel.innerHTML = '<option value="">' + t("search.pickCar") + '</option>' +
        FLEET.map(function (c) { return '<option value="' + c.id + '">' + c.name + ' — $' + c.price + t("coll.day") + '</option>'; }).join("");
      carSel.value = val;
    }
  }

  /* ============ Booking modal ============ */
  var modal = $("#bookingModal"), current = null, viewerTimer = null;
  function carById(id) { return FLEET.filter(function (c) { return c.id === id; })[0]; }

  var CAR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" style="width:48px;height:34px;opacity:.7"><path d="M5 17h14v-3.3a4 4 0 0 0-.8-2.4L16 8H8l-2.2 3.3A4 4 0 0 0 5 13.7z"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/></svg>';
  function openModal(id, prefill) {
    current = carById(id); if (!current) return;
    var thumb = $(".modal-head .car-thumb");
    var holder = thumb.firstElementChild;
    if (current.slot) {
      holder.outerHTML = '<div id="mImg" style="width:88px;height:56px;display:grid;place-items:center;flex:none">' + CAR_ICON + '</div>';
    } else {
      holder.outerHTML = '<img id="mImg" src="' + current.img + '" alt="' + current.name + '">';
    }
    $("#mCat").textContent = current.cat[lang];
    $("#mTitle").textContent = current.name;
    $("#mPrice").textContent = "$" + current.price;
    // reset to step 1
    goStep(1);
    clearErrors();
    if (prefill) {
      if (prefill.city) $("#mCity").value = prefill.city;
      if (prefill.from) $("#mFrom").value = prefill.from;
      if (prefill.to) $("#mTo").value = prefill.to;
    }
    // default dates
    var today = new Date(); var iso = today.toISOString().slice(0, 10);
    $("#mFrom").min = iso; $("#mTo").min = iso;
    recalc();
    startViewers();
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
    function set() {
      var n = Math.floor(Math.random() * 8) + 3;
      $("#mViewers").textContent = n + " " + t("m.viewing");
    }
    set();
    if (viewerTimer) clearInterval(viewerTimer);
    viewerTimer = setInterval(set, 15000);
  }

  function goStep(n) {
    $("#mStep1").classList.toggle("hidden", n !== 1);
    $("#mStep2").classList.toggle("hidden", n !== 2);
    $$(".progress .pstep").forEach(function (p) {
      var pn = +p.dataset.p;
      p.classList.toggle("active", pn === n);
      p.classList.toggle("done", pn < n);
    });
    modal.querySelector(".modal").scrollTop = 0;
  }

  /* ---- total calc ---- */
  function daysBetween(a, b) {
    if (!a || !b) return 0;
    var d = (new Date(b) - new Date(a)) / 86400000;
    return d > 0 ? Math.round(d) : 0;
  }
  function recalc() {
    if (!current) return;
    var days = daysBetween($("#mFrom").value, $("#mTo").value);
    var total = days * current.price;
    var dayLabel = days === 1 ? t("m.day") : t("m.days_p");
    var dtxt = days ? days + " " + dayLabel : "—";
    $("#mDays").textContent = dtxt;
    $("#mDays2").textContent = dtxt;
    $("#mTotal").textContent = "$" + total;
    $("#mTotal2").textContent = "$" + total;
    var city = $("#mCity").value;
    $("#mSummary").textContent = current.name + (city ? " · " + city : "");
  }
  ["#mFrom", "#mTo", "#mCity"].forEach(function (s) {
    document.addEventListener("change", function (e) { if (e.target.matches(s)) { if (s === "#mFrom") syncMinReturn(); recalc(); } });
  });
  function syncMinReturn() {
    var f = $("#mFrom").value;
    if (f) { $("#mTo").min = f; if ($("#mTo").value && $("#mTo").value < f) $("#mTo").value = ""; }
  }

  /* ---- validation ---- */
  function clearErrors() { $$(".field.show-err").forEach(function (f) { f.classList.remove("show-err"); }); $$("input.err,select.err").forEach(function (i) { i.classList.remove("err"); }); }
  function fail(fieldSel, inputSel) { $(fieldSel).classList.add("show-err"); if (inputSel) $(inputSel).classList.add("err"); }

  function refreshModalTexts() {
    if (!current) return;
    $("#mCat").textContent = current.cat[lang];
    recalc();
    var n = ($("#mViewers").textContent.match(/\d+/) || [Math.floor(Math.random() * 8) + 3])[0];
    $("#mViewers").textContent = n + " " + t("m.viewing");
  }

  /* ---- step 1 → 2 ---- */
  $("#mNext").addEventListener("click", function () {
    clearErrors(); var ok = true;
    if (!$("#mCity").value) { fail("#fCity", "#mCity"); ok = false; }
    if (!$("#mFrom").value || !$("#mTo").value) { fail("#fTo", "#mTo"); ok = false; }
    else if (daysBetween($("#mFrom").value, $("#mTo").value) < 1) {
      $("#fTo").classList.add("show-err"); $("#fTo .err-msg").textContent = t("m.errDate2"); $("#mTo").classList.add("err"); ok = false;
    }
    if (ok) goStep(2);
  });
  $("#mBack").addEventListener("click", function () { goStep(1); });

  /* ---- step 2 → WhatsApp ---- */
  function fmtDate(s) { var d = new Date(s + "T00:00:00"); return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear(); }

  function buildMessage() {
    var days = daysBetween($("#mFrom").value, $("#mTo").value);
    var total = days * current.price;
    var notes = $("#mNotes").value.trim();
    var msg = "🚗 *RESERVA Cuba4Rent*\n\n" +
      "Auto: *" + current.name + "*\n" +
      "Categoría: " + current.cat.es + "\n" +
      "Precio: $" + current.price + "/día\n\n" +
      "👤 Cliente: " + $("#mName").value.trim() + "\n" +
      "📱 Contacto: " + $("#mPhone").value.trim() + "\n" +
      "📍 Ciudad de recogida: " + $("#mCity").value + "\n" +
      "📅 Recogida: " + fmtDate($("#mFrom").value) + "\n" +
      "📅 Devolución: " + fmtDate($("#mTo").value) + "\n" +
      "⏱ Duración: " + days + " día" + (days > 1 ? "s" : "") + "\n" +
      "💰 Total estimado: *$" + total + " USD*\n" +
      (notes ? "📝 Notas: " + notes + "\n" : "") +
      "\n_Generado desde Cuba4Rent.com_";
    return encodeURIComponent(msg);
  }

  $("#mSend").addEventListener("click", function () {
    clearErrors(); var ok = true;
    if ($("#mName").value.trim().length < 2) { fail("#fName", "#mName"); ok = false; }
    var phone = $("#mPhone").value.replace(/[^\d]/g, "");
    if (phone.length < 7) { fail("#fPhone", "#mPhone"); ok = false; }
    if (!ok) return;
    var url = "https://wa.me/" + AGENT + "?text=" + buildMessage();
    window.open(url, "_blank");
  });

  /* ---- close handlers ---- */
  $("#mClose").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("show")) closeModal(); });

  /* ============ Search form → open modal prefilled ============ */
  $("#searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var carId = $("#sCar").value || FLEET[0].id;
    openModal(carId, { city: $("#sCity").value, from: $("#sFrom").value, to: $("#sTo").value });
  });
  // search date min
  (function () {
    var iso = new Date().toISOString().slice(0, 10);
    if ($("#sFrom")) { $("#sFrom").min = iso; $("#sTo").min = iso; }
    if ($("#sFrom")) $("#sFrom").addEventListener("change", function () { if ($("#sFrom").value) $("#sTo").min = $("#sFrom").value; });
  })();

  /* ============ Accordion ============ */
  $$(".acc-item .acc-head").forEach(function (h) {
    h.addEventListener("click", function () {
      var item = h.parentElement, open = item.classList.contains("open");
      $$(".acc-item").forEach(function (i) { i.classList.remove("open"); });
      if (!open) item.classList.add("open");
    });
  });

  /* ============ Mobile nav ============ */
  var mnav = $("#mobileNav");
  $("#burger").addEventListener("click", function () { mnav.classList.add("show"); });
  mnav.addEventListener("click", function (e) {
    if (e.target === mnav || e.target.tagName === "A") mnav.classList.remove("show");
  });

  /* ============ Header active link on scroll ============ */
  var sections = ["top", "fleet", "services", "about", "contact"];
  window.addEventListener("scroll", function () {
    var pos = window.scrollY + 120, cur = "top";
    sections.forEach(function (id) { var el = document.getElementById(id); if (el && el.offsetTop <= pos) cur = id; });
    $$(".nav a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + cur); });
  }, { passive: true });

  /* ---- init ---- */
  fillSelects();
  applyLang();
})();
