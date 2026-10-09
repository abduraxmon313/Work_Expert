(function () {
  "use strict";
  var cfg = window.WE_CONFIG || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Navbar ---------- */
  var nav = $("#nav"), burger = $("#burger"), links = $("#navLinks");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 30); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setMenu(open) {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    if (open) nav.classList.add("scrolled"); else onScroll();
  }
  burger.addEventListener("click", function () { setMenu(!links.classList.contains("open")); });
  $$("#navLinks a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

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
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
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
    if (!okName || !okTel) { setNote("Iltimos, ismingiz va to'liq telefon raqamingizni kiriting.", "err"); return; }

    var data = {
      branch: cfg.BRANCH || "Samarqand",
      name: name,
      phone: F.phone.value.trim(),
      region: F.region.value || "-",
      country: F.country.value || "-",
      message: F.message.value.trim() || "-",
      time: new Date().toLocaleString("uz-UZ")
    };
    var text =
      "🆕 Yangi ariza — Work Expert (" + data.branch + " filiali)\n" +
      "━━━━━━━━━━━━━━\n" +
      "👤 Ism: " + data.name + "\n" +
      "📞 Telefon: " + data.phone + "\n" +
      "📍 Hudud: " + data.region + "\n" +
      "🌍 Davlat: " + data.country + "\n" +
      "💬 Xabar: " + data.message + "\n" +
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
      setNote("Forma hali sozlanmagan. Iltimos, " + (cfg.PHONE || "") + " raqamiga qo'ng'iroq qiling.", "err");
      return;
    }

    btn.disabled = true; btn.textContent = "Yuborilmoqda...";
    req.then(function () {
      form.reset();
      setNote("✓ Arizangiz qabul qilindi! Tez orada siz bilan bog'lanamiz.", "ok");
      btn.textContent = "Yuborildi ✓";
      setTimeout(function () { btn.disabled = false; btn.textContent = "Arizani yuborish"; }, 4000);
    }).catch(function (err) {
      console.error(err);
      setNote("Xatolik yuz berdi. Qayta urinib ko'ring yoki bizga qo'ng'iroq qiling.", "err");
      btn.disabled = false; btn.textContent = "Arizani yuborish";
    });
  });

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
