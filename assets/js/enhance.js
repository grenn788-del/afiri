/*
  ENHANCE.JS : s'exécute après app.js (même principe : aucune dépendance).
  Blocs : transitions About · effets Direction · texture Galerie · rideaux de verre · slider Partenaires
  Chaque bloc est isolé : s'il échoue, le reste du site continue de fonctionner.
*/
(function () {
  'use strict';
  var d = document, win = window, root = d.documentElement;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var FR = /^fr/i.test(root.lang || '');
  var rmQ = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var tier = function () { return root.getAttribute('data-motion') || 'minimal'; };
  var safe = function (fn) { try { fn(); } catch (e) { if (win.console) console.warn('[enhance]', e); } };

  /* ---------- À propos : un effet de transition différent à chaque image ---------- */
  safe(function () {
    var bg = $('[data-about-slides]');
    if (!bg || !win.MutationObserver) return;
    var sweep = d.createElement('i');
    sweep.className = 'about-sweep'; sweep.setAttribute('aria-hidden', 'true');
    bg.appendChild(sweep);
    var FX = ['wipe', 'iris', 'diag', 'blur'], n = 0;
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        var el = m.target;
        if (!el.classList || !el.classList.contains('about-slide') || !el.classList.contains('is-active')) return;
        if (/(^|\s)is-active(\s|$)/.test(m.oldValue || '')) return;
        el.setAttribute('data-fx', FX[n++ % FX.length]);
        sweep.classList.remove('go'); void sweep.offsetWidth; sweep.classList.add('go');
      });
    }).observe(bg, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
  });

  /* ---------- Direction : calque d'effets continus dans chaque rectangle ---------- */
  safe(function () {
    $$('.leader__panel').forEach(function (p) {
      if ($('.lfx', p)) return;
      var f = d.createElement('div');
      f.className = 'lfx'; f.setAttribute('aria-hidden', 'true');
      var ring = function (extra) {
        return '<svg class="lfx-ring' + extra + '" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-linecap="round"><circle cx="100" cy="100" r="96" stroke-width="1"/><circle cx="100" cy="100" r="74" stroke-width="1.2" stroke-dasharray="2 9"/><circle cx="100" cy="100" r="52" stroke-width="1" stroke-dasharray="16 10"/><circle cx="100" cy="4" r="3.5" fill="currentColor" stroke="none"/></svg>';
      };
      var h = '<i class="lfx-beam"></i><i class="lfx-beam lfx-beam--2"></i><i class="lfx-orb lfx-orb--1"></i><i class="lfx-orb lfx-orb--2"></i><i class="lfx-orb lfx-orb--3"></i>' + ring('') + ring(' lfx-ring--2');
      var count = tier() === 'minimal' ? 5 : 9;
      for (var i = 0; i < count; i++) {
        h += '<i class="lfx-spark" style="--x:' + (6 + Math.random() * 88).toFixed(1) + '%;--s:' + (2.5 + Math.random() * 3.5).toFixed(1) + 'px;--t:' + (7 + Math.random() * 7).toFixed(1) + 's;--dl:-' + (Math.random() * 12).toFixed(1) + 's;--dx:' + ((Math.random() - .5) * 90).toFixed(0) + 'px"></i>';
      }
      f.innerHTML = h;
      p.insertBefore(f, p.firstChild);
    });
  });

  /* ---------- Awards : fond en blobs de couleur floutés (charte graphique) ---------- */
  safe(function () {
    $$('.awards-fx').forEach(function (fx) {
      if ($('.aw-blob', fx)) return;
      var h = '';
      for (var i = 1; i <= 5; i++) h += '<i class="aw-blob aw-blob--' + i + '"></i>';
      fx.insertAdjacentHTML('afterbegin', h);
      if ('IntersectionObserver' in win) new IntersectionObserver(function (e) { fx.classList.toggle('is-away', !e[0].isIntersecting); }, { rootMargin: '120px' }).observe(fx.parentNode);
    });
  });

  /* ---------- Galerie : calque de texture au survol ---------- */
  safe(function () {
    $$('.gallery-item').forEach(function (it) {
      if ($('.gallery-item__tex', it)) return;
      var t = d.createElement('span');
      t.className = 'gallery-item__tex'; t.setAttribute('aria-hidden', 'true');
      t.innerHTML = '<i class="gi-grain"></i><i class="gi-lines"></i><i class="gi-sheen"></i><i class="gi-frost"></i>';
      var img = $('img', it);
      if (img && img.nextSibling) it.insertBefore(t, img.nextSibling); else it.appendChild(t);
    });
  });

  /* ---------- Galerie sur écran tactile : la même animation que le survol ----------
     Pas de survol sur smartphone / tablette : la photo qui passe au milieu de l'écran (ou celle qu'on touche)
     reçoit la classe .is-hot, qui rejoue l'effet du survol (voir enhance.css). */
  safe(function () {
    if (!win.matchMedia || !win.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    var items = $$('.gallery-item');
    if (!items.length) return;
    var touched = null, tTimer = 0;
    if ('IntersectionObserver' in win) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.target !== touched) e.target.classList.toggle('is-hot', e.isIntersecting); });
      }, { rootMargin: '-38% 0px -38% 0px', threshold: 0 });
      items.forEach(function (it) { io.observe(it); });
    }
    items.forEach(function (it) {
      it.addEventListener('pointerdown', function () {
        clearTimeout(tTimer); touched = it; it.classList.add('is-hot');
        tTimer = setTimeout(function () { touched = null; }, 1600);
      }, { passive: true });
    });
  });

  /* ---------- Galerie : rideaux de verre interactifs (canvas 2D) ----------
     Une scène colorée (halos bleu ciel qui dérivent + un halo qui suit le curseur) est dessinée hors écran,
     puis découpée en lames verticales qui l'affichent inversée et déformée, comme un verre cannelé.
     Les lames proches du curseur s'élargissent : le rideau « s'écarte » sous le doigt ou la souris. */
  safe(function () {
    var sec = $('#gallery');
    if (!sec || $('.glass-curtains', sec) || !d.createElement('canvas').getContext) return;
    var cvs = d.createElement('canvas');
    cvs.className = 'glass-curtains'; cvs.setAttribute('aria-hidden', 'true');
    sec.insertBefore(cvs, sec.firstChild);
    var ctx = cvs.getContext('2d'), sc = d.createElement('canvas'), sx = sc.getContext('2d');
    if (!ctx || !sx) return;

    var W = 0, H = 0, N = 16, strips = [], raf = 0, visible = false, last = 0, t0 = performance.now();
    var mouse = { x: .5, y: .5, tx: .5, ty: .5, act: 0, tact: 0, seen: -1e9 };
    var ORBS = [
      { c: '123,200,248', r: .30, s: .13, ax: .34, ay: .26, ph: 0, a: .42 },
      { c: '123,200,248', r: .30, s: .09, ax: .38, ay: .30, ph: 2.1, a: .5 },
      { c: '255,255,255', r: .20, s: .17, ax: .30, ay: .34, ph: 4.0, a: .2 },
      { c: '8,52,102', r: .42, s: .07, ax: .40, ay: .22, ph: 1.2, a: .75 },
      { c: '123,200,248', r: .18, s: .15, ax: .42, ay: .30, ph: 3.3, a: .3 }
    ];

    function resize() {
      var r = sec.getBoundingClientRect(), min = tier() === 'minimal';
      var dpr = Math.min(win.devicePixelRatio || 1, min ? 1 : 1.5);
      W = Math.max(2, Math.round(r.width * dpr)); H = Math.max(2, Math.round(r.height * dpr));
      var cap = min ? 1.4e6 : 2.6e6;
      if (W * H > cap) { var k = Math.sqrt(cap / (W * H)); W = Math.round(W * k); H = Math.round(H * k); }
      cvs.width = sc.width = W; cvs.height = sc.height = H;
      N = Math.max(8, Math.min(26, Math.round(r.width / (min ? 46 : 60))));
      strips = [];
      for (var i = 0; i < N; i++) strips.push({ f: 0 });
      draw((performance.now() - t0) / 1000);
    }

    function scene(t) {
      var g = sx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#0b3a66'); g.addColorStop(.5, '#1767a5'); g.addColorStop(1, '#2a86d3');
      sx.globalCompositeOperation = 'source-over';
      sx.fillStyle = g; sx.fillRect(0, 0, W, H);
      var big = Math.max(W, H * 1.15);
      function orb(x, y, r, c, a) {
        var rg = sx.createRadialGradient(x, y, 0, x, y, r);
        rg.addColorStop(0, 'rgba(' + c + ',' + a + ')'); rg.addColorStop(1, 'rgba(' + c + ',0)');
        sx.fillStyle = rg; sx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      for (var i = 0; i < ORBS.length; i++) {
        var o = ORBS[i];
        orb(W * (.5 + o.ax * Math.sin(t * o.s + o.ph)), H * (.5 + o.ay * Math.cos(t * o.s * 1.3 + o.ph)), o.r * big, o.c, o.a);
      }
      // le halo or qui suit le curseur : c'est lui que le verre déforme le plus
      orb(mouse.x * W, mouse.y * H, .24 * big, '123,200,248', .38 + .2 * mouse.act);
      orb(mouse.x * W, mouse.y * H, .09 * big, '225,244,255', .25 * mouse.act);
    }

    function draw(t) {
      scene(t);
      ctx.clearRect(0, 0, W, H);
      var base = W / N, i, s, ws = [], sum = 0, sigma = W * .16;
      for (i = 0; i < N; i++) {
        s = strips[i];
        var dd = ((i + .5) * base - mouse.x * W) / sigma;
        s.f += (Math.exp(-dd * dd) * mouse.act - s.f) * .14;
        ws[i] = 1 + .95 * s.f; sum += ws[i];
      }
      var x = 0, k = W / sum;
      for (i = 0; i < N; i++) {
        s = strips[i];
        var w = ws[i] * k, cx = x + w / 2;
        var srcW = Math.min(W, w * (1.9 - .75 * s.f));
        var srcX = cx + Math.sin(t * .5 + i * .55) * w * .16 - srcW / 2;
        srcX = Math.max(0, Math.min(W - srcW, srcX));
        ctx.save();
        ctx.translate(cx, 0); ctx.scale(-1, 1);
        ctx.drawImage(sc, srcX, 0, srcW, H, -w / 2, 0, w, H);
        ctx.restore();
        var lg = ctx.createLinearGradient(x, 0, x + w, 0);
        lg.addColorStop(0, 'rgba(255,255,255,' + (.2 + .22 * s.f).toFixed(3) + ')');
        lg.addColorStop(.14, 'rgba(255,255,255,.05)');
        lg.addColorStop(.6, 'rgba(255,255,255,0)');
        lg.addColorStop(1, 'rgba(0,20,48,' + (.34 - .12 * s.f).toFixed(3) + ')');
        ctx.fillStyle = lg; ctx.fillRect(x, 0, w + 1, H);
        ctx.fillStyle = 'rgba(255,255,255,' + (.14 + .26 * s.f).toFixed(3) + ')';
        ctx.fillRect(Math.round(x), 0, Math.max(1, W / 900), H);
        x += w;
      }
      // reflet spéculaire sous le curseur + ombre du haut et du bas (plis du rideau)
      if (mouse.act > .02) {
        var r = .2 * Math.max(W, H), sp = ctx.createRadialGradient(mouse.x * W, mouse.y * H, 0, mouse.x * W, mouse.y * H, r);
        sp.addColorStop(0, 'rgba(255,255,255,' + (.16 * mouse.act).toFixed(3) + ')'); sp.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = sp; ctx.fillRect(0, 0, W, H);
      }
      var vg = ctx.createLinearGradient(0, 0, 0, H);
      vg.addColorStop(0, 'rgba(0,16,40,.38)'); vg.addColorStop(.22, 'rgba(0,16,40,.1)'); vg.addColorStop(.8, 'rgba(0,16,40,.12)'); vg.addColorStop(1, 'rgba(0,16,40,.4)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    }

    function frame(now) {
      raf = 0;
      if (!visible || d.hidden || rmQ.matches) return;
      raf = requestAnimationFrame(frame);
      if (tier() === 'minimal' && now - last < 33) return;
      last = now;
      var t = (now - t0) / 1000;
      // sans interaction depuis 2,5 s, un curseur virtuel se promène doucement
      if (now - mouse.seen > 2500) {
        mouse.tx = .5 + .4 * Math.sin(t * .22); mouse.ty = .5 + .3 * Math.cos(t * .17); mouse.tact = .55;
      }
      mouse.x += (mouse.tx - mouse.x) * .08; mouse.y += (mouse.ty - mouse.y) * .08; mouse.act += (mouse.tact - mouse.act) * .06;
      draw(t);
    }
    function start() { if (!raf && visible && !rmQ.matches) raf = requestAnimationFrame(frame); }

    function point(e) {
      var r = sec.getBoundingClientRect();
      mouse.tx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      mouse.ty = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
      mouse.tact = 1; mouse.seen = performance.now();
    }
    sec.addEventListener('pointermove', point, { passive: true });
    sec.addEventListener('pointerdown', point, { passive: true });
    sec.addEventListener('pointerleave', function () { mouse.tact = .55; mouse.seen = performance.now() - 1500; }, { passive: true });

    var rt;
    win.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
    d.addEventListener('visibilitychange', start);
    if (rmQ.addEventListener) rmQ.addEventListener('change', function () { draw((performance.now() - t0) / 1000); start(); });
    if ('IntersectionObserver' in win) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) start(); }, { rootMargin: '80px' }).observe(sec);
    } else { visible = true; }
    resize(); start();
  });

  /* ---------- Partenaires : slider glissable (souris, doigt, molette, clavier, flèches) ---------- */
  safe(function () {
    var strip = $('.logo-strip[data-partners]'), track = strip && $('.logo-track', strip);
    if (!track) return;
    var groups = $$('.logo-group', track);
    if (groups.length < 2) return;

    var wrap = d.createElement('div');
    wrap.className = 'logo-slider';
    strip.parentNode.insertBefore(wrap, strip); wrap.appendChild(strip);
    strip.classList.add('is-slider'); strip.tabIndex = 0;
    strip.setAttribute('role', 'region'); strip.setAttribute('aria-roledescription', 'carousel');
    strip.setAttribute('aria-label', FR ? 'Logos des partenaires : faites glisser ou utilisez les flèches' : 'Partner logos: drag or use the arrows');
    $$('img', strip).forEach(function (im) { im.draggable = false; });

    var chev = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' + p + '"/></svg>'; };
    var prev = d.createElement('button'), next = d.createElement('button');
    prev.type = next.type = 'button';
    prev.className = 'logo-nav logo-nav--prev'; next.className = 'logo-nav logo-nav--next';
    prev.setAttribute('aria-label', FR ? 'Partenaires précédents' : 'Previous partners');
    next.setAttribute('aria-label', FR ? 'Partenaires suivants' : 'Next partners');
    prev.innerHTML = chev('m15 5-7 7 7 7'); next.innerHTML = chev('m9 5 7 7-7 7');
    wrap.appendChild(prev); wrap.appendChild(next);

    var G = 0, step = 220, pos = 0, vel = 0, dragging = false, moved = 0, lastX = 0, lastT = 0;
    var hover = false, idleUntil = 0, tw = null, raf = 0, visible = false, lastF = 0;
    var SPEED = 38; // px/s, défilement automatique

    function measure() {
      G = groups[0].getBoundingClientRect().width || groups[0].offsetWidth || 1;
      var c = $$('.logo-card', groups[0]);
      if (c.length > 1) step = Math.abs(c[1].offsetLeft - c[0].offsetLeft) || step;
    }
    function apply() {
      pos = ((pos % G) + G) % G;
      track.style.transform = 'translate3d(' + (-pos).toFixed(2) + 'px,0,0)';
    }
    function ease(p) { return 1 - Math.pow(1 - p, 3); }
    function glide(delta) { tw = { delta: delta, t0: performance.now(), dur: 650, done: 0 }; vel = 0; idleUntil = performance.now() + 2500; start(); }

    function frame(now) {
      raf = 0;
      if ((!visible && !dragging && !tw) || d.hidden) return;
      raf = requestAnimationFrame(frame);
      var dt = Math.min(50, now - (lastF || now)) / 1000; lastF = now;
      if (tw) {
        var p = Math.min(1, (now - tw.t0) / tw.dur), e = ease(p);
        pos += (e - tw.done) * tw.delta; tw.done = e;
        if (p >= 1) tw = null;
      } else if (!dragging) {
        if (Math.abs(vel) > 8) { pos += vel * dt; vel *= Math.exp(-3.4 * dt); } else vel = 0;
        if (!hover && !rmQ.matches && now > idleUntil && !vel) pos += SPEED * dt;
      }
      apply();
    }
    function start() { if (!raf) { lastF = 0; raf = requestAnimationFrame(frame); } }

    strip.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; moved = 0; vel = 0; tw = null; lastX = e.clientX; lastT = performance.now();
      strip.classList.add('is-dragging');
      try { strip.setPointerCapture(e.pointerId); } catch (_) { }
      start();
    });
    strip.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var now = performance.now(), dx = e.clientX - lastX, dt = Math.max(.008, (now - lastT) / 1000);
      pos -= dx; moved += Math.abs(dx);
      vel = Math.max(-2600, Math.min(2600, vel * .6 + (-dx / dt) * .4));
      lastX = e.clientX; lastT = now; apply();
    });
    var release = function () {
      if (!dragging) return;
      dragging = false; strip.classList.remove('is-dragging');
      idleUntil = performance.now() + 2200;
    };
    strip.addEventListener('pointerup', release);
    strip.addEventListener('pointercancel', release);
    strip.addEventListener('lostpointercapture', release);
    strip.addEventListener('mouseenter', function () { hover = true; });
    strip.addEventListener('mouseleave', function () { hover = false; });
    strip.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); tw = null; pos += e.deltaX; idleUntil = performance.now() + 2200; apply(); start();
    }, { passive: false });
    strip.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); glide(step * 2); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); glide(-step * 2); }
    });
    prev.addEventListener('click', function () { glide(-step * 2); });
    next.addEventListener('click', function () { glide(step * 2); });

    var rt;
    win.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { measure(); apply(); }, 150); });
    win.addEventListener('load', function () { measure(); apply(); });
    d.addEventListener('visibilitychange', start);
    if ('IntersectionObserver' in win) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) start(); }, { rootMargin: '120px' }).observe(wrap);
    } else { visible = true; }
    measure(); apply(); start();
  });
})();
