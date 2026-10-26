/*
  BOOT.JS : s'exécute avant l'affichage. Il choisit le niveau d'animation et
  l'écrit dans <html data-motion="full|medium|minimal"> :
    full    = grand écran, animations complètes
    medium  = tablette, animations allégées
    minimal = mobile, économie de données ou « réduire les animations »
  Il précharge aussi l'image d'accueil (version mobile si l'écran est étroit).
*/
(function () {
  var w = window, d = document, r = d.documentElement, n = navigator;
  function mm(q) { return !!(w.matchMedia && w.matchMedia(q).matches); }
  // Choisit le niveau d'animation selon l'écran, le tactile et les capacités de l'appareil
  function pick() {
    if (mm('(prefers-reduced-motion: reduce)')) return 'minimal';
    var x = w.innerWidth, coarse = mm('(pointer: coarse)');
    var t = x < 768 ? 'minimal' : (x < 1100 || (coarse && x < 1400)) ? 'medium' : 'full';
    var k = n.connection || {};
    if (k.saveData || (n.deviceMemory && n.deviceMemory <= 2) || (n.hardwareConcurrency && n.hardwareConcurrency <= 2)) {
      t = t === 'full' ? 'medium' : 'minimal';
    }
    return t;
  }
  // Applique le niveau choisi sur la balise <html>
  function apply() {
    var t = pick();
    if (r.getAttribute('data-motion') !== t) r.setAttribute('data-motion', t);
  }
  r.className += ' js';
  apply();
  var timer;
  w.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(apply, 150); });
  if (w.matchMedia) {
    var rm = w.matchMedia('(prefers-reduced-motion: reduce)');
    if (rm.addEventListener) rm.addEventListener('change', apply); else if (rm.addListener) rm.addListener(apply);
  }
  // Précharge l'image d'accueil pour un affichage plus rapide
  var C = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : null;
  if (C && C.images && C.images.hero) {
    var h = C.images.hero, s = (w.innerWidth < 768 && h.mobile) || h.desktop;
    if (s) {
      var l = d.createElement('link');
      l.rel = 'preload'; l.as = 'image'; l.href = s;
      d.head.appendChild(l);
    }
  }
})();
