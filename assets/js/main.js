(function () {
  "use strict";
  var cfg = window.WE_CONFIG || {};
  var DICT = window.WE_I18N || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- i18n ---------- */
  var LANGS = ["uz", "ru", "en"];
  var HTML_LANG = { uz: "uz", ru: "ru", en: "en" };
  var lang = "uz";

  // O'zbekcha matnlarni HTML dan yig'ib olamiz (asl manba — index.html)
  DICT.uz = DICT.uz || {};
  $$("[data-i18n]").forEach(function (el) {
    var k = el.getAttribute("data-i18n");
    if (!(k in DICT.uz)) DICT.uz[k] = el.tagName === "TITLE" ? el.textContent : el.innerHTML;
  });
  $$("[data-i18n-ph]").forEach(function (el) { var k = el.getAttribute("data-i18n-ph"); if (!(k in DICT.uz)) DICT.uz[k] = el.getAttribute("placeholder"); });
  $$("[data-i18n-aria]").forEach(function (el) { var k = el.getAttribute("data-i18n-aria"); if (!(k in DICT.uz)) DICT.uz[k] = el.getAttribute("aria-label"); });
  $$("[data-i18n-content]").forEach(function (el) { var k = el.getAttribute("data-i18n-content"); if (!(k in DICT.uz)) DICT.uz[k] = el.getAttribute("content"); });

  function t(key) {
    var d = DICT[lang] || {};
    return key in d ? d[key] : (DICT.uz[key] != null ? DICT.uz[key] : key);
  }

  function applyLang(l) {
    lang = LANGS.indexOf(l) > -1 ? l : "uz";
    document.documentElement.lang = HTML_LANG[lang];
    $$("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (el.tagName === "TITLE" || el.tagName === "OPTION") el.textContent = v; else el.innerHTML = v;
    });
    $$("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    $$("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    $$("[data-i18n-content]").forEach(function (el) { el.setAttribute("content", t(el.getAttribute("data-i18n-content"))); });
    $("#langCur").textContent = lang.toUpperCase();
    $$("#langMenu [data-lang]").forEach(function (b) { b.setAttribute("aria-checked", String(b.dataset.lang === lang)); });
    try { localStorage.setItem("we_lang", lang); } catch (e) {}
  }

  var initial = (new URLSearchParams(location.search).get("lang") || "").toLowerCase();
  if (LANGS.indexOf(initial) < 0) { try { initial = localStorage.getItem("we_lang"); } catch (e) { initial = null; } }
  applyLang(initial || "uz");

  /* ---------- Language menu ---------- */
  var langWrap = $("#lang"), langBtn = $("#langBtn");
  function setLangMenu(open) { langWrap.classList.toggle("open", open); langBtn.setAttribute("aria-expanded", String(open)); }
  langBtn.addEventListener("click", function (e) { e.stopPropagation(); setLangMenu(!langWrap.classList.contains("open")); });
  $$("#langMenu [data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.dataset.lang); setLangMenu(false); setMenu(false); });
  });
  document.addEventListener("click", function (e) { if (!langWrap.contains(e.target)) setLangMenu(false); });

  /* ---------- Navbar ---------- */
  var nav = $("#nav"), burger = $("#burger"), links = $("#navLinks");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 30); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setMenu(open) {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", t(open ? "aria.close" : "aria.menu"));
  }
  burger.addEventListener("click", function () { setLangMenu(false); setMenu(!links.classList.contains("open")); });
  $$("#navLinks a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  /* ---------- Active section highlight ---------- */
  var navMap = {};
  $$("#navLinks a").forEach(function (a) { navMap[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && navMap[en.target.id]) {
          $$("#navLinks a").forEach(function (a) { a.classList.remove("active"); });
          navMap[en.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(navMap).forEach(function (id) { var el = document.getElementById(id); if (el) secObs.observe(el); });
  }

  /* ---------- Reveal on scroll + counters ---------- */
  function countUp(el) {
    var target = +el.dataset.count, suffix = el.dataset.suffix || "", start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        $$("[data-count]", en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
    $$("[data-count]").forEach(function (el) { el.textContent = el.dataset.count + (el.dataset.suffix || ""); });
  }

  /* ---------- Map chooser (Google / Apple Maps) ---------- */
  var sheet = $("#mapSheet"), lastFocus = null;
  function openSheet() {
    lastFocus = document.activeElement;
    sheet.hidden = false;
    requestAnimationFrame(function () { sheet.classList.add("open"); });
    document.body.classList.add("no-scroll");
    $(".ms-opt", sheet).focus();
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.classList.remove("open");
    document.body.classList.remove("no-scroll");
    setTimeout(function () { sheet.hidden = true; }, 220);
    if (lastFocus) lastFocus.focus();
  }
  $$(".js-map").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return; // yangi oynada ochish — odatdagidek
      e.preventDefault();
      openSheet();
    });
  });
  $$("[data-ms-close]", sheet).forEach(function (b) { b.addEventListener("click", closeSheet); });
  $$(".ms-opt", sheet).forEach(function (a) { a.addEventListener("click", function () { setTimeout(closeSheet, 50); }); });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    setMenu(false); setLangMenu(false); closeSheet();
  });

  /* ---------- Country cards prefill form ---------- */
  var countrySel = $("#f-country");
  $$("[data-country]").forEach(function (a) {
    a.addEventListener("click", function () { countrySel.value = a.dataset.country; });
  });

  /* ---------- Phone mask (+998 XX XXX-XX-XX) ---------- */
  var phone = $("#f-phone");
  phone.addEventListener("focus", function () { if (!phone.value) phone.value = "+998 "; });
  phone.addEventListener("input", function () {
    var d = phone.value.replace(/\D/g, "");
    if (d.indexOf("998") !== 0) d = "998" + d;
    d = d.slice(0, 12);
    var r = "+998";
    if (d.length > 3) r += " " + d.slice(3, 5);
    if (d.length > 5) r += " " + d.slice(5, 8);
    if (d.length > 8) r += "-" + d.slice(8, 10);
    if (d.length > 10) r += "-" + d.slice(10, 12);
    phone.value = r;
  });

  /* ---------- Lead form ---------- */
  var form = $("#leadForm"), F = form.elements, btn = $("#submitBtn"), note = $("#formNote");
  function setNote(msg, cls) { note.textContent = msg; note.className = "form-note " + (cls || ""); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (F.website.value) return; // honeypot

    var name = F.name.value.trim();
    var tel = F.phone.value.replace(/\D/g, "");
    var okName = name.length >= 2, okTel = tel.length === 12;
    F.name.parentElement.classList.toggle("invalid", !okName);
    F.phone.parentElement.classList.toggle("invalid", !okTel);
    if (!okName || !okTel) { setNote(t("js.invalid"), "err"); return; }

    var data = {
      office: cfg.OFFICE || "Samarqand (bosh ofis)",
      lang: lang.toUpperCase(),
      name: name,
      phone: F.phone.value.trim(),
      region: F.region.value || "-",
      country: F.country.value || "-",
      message: F.message.value.trim() || "-",
      time: new Date().toLocaleString("uz-UZ")
    };
    var text =
      "🆕 Yangi ariza — Work Expert\n" +
      "━━━━━━━━━━━━━━\n" +
      "👤 Ism: " + data.name + "\n" +
      "📞 Telefon: " + data.phone + "\n" +
      "📍 Hudud: " + data.region + "\n" +
      "🌍 Davlat: " + data.country + "\n" +
      "💬 Xabar: " + data.message + "\n" +
      "🌐 Sayt tili: " + data.lang + "\n" +
      "━━━━━━━━━━━━━━\n" +
      "🕒 " + data.time;

    var req;
    if (cfg.ENDPOINT) {
      req = fetch(cfg.ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ text: text }, data)) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); });
    } else if (cfg.TG_TOKEN && cfg.TG_CHAT) {
      req = fetch("https://api.telegram.org/bot" + cfg.TG_TOKEN + "/sendMessage", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: cfg.TG_CHAT, text: text })
      }).then(function (r) { return r.json(); }).then(function (j) { if (!j.ok) throw new Error(j.description); });
    } else {
      setNote(t("js.noconfig").replace("{phone}", cfg.PHONE || ""), "err");
      return;
    }

    btn.disabled = true; btn.textContent = t("js.sending");
    req.then(function () {
      form.reset();
      setNote(t("js.ok"), "ok");
      btn.textContent = t("js.sent");
      setTimeout(function () { btn.disabled = false; btn.textContent = t("form.submit"); }, 4000);
    }).catch(function (err) {
      console.error(err);
      setNote(t("js.error"), "err");
      btn.disabled = false; btn.textContent = t("form.submit");
    });
  });

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
