/*
==========================================================================
 VALUES.JS : page intérieure des valeurs (Intégrité, Compréhension du monde,
 Impact durable).
 --------------------------------------------------------------------------
 Un clic sur un rectangle de la section « À propos » ouvre une page plein écran :
   - un seul cercle de la couleur du rectangle (bleu, marron, vert) part du petit
     cercle en bas à droite du rectangle, grandit et couvre tout l'écran (2D)
   - l'icône dorée, le titre et le texte (repris automatiquement du rectangle)
   - précédent / suivant (boutons, points, flèches du clavier, balayage tactile)
   - fermer (croix, Échap ou bouton « retour ») : le cercle se rétracte vers le
     rectangle de la valeur affichée

 RÉGLAGES
   - Textes des rectangles : directement dans fr.html / index.html (balises .value-card)
   - Couleur du cercle de chaque valeur : tableau COLORS ci-dessous
   - Durée / courbe du cercle : values.css, règles .vx__disc
==========================================================================
*/
(function () {
  'use strict';
  var d = document, w = window, root = d.documentElement;
  var FR = /^fr/i.test(root.lang || '');
  var L = FR
    ? { close: 'Fermer', prev: 'Valeur précédente', next: 'Valeur suivante', eyebrow: 'Nos valeurs', value: 'Valeur', more: 'Découvrir', go: 'Aller à la valeur' }
    : { close: 'Close', prev: 'Previous value', next: 'Next value', eyebrow: 'Our values', value: 'Value', more: 'Discover', go: 'Go to value' };
  // Couleur du cercle pour chaque valeur (même ordre que les rectangles : marron, bleu, vert)
  var COLORS = ['#7f4616', '#2077bc', '#36841b'];
  var SVGNS = 'http://www.w3.org/2000/svg';

  var cards = [].slice.call(d.querySelectorAll('.value-card'));
  if (!cards.length) return;

  var items = cards.map(function (c, i) {
    var svg = c.querySelector('.value-card__icon svg');
    var h = c.querySelector('h3'), p = c.querySelector('p');
    return { card: c, svg: svg, title: h ? h.textContent : '', text: p ? p.textContent : '', color: COLORS[i % COLORS.length] };
  });
  var N = items.length, cur = 0, built = false, isOpen = false, busy = false;
  var ov, slides = [], dots = [], countEl, lastFocus, closeBtn, prevBtn, nextBtn, pushed = false;

  function el(tag, cls, html) {
    var e = d.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function reduced() { return w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ---------- Point de départ du cercle : le petit cercle en bas à droite du rectangle ---------- */
  function origin(card) {
    var r = card.getBoundingClientRect();
    try {
      var cs = w.getComputedStyle(card, '::after');
      var cw = parseFloat(cs.width), ch = parseFloat(cs.height), cr = parseFloat(cs.right), cb = parseFloat(cs.bottom);
      if (isFinite(cw) && isFinite(ch) && isFinite(cr) && isFinite(cb)) {
        return { x: r.right - cr - cw / 2, y: r.bottom - cb - ch / 2 };
      }
    } catch (e) {}
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  // Place le cercle : centre = origine, diamètre = juste assez pour couvrir tout l'écran
  function setDisc(o) {
    var W = Math.max(w.innerWidth, root.clientWidth), H = Math.max(w.innerHeight, root.clientHeight) + 80;
    var R = Math.max(Math.sqrt(o.x * o.x + o.y * o.y), Math.sqrt((W - o.x) * (W - o.x) + o.y * o.y),
                     Math.sqrt(o.x * o.x + (H - o.y) * (H - o.y)), Math.sqrt((W - o.x) * (W - o.x) + (H - o.y) * (H - o.y))) + 6;
    ov.style.setProperty('--ox', Math.round(o.x) + 'px');
    ov.style.setProperty('--oy', Math.round(o.y) + 'px');
    ov.style.setProperty('--d', Math.ceil(R * 2) + 'px');
  }

  /* ---------- Rectangles : rendus cliquables ---------- */
  items.forEach(function (it, i) {
    var c = it.card;
    c.setAttribute('role', 'button');
    c.setAttribute('tabindex', '0');
    c.setAttribute('aria-haspopup', 'dialog');
    c.classList.add('is-clickable');
    var more = el('span', 'value-card__more',
      L.more + '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>');
    more.setAttribute('aria-hidden', 'true');
    c.appendChild(more);
    c.addEventListener('click', function () { open(i, c); });
    c.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i, c); }
    });
  });

  /* ---------- Dégradé or partagé ---------- */
  function defs() {
    var s = d.createElementNS(SVGNS, 'svg');
    s.setAttribute('class', 'vx__defs'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
    s.innerHTML =
      '<defs><linearGradient id="vxGold" gradientUnits="userSpaceOnUse" x1="6" y1="4" x2="58" y2="60">' +
      '<stop offset="0" stop-color="#fff6cf"/><stop offset=".25" stop-color="#f7cf6a"/>' +
      '<stop offset=".55" stop-color="#d9a032"/><stop offset=".78" stop-color="#ffe49a"/>' +
      '<stop offset="1" stop-color="#c58a1f"/></linearGradient></defs>';
    return s;
  }

  /* ---------- Icône : le dessin de la carte, en or, à plat ---------- */
  function layer(src, stroke, sw, cls) {
    var s = src.cloneNode(true);
    s.removeAttribute('class'); s.removeAttribute('width'); s.removeAttribute('height');
    s.setAttribute('class', 'vx__layer' + (cls ? ' ' + cls : '')); s.setAttribute('aria-hidden', 'true');
    [].slice.call(s.querySelectorAll('*')).forEach(function (n) { n.removeAttribute('class'); });
    s.style.stroke = stroke;
    s.style.strokeWidth = String(sw);
    s.style.color = stroke;
    [].slice.call(s.querySelectorAll('[fill="currentColor"]')).forEach(function (n) { n.setAttribute('fill', stroke); });
    return s;
  }
  function buildIcon(src) {
    var spin = el('div', 'vx__spin');
    spin.appendChild(layer(src, 'url(#vxGold) #e0a93a', 3.6));
    spin.appendChild(layer(src, 'rgba(255,255,255,.5)', 0.7, 'vx__ridge'));
    return spin;
  }

  /* ---------- Construction de la page ---------- */
  function build() {
    if (built) return;
    built = true;
    ov = el('div', 'vx');
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', L.eyebrow);
    ov.appendChild(el('div', 'vx__disc'));
    ov.appendChild(defs());

    var top = el('div', 'vx__top');
    top.appendChild(el('span', 'vx__eyebrow', L.eyebrow));
    countEl = el('span', 'vx__count', '');
    top.appendChild(countEl);
    ov.appendChild(top);

    closeBtn = el('button', 'vx__close',
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>');
    closeBtn.type = 'button'; closeBtn.setAttribute('aria-label', L.close);
    closeBtn.addEventListener('click', function () { close(); });
    ov.appendChild(closeBtn);

    var track = el('div', 'vx__track');
    items.forEach(function (it, i) {
      var s = el('section', 'vx__slide');
      s.setAttribute('aria-hidden', 'true');
      var stage = el('div', 'vx__stage');
      stage.appendChild(el('div', 'vx__glow'));
      stage.appendChild(buildIcon(it.svg));
      s.appendChild(stage);

      var copy = el('div', 'vx__copy');
      copy.appendChild(el('p', 'vx__kicker', L.value + ' ' + pad(i + 1)));
      var h = el('h2', 'vx__title'); h.textContent = it.title; copy.appendChild(h);
      copy.appendChild(el('i', 'vx__rule'));
      var p = el('p', 'vx__text'); p.textContent = it.text; copy.appendChild(p);
      s.appendChild(copy);
      track.appendChild(s);
      slides.push(s);
    });
    ov.appendChild(track);

    var chev = function (path) { return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"/></svg>'; };
    prevBtn = el('button', 'vx__nav vx__nav--prev', chev('M15 5l-7 7 7 7'));
    nextBtn = el('button', 'vx__nav vx__nav--next', chev('M9 5l7 7-7 7'));
    prevBtn.type = nextBtn.type = 'button';
    prevBtn.setAttribute('aria-label', L.prev); nextBtn.setAttribute('aria-label', L.next);
    prevBtn.addEventListener('click', function () { go(-1); });
    nextBtn.addEventListener('click', function () { go(1); });
    ov.appendChild(prevBtn); ov.appendChild(nextBtn);

    var dotsEl = el('div', 'vx__dots');
    items.forEach(function (it, i) {
      var b = el('button', 'vx__dot');
      b.type = 'button';
      b.setAttribute('aria-label', L.go + ' ' + (i + 1) + ' : ' + it.title);
      b.addEventListener('click', function () { if (i !== cur) go(i - cur, i); });
      dotsEl.appendChild(b); dots.push(b);
    });
    ov.appendChild(dotsEl);

    // Balayage tactile
    var sx = null, sy = 0;
    ov.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    ov.addEventListener('touchend', function (e) {
      if (sx == null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1);
    }, { passive: true });

    d.body.appendChild(ov);
  }

  /* ---------- Préparation anticipée : la page est construite avant le clic ---------- */
  function warm() { if (!built) { try { build(); layout(0, true); } catch (e) { built = false; } } }
  items.forEach(function (it) {
    ['pointerenter', 'touchstart', 'focusin'].forEach(function (ev) { it.card.addEventListener(ev, warm, { once: true, passive: true }); });
  });
  (function schedule() {
    var go2 = function () { if ('requestIdleCallback' in w) w.requestIdleCallback(warm, { timeout: 2500 }); else w.setTimeout(warm, 1200); };
    if (d.readyState === 'complete') w.setTimeout(go2, 400); else w.addEventListener('load', function () { w.setTimeout(go2, 400); }, { once: true });
  })();

  /* ---------- Positions des diapositives (-1 = à gauche, 0 = active, 1 = à droite) ---------- */
  function offset(i, a) {
    var o = ((i - a) % N + N) % N;
    return o === 0 ? 0 : (o <= N / 2 ? 1 : -1);
  }
  function layout(a, instant) {
    slides.forEach(function (s, i) {
      var o = offset(i, a), prev = s._o;
      // Une diapositive qui traverse de l'autre côté se téléporte sans animation (elle est invisible)
      var jump = prev != null && Math.abs(o - prev) > 1;
      if (jump || instant) s.style.transition = 'none';
      s.setAttribute('data-o', String(o));
      s.setAttribute('aria-hidden', o === 0 ? 'false' : 'true');
      s._o = o;
      if (jump || instant) { void s.offsetWidth; s.style.transition = ''; }
    });
    ov.style.setProperty('--vc', items[a].color);
    dots.forEach(function (b, i) { b.classList.toggle('is-on', i === a); if (i === a) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    countEl.textContent = pad(a + 1) + ' / ' + pad(N);
  }

  function go(step, target) {
    if (!isOpen || busy) return;
    var next = target != null ? target : ((cur + step) % N + N) % N;
    if (next === cur) return;
    var dir = step >= 0 ? 1 : -1;
    // Si on saute de plusieurs valeurs, on place la cible du bon côté avant d'animer
    if (target != null && Math.abs(target - cur) > 1) {
      var s = slides[next];
      s.style.transition = 'none';
      s.setAttribute('data-o', String(dir));
      s._o = dir;
      void s.offsetWidth;
      s.style.transition = '';
    }
    cur = next;
    busy = true;
    layout(cur);
    w.setTimeout(function () { busy = false; }, reduced() ? 60 : 600);
  }

  /* ---------- Ouverture / fermeture : un seul cercle, en 2D ---------- */
  function open(i, from) {
    if (isOpen) return;
    try { build(); } catch (err) { built = false; if (w.console) console.error('values.js', err); return; }
    cur = i; isOpen = true; busy = true;
    lastFocus = from || d.activeElement;
    layout(cur, true);
    setDisc(origin(items[i].card));
    items[i].card.classList.add('vx-origin');
    ov.classList.remove('is-closing', 'is-in');
    ov.classList.add('is-open');
    void ov.offsetWidth;                                   // fixe l'état de départ (cercle de taille 0)
    w.requestAnimationFrame(function () { ov.classList.add('is-in'); });   // le cercle grandit
    var sb = w.innerWidth - root.clientWidth;
    if (sb > 0) root.style.paddingRight = sb + 'px';
    root.classList.add('vx-lock');
    try { history.pushState({ vx: 1 }, '', location.href); pushed = true; } catch (e) { pushed = false; }
    w.setTimeout(function () { busy = false; try { closeBtn.focus({ preventScroll: true }); } catch (e) {} }, reduced() ? 60 : 600);
  }

  function close(fromPop) {
    if (!isOpen) return;
    isOpen = false; busy = true;
    // le cercle se rétracte vers le petit cercle du rectangle de la valeur affichée
    var cc = items[cur].card;
    try {
      var rr = cc.getBoundingClientRect();
      if (rr.bottom < 0 || rr.top > w.innerHeight) cc.scrollIntoView({ block: 'center' });
    } catch (e) {}
    setDisc(origin(cc));
    items.forEach(function (it, k) { it.card.classList.toggle('vx-origin', k === cur); });
    lastFocus = cc;
    ov.classList.remove('is-in');
    ov.classList.add('is-closing');
    if (pushed && !fromPop) { try { history.back(); } catch (e) {} }
    pushed = false;
    w.setTimeout(function () {
      ov.classList.remove('is-open', 'is-closing');
      root.classList.remove('vx-lock');
      root.style.paddingRight = '';
      items.forEach(function (it) { it.card.classList.remove('vx-origin'); });
      busy = false;
      if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
    }, reduced() ? 60 : 800);
  }

  w.addEventListener('popstate', function () { if (isOpen) close(true); });

  d.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'Tab') {
      var f = [closeBtn, prevBtn, nextBtn].concat(dots);
      var idx = f.indexOf(d.activeElement);
      e.preventDefault();
      f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
})();
