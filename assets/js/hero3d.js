/*
==========================================================================
 HERO3D.JS : animation d'accueil en 3D faite de RECTANGLES
 --------------------------------------------------------------------------
 Trois icônes (boussole, bouclier, globe) sont construites avec de
 multiples petits rectangles (« barres ») qui arrivent de l'espace, se
 mettent en place, tournent doucement en 3D, puis se dispersent. À chaque
 icône correspond une vague colorée (voir app.js) et un texte (kicker, titre,
 phrase) pris dans SITE_CONFIG.heroStages.

 RÉGLAGES : tout se change dans config.js, bloc « hero3d » (+ interrupteur
 SHOW_HERO_3D). Les couleurs et tailles sont dans style.css, bloc
 « HERO 3D » (variables --h3d-...).

 Ordinateur large (data-motion="full") : vrai relief (rectangles épaissis en
 couches, rotation, légère réaction à la souris).
 Mobile, tablette, économie d'énergie : version 2D simple (rectangles à plat,
 simple fondu), sans perspective, donc très légère.

 PLAN DU FICHIER
   1. Lecture des réglages
   2. Dessin des icônes (liste de rectangles)  <- modifier ici pour changer une icône
   3. Construction d'une icône dans le DOM
   4. Boucle d'animation (icône -> vague -> icône suivante)
   5. Réaction à la souris
==========================================================================
*/
(function () {
  'use strict';
  var d = document, w = window;
  var C = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};
  var hero = d.querySelector('.hero'), waves = d.querySelector('[data-hero-waves]');
  if (!hero || (typeof SHOW_HERO_3D !== 'undefined' && !SHOW_HERO_3D)) return;

  /* ---------- 1. RÉGLAGES (valeurs par défaut, surchargées par config.hero3d) ---------- */
  var S = C.hero3d || {};
  var LAYERS = S.layers || 6;          // épaisseur : nombre de couches empilées par rectangle (3D uniquement)
  var BAR = S.barThickness || 4.4;     // épaisseur du trait, sur une grille de 100
  var START = S.start || 600, STEP = S.step || 3800, HOLD = S.hold || 2700, SHOW = S.show || 7500;
  var ZONES = ['light', 'blue', 'gold'];
  var STAGES = (C.heroStages && C.heroStages.length ? C.heroStages : [
    { zone: 'light', kicker: 'Strategy', title: 'Transformational Leadership', text: '' },
    { zone: 'blue', kicker: 'Advocacy', title: 'Human Rights & Advocacy', text: '' },
    { zone: 'gold', kicker: 'Impact', title: 'Women’s Empowerment', text: '' }
  ]).slice(0, 3);
  var mm = function (q) { return !!(w.matchMedia && w.matchMedia(q).matches); };
  // 3D seulement sur grand écran « full » (voir boot.js) ; sinon 2D simple
  var is3d = function () { return d.documentElement.getAttribute('data-motion') === 'full' && !mm('(max-width:900px)'); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- 2. DESSIN DES ICÔNES : chaque icône = liste de rectangles [x, y, longueur, angle] ---------- */
  // Un segment entre deux points, découpé en n rectangles (0.9 = petit espace visible entre rectangles)
  function seg(a, b, out, n) {
    var dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), k = Math.max(1, n || Math.round(len / 11));
    for (var i = 0; i < k; i++) {
      var t0 = i / k, t1 = (i + 1) / k;
      out.push([a[0] + dx * (t0 + t1) / 2, a[1] + dy * (t0 + t1) / 2, len / k * 0.92, Math.atan2(dy, dx) * 180 / Math.PI]);
    }
  }
  function poly(pts, closed, out) { for (var i = 0; i < pts.length - (closed ? 0 : 1); i++) seg(pts[i], pts[(i + 1) % pts.length], out); }
  function ring(cx, cy, rx, ry, n, out) {
    var pts = [];
    for (var i = 0; i < n; i++) pts.push([cx + rx * Math.cos(i / n * 6.2832), cy + ry * Math.sin(i / n * 6.2832)]);
    poly(pts, true, out);
  }
  var SHAPES = {
    // Boussole : deux anneaux, aiguille en losange, 4 repères
    light: function (o) {
      ring(50, 50, 40, 40, 30, o); ring(50, 50, 27, 27, 20, o);
      poly([[50, 22], [63, 50], [50, 78], [37, 50]], true, o);
      seg([50, 2], [50, 10], o, 1); seg([50, 90], [50, 98], o, 1); seg([2, 50], [10, 50], o, 1); seg([90, 50], [98, 50], o, 1);
    },
    // Bouclier + coche : deux contours de bouclier et une coche en rectangles
    blue: function (o) {
      var sh = [[50, 5], [14, 17], [14, 47], [24, 69], [50, 95], [76, 69], [86, 47], [86, 17]];
      poly(sh, true, o);
      poly(sh.map(function (p) { return [50 + (p[0] - 50) * 0.66, 48 + (p[1] - 48) * 0.66]; }), true, o);
      seg([36, 50], [46, 62], o, 2); seg([46, 62], [66, 36], o, 3);
    },
    // Globe : cercle, méridien, 3 parallèles
    gold: function (o) {
      ring(50, 50, 42, 42, 30, o); ring(50, 50, 17, 42, 24, o);
      seg([8, 50], [92, 50], o, 7); seg([14, 29], [86, 29], o, 6); seg([14, 71], [86, 71], o, 6);
    }
  };

  /* ---------- 3. CONSTRUCTION D'UNE ICÔNE DANS LE DOM ---------- */
  var stage = d.createElement('div');
  stage.className = 'h3d';
  stage.setAttribute('aria-hidden', 'true');
  stage.innerHTML = '<div class="h3d__fig"><div class="h3d__tilt"><div class="h3d__scene" data-h3d-scene></div></div></div>' +
    '<div class="h3d__txt" data-h3d-txt></div>';
  hero.insertBefore(stage, waves || hero.firstChild);
  var scene = stage.querySelector('[data-h3d-scene]'), txt = stage.querySelector('[data-h3d-txt]');
  var rnd = function (a) { return (Math.random() - 0.5) * 2 * a; };

  function build(i) {
    var s = STAGES[i], z = ZONES.indexOf(s.zone) > -1 ? s.zone : ZONES[i], flat = !is3d(), bars = [], html = '';
    SHAPES[z](bars);
    var layers = flat ? 1 : LAYERS;
    stage.className = 'h3d h3d--' + z + (flat ? ' h3d--flat' : '');
    bars.forEach(function (b, n) {
      var slices = '';
      for (var k = 0; k < layers; k++) slices += '<s style="--k:' + k + '"></s>';
      // --fx/--fy/--fz/--fr : position de départ éparpillée ; --dl : délai (les rectangles arrivent en cascade)
      html += '<i class="b" style="--x:' + b[0].toFixed(1) + ';--y:' + b[1].toFixed(1) + ';--l:' + b[2].toFixed(1) + ';--a:' + b[3].toFixed(1) +
        ';--fx:' + rnd(70).toFixed(0) + ';--fy:' + rnd(70).toFixed(0) + ';--fz:' + (flat ? 0 : 160 + rnd(120)).toFixed(0) + ';--fr:' + rnd(160).toFixed(0) +
        ';--dl:' + (n * 14 % 520) + 'ms">' + slices + '</i>';
    });
    stage.style.setProperty('--bar', BAR);
    scene.innerHTML = html;
    txt.innerHTML = '<span class="h3d__num">0' + (i + 1) + '<i></i>03</span><span class="h3d__kick">' + esc(s.kicker) + '</span>' +
      '<strong class="h3d__title">' + esc(s.title) + '</strong><span class="h3d__sub">' + esc(s.text) + '</span>';
    stage.style.setProperty('--h3d-txt-h', txt.offsetHeight + 'px');   // l'icône se place juste au-dessus du texte
    return z;
  }

  /* ---------- 4. BOUCLE : icône i entre, reste, sort ; sa vague apparaît ; puis la suivante ---------- */
  var rm = mm('(prefers-reduced-motion: reduce)');
  var seq = !!(waves && waves.firstChild && is3d());       // synchronisation avec les vagues (grand écran seulement)
  if (seq) waves.classList.add('hw-seq');
  var shapes = {}, wtexts = {};
  ZONES.forEach(function (z) { shapes[z] = waves && waves.querySelector('.hw-shape--' + z); wtexts[z] = waves && waves.querySelector('.hw-text--' + z); });
  var at = function (ms, fn) { setTimeout(fn, ms); };
  var onScreen = true;
  if ('IntersectionObserver' in w) new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; stage.classList.toggle('is-paused', !onScreen); }).observe(hero);

  function show(i) {
    var z = build(i);
    stage.classList.remove('is-out');
    void stage.offsetWidth;                                  // relance les transitions
    stage.classList.add('is-in');
    return z;
  }
  function hide(z) {
    stage.classList.remove('is-in'); stage.classList.add('is-out');
    if (seq) { if (shapes[z]) shapes[z].classList.add('is-on'); if (wtexts[z]) wtexts[z].classList.add('is-on'); }
  }
  function cycle() {
    if (seq) ZONES.forEach(function (z) { if (shapes[z]) shapes[z].classList.remove('is-on', 'is-off'); if (wtexts[z]) wtexts[z].classList.remove('is-on'); });
    STAGES.forEach(function (s, i) {
      var z;
      at(START + i * STEP, function () { z = show(i); });
      at(START + i * STEP + HOLD, function () { hide(z || ZONES[i]); });
    });
    var end = START + 2 * STEP + HOLD + (seq ? SHOW : 800);
    at(end, function () {
      if (seq) ZONES.forEach(function (z) { if (shapes[z]) { shapes[z].classList.remove('is-on'); shapes[z].classList.add('is-off'); } if (wtexts[z]) wtexts[z].classList.remove('is-on'); });
    });
    at(end + 1400, cycle);
  }
  if (rm) { show(0); } else { cycle(); }

  /* ---------- 5. SOURIS : l'icône suit légèrement le pointeur (3D uniquement) ---------- */
  if (!rm && mm('(hover: hover) and (pointer: fine)')) {
    var tilt = stage.querySelector('.h3d__tilt'), raf = 0, tx = 0, ty = 0;
    hero.addEventListener('pointermove', function (e) {
      if (!is3d()) return;
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; tilt.style.setProperty('--px', tx.toFixed(3)); tilt.style.setProperty('--py', ty.toFixed(3)); });
    }, { passive: true });
  }
})();
