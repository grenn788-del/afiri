/*
  SMOOTH-ANCHOR.JS : défilement animé vers les sections quand on touche un lien interne (#about, #contact...).
  Sur ordinateur, le navigateur le fait déjà (voir style.css). Ici on fait pareil sur mobile et tablette,
  où le site passe en animations réduites et où le lien « téléportait » jusqu'à la section.
  Désactivé uniquement si l'appareil demande « réduire les animations ».
*/
(function () {
  'use strict';
  var w = window, d = document, root = d.documentElement, raf = w.requestAnimationFrame;
  if (!raf) return;
  var reduceMq = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var running = false, stop = false;

  function reduced() { return !!(reduceMq && reduceMq.matches); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function offset() {
    var v = parseFloat(getComputedStyle(root).scrollPaddingTop);
    return isNaN(v) ? 80 : v;
  }

  // Fait défiler la page jusqu'à la position y (en px) avec une animation douce
  function smoothScrollTo(y, done) {
    var max = Math.max(0, root.scrollHeight - w.innerHeight);
    y = Math.min(Math.max(0, y), max);
    var from = w.pageYOffset, dist = y - from;
    if (reduced() || Math.abs(dist) < 2) { w.scrollTo(0, y); if (done) done(); return; }
    var dur = Math.min(1400, Math.max(650, 420 + Math.abs(dist) * 0.32));
    var prev = root.style.scrollBehavior, t0 = null;
    root.style.scrollBehavior = 'auto';
    running = true; stop = false;
    function end() { running = false; root.style.scrollBehavior = prev; if (done) done(); }
    function step(t) {
      if (stop) { end(); return; }
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      w.scrollTo(0, from + dist * ease(p));
      if (p < 1) raf(step); else end();
    }
    raf(step);
  }
  w.smoothScrollTo = smoothScrollTo;

  // L'utilisateur reprend la main : l'animation s'arrête
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
    w.addEventListener(ev, function () { if (running) stop = true; }, { passive: true });
  });

  // Sur ordinateur (animations complètes ou moyennes) le navigateur anime déjà : on ne touche à rien
  d.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (root.getAttribute('data-motion') !== 'minimal' || reduced()) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    var el = id ? d.getElementById(id) : null;
    if (id && !el) return;
    e.preventDefault();
    var y = el ? el.getBoundingClientRect().top + w.pageYOffset - offset() : 0;
    if (id === 'home') y = 0;
    // petit délai : laisse le menu mobile se refermer (et libérer le défilement) avant de partir
    setTimeout(function () {
      smoothScrollTo(y, function () {
        if (id && w.history && history.pushState && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
        if (el) { if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
      });
    }, 60);
  });
})();
