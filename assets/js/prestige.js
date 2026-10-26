/*
  PRESTIGE.JS : section dorée au-dessus des distinctions.
  Tout est généré à partir de la configuration :
    - config.awards   -> une pastille en orbite par distinction + texte qui tourne sur l'anneau + compteur
    - config.prestige -> mots des anneaux (ringWords) et textes (voir config.js)
  Ajouter une distinction dans config.awards suffit : la section se met à jour toute seule.
  Interactions : pointeur (inclinaison 3D, lueur, parallaxe), survol/clic d'une pastille,
  bouton qui descend vers les images des distinctions et les fait briller.
*/
(function () {
  var d = document, win = window, root = d.documentElement;
  var C = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};
  var sec = d.querySelector('[data-prestige]');
  if (!sec) return;
  var stage = sec.querySelector('[data-pr-stage]');
  var shapesBox = sec.querySelector('[data-pr-shapes]');
  var fx = sec.querySelector('[data-prestige-fx]');
  var cta = sec.querySelector('[data-pr-cta]');
  var P = C.prestige || {};
  var A = (C.awards || []).filter(function (a) { return a && a.title; });
  var tier = function () { return root.getAttribute('data-motion') || 'minimal'; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var NS = 'http://www.w3.org/2000/svg';
  var MAX_CHIPS = 8;
  var STAR = 'm12 2.8 2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17l-5.600 3.100 1.200-6.300L3 9.400l6.300-.800L12 2.800Z';

  // ---------- Étincelles dorées (même effet que la section distinctions) ----------
  if (fx && tier() !== 'minimal') {
    var nSp = tier() === 'full' ? 22 : 10;
    for (var si = 0; si < nSp; si++) {
      var sp = d.createElement('i');
      sp.className = 'aw-spark';
      sp.style.cssText = 'left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (30 + Math.random() * 70).toFixed(1) + '%;--s:' + (3 + Math.random() * 5).toFixed(1) + 'px;--t:' + (6 + Math.random() * 6).toFixed(1) + 's;--dl:-' + (Math.random() * 10).toFixed(1) + 's';
      fx.appendChild(sp);
    }
  }

  // ---------- Formes flottantes autour de la section ----------
  var SHAPES = {
    hex: '<path d="M20 3l15 8.500v17L20 37 5 28.500v-17Z"/>',
    dia: '<path d="M20 2 38 20 20 38 2 20Z"/>',
    tri: '<path d="M20 4 37 34H3Z"/>',
    ring: '<circle cx="20" cy="20" r="15"/><circle cx="20" cy="20" r="8" class="s2"/>',
    plus: '<path d="M20 6v28M6 20h28"/>',
    sq: '<rect x="7" y="7" width="26" height="26" rx="6"/>',
    dot: '<circle cx="20" cy="20" r="6" class="f"/>'
  };
  // type, x %, y %, taille px, remplie ?, profondeur parallaxe, durée, décalage
  var LAYOUT = [
    ['hex', 4, 10, 58, 0, 22, 11, 0], ['dia', 47, 6, 28, 1, 30, 8, -2], ['tri', 93, 12, 44, 0, 16, 12, -4],
    ['ring', 2, 56, 40, 0, 26, 10, -1], ['plus', 52, 93, 24, 0, 34, 7, -3], ['sq', 91, 72, 46, 1, 18, 13, -5],
    ['dot', 20, 90, 16, 1, 40, 6, -2], ['hex', 78, 91, 30, 1, 28, 9, -6], ['tri', 13, 32, 26, 1, 36, 8, -1],
    ['dia', 71, 5, 20, 0, 38, 7, -4], ['ring', 97, 44, 62, 0, 12, 14, -7], ['plus', 30, 4, 20, 0, 32, 9, -2]
  ];
  if (shapesBox) {
    shapesBox.innerHTML = LAYOUT.map(function (L) {
      return '<span class="pr-sh' + (L[4] ? ' is-fill' : '') + '" style="--x:' + L[1] + '%;--y:' + L[2] + '%;--s:' + L[3] + 'px;--dp:' + L[5] + ';--t:' + L[6] + 's;--dl:' + L[7] + 's"><svg viewBox="0 0 40 40" fill="none" focusable="false">' + SHAPES[L[0]] + '</svg></span>';
    }).join('');
  }

  // ---------- Ruban doré en bas de section : ondule, se vrille et glisse vers la droite puis revient ----------
  var ribbonBox = sec.querySelector('[data-pr-ribbon]');
  var ribbonSvg = null;
  var ribbonPoly = function (base, amp, wl, thick, phase, tw) {
    var W = 1600, step = 40, top = [], bot = [], x, y, t;
    for (x = 0; x <= W; x += step) {
      y = base + amp * Math.sin(x / wl + phase);
      t = thick * (0.28 + 0.72 * Math.abs(Math.sin(x / tw + phase * 0.8)));
      top.push((x).toFixed(0) + ' ' + (y - t / 2).toFixed(1));
      bot.push((x).toFixed(0) + ' ' + (y + t / 2).toFixed(1));
    }
    return top.concat(bot.reverse()).join(' ');
  };
  var buildRibbon = function () {
    if (!ribbonBox) return;
    var anim = tier() !== 'minimal';
    var mk = function (id, base, amp, wl, thick, tw, ph, dur, fill, op) {
      var p0 = ribbonPoly(base, amp, wl, thick, ph, tw), p1 = ribbonPoly(base, amp, wl, thick, ph + Math.PI, tw);
      return '<polygon points="' + p0 + '" fill="' + fill + '" fill-opacity="' + op + '">' +
        (anim ? '<animate attributeName="points" dur="' + dur + 's" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1" values="' + p0 + ';' + p1 + ';' + p0 + '"/>' : '') + '</polygon>';
    };
    ribbonBox.innerHTML = '<svg viewBox="0 0 1600 160" preserveAspectRatio="none" focusable="false" aria-hidden="true">' +
      '<defs><linearGradient id="prrib" x1="0" x2="1" y1="0" y2="0" spreadMethod="reflect"><stop offset="0" stop-color="#8a5a14"/><stop offset=".22" stop-color="#f5c96f"/><stop offset=".42" stop-color="#fff6d6"/><stop offset=".6" stop-color="#f5c96f"/><stop offset=".82" stop-color="#b9791f"/><stop offset="1" stop-color="#f5c96f"/>' +
      (anim ? '<animateTransform attributeName="gradientTransform" type="translate" values="-0.6 0;0.6 0;-0.6 0" dur="9s" repeatCount="indefinite"/>' : '') + '</linearGradient></defs>' +
      mk('b', 92, 26, 360, 34, 170, 1.8, 11, 'url(#prrib)', 0.5) +
      mk('a', 84, 30, 300, 62, 140, 0, 8, 'url(#prrib)', 0.95) + '</svg>';
    ribbonSvg = ribbonBox.firstChild;
  };

  // ---------- Scène : anneaux, formes dorées en orbite (une par distinction), médaillon ----------
  if (!stage) return;
  var pt = function (r, deg) { var a = deg * Math.PI / 180; return [(r * Math.cos(a)).toFixed(2), (r * Math.sin(a)).toFixed(2)]; };
  // formes des badges d'orbite (viewBox 64) : hexagone, losange, écu, rosace
  var rosette = (function () {
    var pts = [], i, r, a;
    for (i = 0; i < 24; i++) { r = i % 2 ? 23 : 29; a = i * Math.PI / 12; pts.push((32 + r * Math.cos(a)).toFixed(1) + ' ' + (32 + r * Math.sin(a)).toFixed(1)); }
    return '<polygon points="' + pts.join(' ') + '"/>';
  })();
  var BADGES = [
    '<path d="M32 4l24 14v28L32 60 8 46V18Z"/>',
    '<path d="M32 3 61 32 32 61 3 32Z"/>',
    '<path d="M32 4 54 12v18c0 14-9 25-22 30C19 55 10 44 10 30V12Z"/>',
    rosette
  ];

  // ---------- Anneaux : formes variées (étoiles, boucliers, paix, plaques...) en couleurs différentes ----------
  // Tirage pseudo-aléatoire à graine fixe : l'agencement est irrégulier (fait « à la main ») mais identique à chaque affichage
  var seeded = function (seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  var starPath = function (R, r, n) {
    var pts = [], i, a, rr;
    for (i = 0; i < n * 2; i++) { a = -Math.PI / 2 + i * Math.PI / n; rr = i % 2 ? r : R; pts.push((rr * Math.cos(a)).toFixed(2) + ' ' + (rr * Math.sin(a)).toFixed(2)); }
    return 'M' + pts.join('L') + 'Z';
  };
  var STK = { gold: '#f5c96f', white: '#ffffff', sky: '#8fd3ff', blue: '#5aa8ee' };
  var COLS = {
    gold: ['#fff3c4', '#f5c96f', '#b9791f'],
    white: ['#ffffff', '#eaf3ff', '#aac4e2'],
    sky: ['#e6f7ff', '#7bc8f8', '#2f86c9'],
    blue: ['#b4dbff', '#4a9be6', '#1f5fa8']
  };
  var shapeMarkup = function (kind, col, f) {
    var fill = 'fill="url(#' + f + ')"', stk = STK[col];
    switch (kind) {
      case 'star': return '<path class="prx-st" ' + fill + ' d="' + starPath(10.5, 4.4, 5) + '"/>';
      case 'spark': return '<path ' + fill + ' d="M0-11.500C1.300-4.500 4.500-1.300 11.500 0 4.500 1.300 1.300 4.500 0 11.500-1.300 4.500-4.500 1.300-11.500 0-4.500-1.300-1.300-4.500 0-11.500Z"/>';
      case 'rect': return '<rect class="prx-st" ' + fill + ' x="-9.500" y="-6" width="19" height="12" rx="1.600"/><rect x="-6.600" y="-3.200" width="13.200" height="6.400" rx=".8" fill="none" stroke="rgba(30,40,70,.28)" stroke-width=".8"/>';
      case 'shield': return '<path class="prx-st" ' + fill + ' d="M0-11 8.500-8v7.500C8.500 5 4.500 9 0 11-4.500 9-8.500 5-8.500-.5V-8Z"/><path transform="translate(0 -.5)" fill="rgba(255,255,255,.62)" d="' + starPath(4.800, 2.100, 5) + '"/>';
      case 'peace': return '<circle class="prx-ln" r="8.600" stroke="' + stk + '"/><path class="prx-ln" stroke="' + stk + '" d="M0-8.600V8.600M0 0-6.100 6.100M0 0 6.100 6.100"/>';
      case 'dia': return '<path class="prx-st" ' + fill + ' d="M0-10.500 7.200 0 0 10.500-7.200 0Z"/>';
      case 'hex': return '<path class="prx-st" ' + fill + ' d="M0-10 8.700-5v10L0 10-8.700 5v-10Z"/>';
      case 'leaf': return '<path ' + fill + ' d="M0-11C7.500-5.500 7.500 5.500 0 11-7.500 5.500-7.500-5.500 0-11Z"/><path d="M0-8V9" stroke="rgba(20,50,80,.35)" stroke-width=".9" fill="none"/>';
      case 'ring': return '<circle class="prx-ln" r="6" stroke="' + stk + '"/>';
      default: return '<circle ' + fill + ' r="2.800"/>';
    }
  };
  // rayon, nombre, formes, couleurs, taille, durée du tour (s), sens, degrés de rotation par défilement, trait de guidage
  var RINGS = [
    { r: 236, n: 22, kinds: ['star', 'dot', 'rect', 'spark', 'dot', 'leaf'], cols: ['white', 'sky', 'white', 'gold'], sz: 0.85, dur: 150, rev: 1, k: -70, g: 'w' },
    { r: 198, n: 13, kinds: ['shield', 'peace', 'star', 'leaf', 'shield', 'peace'], cols: ['gold', 'sky', 'white', 'gold'], sz: 1.3, dur: 100, rev: 0, k: 110, g: 's' },
    { r: 162, n: 17, kinds: ['rect', 'dia', 'hex', 'spark', 'ring', 'star'], cols: ['blue', 'white', 'gold', 'sky'], sz: 1.0, dur: 74, rev: 1, k: -160, g: 'g' },
    { r: 130, n: 25, kinds: ['dot', 'spark', 'dot', 'star', 'ring'], cols: ['sky', 'white', 'sky', 'gold'], sz: 0.7, dur: 52, rev: 0, k: 220, g: 'd' }
  ];
  var tailArcs = function (r, cls, lens) {
    var C = 2 * Math.PI * r;
    return lens.map(function (L) { return '<circle class="prx-tail ' + cls + '" r="' + r + '" stroke-dasharray="' + L + ' ' + Math.ceil(C) + '" stroke-dashoffset="' + (-(C - L)).toFixed(1) + '"/>'; }).join('');
  };

  var uid = 0;
  var build = function () {
    uid++;
    var rnd = seeded(20241), i, j, defs = '', body = '';
    Object.keys(COLS).forEach(function (name) {
      var c = COLS[name];
      defs += '<linearGradient id="prc' + uid + name + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".5" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient>';
    });
    RINGS.forEach(function (R, ri) {
      var step = 360 / R.n, items = '';
      for (i = 0; i < R.n; i++) {
        var ang = i * step + (rnd() - .5) * step * .6, rad = R.r + (rnd() - .5) * 7;
        var kind = R.kinds[Math.floor(rnd() * R.kinds.length)], col = R.cols[Math.floor(rnd() * R.cols.length)];
        var x = rad * Math.cos(ang * Math.PI / 180), y = rad * Math.sin(ang * Math.PI / 180);
        var sc = R.sz * (0.8 + rnd() * 0.5);
        var upright = kind === 'shield' || kind === 'rect' || kind === 'leaf';
        var rot = upright ? ang + 90 + (rnd() - .5) * 26 : kind === 'peace' ? (rnd() - .5) * 14 : rnd() * 70 - 35;
        var dl = (ri * 0.14 + i * 0.028 + rnd() * 0.18).toFixed(2);
        var tw = rnd() < .38 ? ' tw' : '';
        items += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"><g class="prx-it" style="--ox:' + (-x * .88).toFixed(0) + ';--oy:' + (-y * .88).toFixed(0) + ';--ir:' + Math.round((rnd() - .5) * 420) + 'deg;--dl:' + dl + 's">' +
          '<g class="prx-tw' + tw + '" style="--t:' + (3 + rnd() * 3.5).toFixed(1) + 's;--d:-' + (rnd() * 5).toFixed(1) + 's"><g transform="rotate(' + rot.toFixed(0) + ') scale(' + sc.toFixed(2) + ')">' +
          shapeMarkup(kind, col, 'prc' + uid + col) + '</g></g></g></g>';
      }
      var guide = '<circle class="prx-g prx-g--' + R.g + '" r="' + R.r + '"/>';
      body += '<g class="pr-r" style="animation-duration:' + R.dur + 's;animation-direction:' + (R.rev ? 'reverse' : 'normal') + '"><g class="prx-sc" style="--k:' + R.k + '">' + guide + items + '</g></g>';
    });
    // deux petites comètes sur les anneaux extérieurs (tête + queue qui s'effile)
    var lead = '<g class="pr-r pr-r--lead"><g>' + tailArcs(270, '', [250, 185, 130, 85, 50, 24]) + '<circle cx="270" cy="0" r="12" class="prx-bead-halo"/><circle cx="270" cy="0" r="4.400" class="prx-bead"/></g></g>' +
      '<g class="pr-r pr-r--lead2"><g transform="rotate(200) scale(1 -1)">' + tailArcs(252, 'prx-tail--g', [150, 100, 62, 30]) + '<circle cx="252" cy="0" r="9" class="prx-bead-halo prx-bead-halo--g"/><circle cx="252" cy="0" r="3.200" class="prx-bead prx-bead--g"/></g></g>';

    var svg = '<svg class="pr-rings" viewBox="-300 -300 600 600" fill="none" focusable="false" aria-hidden="true"><defs>' + defs + '</defs>' + body + lead + '</svg>';

    // une forme dorée par distinction en orbite (8 au maximum), libellé court dessous
    var shown = A.slice(0, MAX_CHIPS), n = shown.length;
    var chips = shown.map(function (a, k) {
      var ang = -90 + (360 / n) * k;
      var gid = 'prbd' + uid + '_' + k;
      return '<button type="button" class="pr-chip" data-i="' + k + '" style="--a:' + ang.toFixed(1) + 'deg;--k:' + k + '" aria-label="' + esc(a.title) + '"><span class="pr-chip__spin"><span class="pr-chip__in">' +
        '<svg class="pr-badge" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><radialGradient id="' + gid + '" cx="34%" cy="26%" r="85%"><stop offset="0" stop-color="#fff6d6"/><stop offset=".45" stop-color="#f5c96f"/><stop offset="1" stop-color="#b9791f"/></radialGradient></defs>' +
        '<g class="pr-badge__shape" fill="url(#' + gid + ')" stroke="#fff3c4" stroke-width="2.200" stroke-linejoin="round">' + BADGES[k % BADGES.length] + '</g>' +
        '<g class="pr-badge__inner" transform="translate(32 32) scale(.74) translate(-32 -32)" fill="none" stroke="#8a5a14" stroke-opacity=".5" stroke-width="1.400" stroke-linejoin="round">' + BADGES[k % BADGES.length] + '</g>' +
        '<g transform="translate(20 20)" fill="#6d430c"><path d="' + STAR + '"/></g></svg>' +
        '<span class="pr-chip__txt">' + (a.tag ? '<small>' + esc(a.tag) + '</small>' : '') + '<b>' + esc(a.short || a.title) + '</b></span></span></span></button>';
    }).join('');

    var core = '<div class="pr-core" data-pr-core><span class="pr-core__pulse"></span><span class="pr-core__pulse pr-core__pulse--2"></span><span class="pr-core__shine"></span>' +
      '<svg class="pr-core__star" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + STAR + '"/></svg>' +
      '<strong data-pr-count aria-live="off">' + (A.length < 10 ? '0' : '') + A.length + '</strong>' +
      '<small data-pr-label data-default="' + esc(P.countLabel || '') + '">' + esc(P.countLabel || '') + '</small></div>';

    stage.innerHTML = '<div class="pr-tilt"><div class="pr-glow"></div>' + svg + '<div class="pr-orbit">' + chips + '</div>' + core + '</div>';
    bindChips();
    counted = false; if (live) countUp();
    arm();
  };

  // ---------- Pastilles : survol (libellé du médaillon) et clic (descend vers l'image) ----------
  var flashTimer;
  var flash = function (cards, stagger) {
    cards.forEach(function (c, i) {
      if (!c) return;
      c.style.setProperty('--fd', (0.55 + i * (stagger || 0.14)).toFixed(2) + 's');
      c.classList.remove('is-flash'); void c.offsetWidth; c.classList.add('is-flash');
    });
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { cards.forEach(function (c) { if (c) c.classList.remove('is-flash'); }); }, 3600);
  };
  var awardCards = function () { return Array.prototype.slice.call(d.querySelectorAll('[data-awards-grid] .award-document')); };
  var scrollTo = function (el, block) {
    if (!el) return;
    el.scrollIntoView({ behavior: tier() === 'minimal' ? 'auto' : 'smooth', block: block || 'center' });
  };
  var goAll = function () {
    var cards = awardCards(), grid = d.querySelector('[data-awards-grid]') || d.getElementById('awards');
    scrollTo(grid, 'center');
    flash(cards, 0.14);
  };
  var goOne = function (i) {
    var cards = awardCards(), c = cards[i];
    scrollTo(c || d.getElementById('awards'), 'center');
    flash(c ? [c] : [], 0);
  };
  var setLabel = function (txt) {
    var lab = stage.querySelector('[data-pr-label]');
    if (!lab || lab.getAttribute('data-txt') === txt) return;
    lab.setAttribute('data-txt', txt);
    lab.classList.add('is-swap');
    setTimeout(function () { lab.textContent = txt; lab.classList.remove('is-swap'); }, 130);
  };
  function bindChips() {
    Array.prototype.forEach.call(stage.querySelectorAll('.pr-chip'), function (b) {
      var i = +b.getAttribute('data-i');
      var on = function () { stage.classList.add('is-hot'); setLabel(A[i].short || A[i].title); };
      var off = function () { stage.classList.remove('is-hot'); var l = stage.querySelector('[data-pr-label]'); setLabel(l ? l.getAttribute('data-default') : ''); };
      b.addEventListener('pointerenter', on); b.addEventListener('focus', on);
      b.addEventListener('pointerleave', off); b.addEventListener('blur', off);
      b.addEventListener('click', function () { goOne(i); });
    });
  }
  if (cta) {
    cta.addEventListener('click', function (e) { e.preventDefault(); goAll(); });
    // effet « aimant » : le bouton suit légèrement le pointeur
    if (tier() === 'full' && win.matchMedia && win.matchMedia('(hover:hover)').matches) {
      cta.addEventListener('pointermove', function (e) {
        var r = cta.getBoundingClientRect();
        cta.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1) + 'px');
        cta.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * 0.22).toFixed(1) + 'px');
      });
      cta.addEventListener('pointerleave', function () { cta.style.setProperty('--bx', '0px'); cta.style.setProperty('--by', '0px'); });
    }
  }

  // ---------- Compteur animé ----------
  var counted = false, live = false;
  var countUp = function () {
    var el = stage.querySelector('[data-pr-count]');
    if (!el || counted) return;
    counted = true;
    var n = A.length, pad = function (v) { return (v < 10 ? '0' : '') + v; };
    if (tier() === 'minimal' || lite() || n === 0) { el.textContent = pad(n); return; }
    var t0 = null, dur = 1400;
    var step = function (ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pad(Math.round(n * e));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '00';
    requestAnimationFrame(step);
  };

  // ---------- Arrivée dans la section + rotation des anneaux liée au défilement ----------
  // À l'arrivée : les formes jaillissent du médaillon une à une, puis les pastilles se posent.
  // Pendant le défilement : chaque anneau tourne à son rythme, avec un peu d'inertie (il se pose doucement quand on s'arrête).
  var sc = 0, scT = 0, vel = 0, scRaf = 0;
  // Les anneaux bougent aussi sur mobile ; seul « réduire les animations » du système les fige
  var reduced = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var animated = function () { return !reduced; };
  // Mobile : version allégée = uniquement la rotation simple des anneaux (pas d'arrivée en gerbe, pas de rotation liée au défilement)
  var liteMQ = win.matchMedia && win.matchMedia('(max-width: 767px)');
  var lite = function () { return !!(liteMQ && liteMQ.matches); };
  if (!reduced) sec.classList.add('pr-anim');
  var progress = function () {
    var r = sec.getBoundingClientRect(), vh = win.innerHeight || 800;
    return -((r.top + r.height / 2) - vh / 2) / vh;
  };
  var scTick = function () {
    scRaf = 0;
    var diff = scT - sc;
    sc += diff * 0.07;
    vel += (Math.min(1, Math.abs(diff) * 5) - vel) * 0.12;
    stage.style.setProperty('--sc', sc.toFixed(4));
    stage.style.setProperty('--v', vel.toFixed(3));
    if (Math.abs(diff) > 0.0004 || vel > 0.01) scRaf = requestAnimationFrame(scTick);
  };
  var onScroll = function () {
    if (!live || !animated() || lite()) return;
    scT = progress();
    if (!scRaf) scRaf = requestAnimationFrame(scTick);
  };
  win.addEventListener('scroll', onScroll, { passive: true });
  win.addEventListener('resize', onScroll);
  function arm() {
    if (!animated() || lite()) { stage.classList.remove('is-pre', 'is-in'); stage.style.removeProperty('--sc'); return; }
    stage.classList.toggle('is-in', live);
    stage.classList.toggle('is-pre', !live);
  }
  var arrive = function () {
    if (!animated() || lite()) return;
    scT = progress();
    sc = scT - 0.9;                         // les anneaux partent en tournoyant puis se calent
    stage.classList.remove('is-pre'); void stage.offsetWidth; stage.classList.add('is-in');
    if (!scRaf) scRaf = requestAnimationFrame(scTick);
  };

  // Animations actives uniquement quand la section est visible (économie de batterie)
  if ('IntersectionObserver' in win) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var was = live;
        live = e.isIntersecting;
        sec.classList.toggle('is-live', live);
        if (ribbonSvg && ribbonSvg.pauseAnimations) { if (live) ribbonSvg.unpauseAnimations(); else ribbonSvg.pauseAnimations(); }
        if (live) { countUp(); if (!was) arrive(); }
        else if (animated() && !lite()) { stage.classList.remove('is-in'); stage.classList.add('is-pre'); }
      });
    }, { threshold: 0.15 }).observe(sec);
  } else { live = true; sec.classList.add('is-live'); }

  // ---------- Pointeur : inclinaison 3D, lueur et parallaxe des formes (grand écran uniquement) ----------
  var raf = 0, px = 0, py = 0;
  var paint = function () { raf = 0; sec.style.setProperty('--tx', px.toFixed(3)); sec.style.setProperty('--ty', py.toFixed(3)); };
  sec.addEventListener('pointermove', function (e) {
    if (tier() !== 'full' || e.pointerType === 'touch') return;
    var r = sec.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width * 2 - 1;
    py = (e.clientY - r.top) / r.height * 2 - 1;
    if (!raf) raf = requestAnimationFrame(paint);
  });
  sec.addEventListener('pointerleave', function () { px = 0; py = 0; if (!raf) raf = requestAnimationFrame(paint); });

  build();
  buildRibbon();
  var mq = win.matchMedia && win.matchMedia('(max-width: 700px)');
  if (mq) { var rb = function () { build(); }; if (mq.addEventListener) mq.addEventListener('change', rb); else if (mq.addListener) mq.addListener(rb); }
})();
