/*
==========================================================================
 MOBILE-MOTION.JS : animations tactiles (mobile uniquement)
 --------------------------------------------------------------------------
   1. Onde lumineuse au toucher sur les boutons
   2. Section Impact : les cartes entrent l'une après l'autre, et la carte
      au centre de l'écran s'anime comme au survol sur ordinateur
 Ne fait rien sur grand écran, ni si l'appareil demande « réduire les animations ».
 Le style associé : assets/css/mobile-motion.css
==========================================================================
*/
(function () {
  'use strict';
  var w = window, d = document;
  var mm = function (q) { return !!(w.matchMedia && w.matchMedia(q).matches); };
  if (!mm('(max-width:767px)')) return;
  if (mm('(prefers-reduced-motion: reduce)')) return;

  /* ---------- 1. ONDE AU TOUCHER SUR LES BOUTONS ---------- */
  d.addEventListener('pointerdown', function (e) {
    var b = e.target.closest ? e.target.closest('.button') : null;
    if (!b || b.disabled) return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2;
    var i = d.createElement('span');
    i.className = 'm-ripple';
    i.setAttribute('aria-hidden', 'true');
    i.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    b.appendChild(i);
    setTimeout(function () { if (i.parentNode) i.parentNode.removeChild(i); }, 750);
  }, { passive: true });

  /* ---------- 2. SECTION IMPACT ---------- */
  function initImpact() {
    var cards = Array.prototype.slice.call(d.querySelectorAll('.impact-card'));
    if (!cards.length || !('IntersectionObserver' in w)) return false;

    // a) entrée des cartes, en cascade
    cards.forEach(function (c, i) { c.classList.add('m-pre'); c.style.transitionDelay = (i % 3) * 90 + 'ms,' + (i % 3) * 90 + 'ms,0s,0s'; });
    var enter = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('m-in');
        enter.unobserve(e.target);
        // le délai de cascade ne doit pas ralentir les effets suivants
        setTimeout(function () { e.target.style.transitionDelay = ''; }, 1200);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    cards.forEach(function (c) { enter.observe(c); });

    // b) la carte la plus proche du centre de l'écran devient « active » (effet de survol)
    var seen = new Set(), current = null;
    var pick = function () {
      var mid = w.innerHeight / 2, best = null, bd = 1e9;
      seen.forEach(function (c) {
        var r = c.getBoundingClientRect(), dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bd) { bd = dist; best = c; }
      });
      if (best === current) return;
      if (current) current.classList.remove('m-live');
      current = best;
      if (current) current.classList.add('m-live');
    };
    var live = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) seen.add(e.target); else { seen.delete(e.target); if (e.target === current) { e.target.classList.remove('m-live'); current = null; } } });
      pick();
    }, { rootMargin: '-30% 0px -30% 0px', threshold: 0 });
    cards.forEach(function (c) { live.observe(c); });

    // c) au toucher, le halo suit le doigt
    cards.forEach(function (c) {
      c.addEventListener('pointerdown', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });
    return true;
  }

  /* ---------- 3. EFFET « SURVOL » AU TOUCHER (Leadership, étapes de l'approche) ---------- */
  // Un doigt ne « survole » pas : on ajoute la classe m-tap au toucher pendant un instant,
  // pour que l'animation du survol (ordinateur) soit visible aussi sur téléphone.
  (function () {
    var SEL = '.leader__link,.leader__socials a,.leader__toggle,.leader__titles li,.leader__photo,.leader__logo,.process-step';
    var last = null;
    function off(t) { if (!t) return; clearTimeout(t._mt); t.classList.remove('m-tap'); }
    d.addEventListener('pointerdown', function (e) {
      var t = e.target.closest ? e.target.closest(SEL) : null;
      if (!t) return;
      if (last && last !== t) off(last);
      last = t; t.classList.add('m-tap');
      clearTimeout(t._mt);
      t._mt = setTimeout(function () { t.classList.remove('m-tap'); }, 650);
    }, { passive: true });
    // si le doigt commence à faire défiler la page, on annule l'effet
    d.addEventListener('pointercancel', function () { off(last); }, { passive: true });
  })();

  // les cartes sont créées par app.js : on réessaie brièvement si elles ne sont pas encore là
  var tries = 0;
  (function wait() {
    if (initImpact()) return;
    if (++tries < 10) setTimeout(wait, 300);
  })();
})();
