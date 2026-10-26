/*
==========================================================================
 COMETS.JS : comètes en arrière-plan des sections « Prestige » et « Distinctions ».
 Chaque comète a :
   - une tête lumineuse (noyau blanc + chevelure bleutée)
   - une queue ionique fine, presque droite, bleu pâle
   - une queue de poussière plus large, légèrement courbée, dorée
   - de petits débris qui se détachent et scintillent derrière elle
 Le rythme n'est pas régulier : intervalles aléatoires, tailles, vitesses et angles
 différents, parfois deux d'affilée. Une grande comète traverse quand on arrive
 dans la section, et le défilement rapide en réveille de petites.
 Pause automatique hors écran ; rien n'est animé en mode « réduire les animations ».
 RÉGLAGES : objet CFG ci-dessous.
==========================================================================
*/
(function () {
  'use strict';
  var d = document, w = window, root = d.documentElement;
  var CFG = { maxFull: 3, maxMedium: 2, gapMin: 1.4, gapMax: 5.8 };
  var rm = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm) return;
  var tier = function () { return root.getAttribute('data-motion') || 'minimal'; };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var ease = function (x) { return x * x * (3 - 2 * x); };

  function Sky(section, host) {
    var cv = d.createElement('canvas'), ctx = cv.getContext('2d');
    cv.className = 'comets'; cv.setAttribute('aria-hidden', 'true');
    host.appendChild(cv);
    var W = 1, H = 1, dpr = 1, list = [], deb = [], visible = false, raf = 0, last = 0, nextAt = 0, clock = 0;
    var lastScrollY = w.pageYOffset, lastScrollSpawn = 0, drewLast = false;

    function resize() {
      var r = section.getBoundingClientRect();
      dpr = Math.min(w.devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Nouvelle comète : on choisit par où elle passera, puis on recule pour trouver son départ
    function spawn(big) {
      var small = !big && Math.random() < .55;
      var scale = big ? rnd(1.35, 1.7) : small ? rnd(.55, .8) : rnd(.85, 1.2);
      var right = Math.random() < .68;                                  // la plupart descendent vers la gauche
      var deg = right ? rnd(118, 158) : rnd(22, 62);                    // angle de trajectoire (y vers le bas)
      var th = deg * Math.PI / 180, dx = Math.cos(th), dy = Math.sin(th);
      var tx = rnd(.12, .88) * W, ty = rnd(.1, .9) * H;
      var dist = (Math.hypot(W, H) * rnd(.55, .85)) * (big ? 1.1 : 1);
      var speed = (small ? rnd(190, 300) : rnd(280, 520)) * (big ? .9 : 1);
      list.push({
        x: tx - dx * dist * .5, y: ty - dy * dist * .5, dx: dx, dy: dy, v: speed, dist: dist, run: 0,
        r: (big ? 3.8 : small ? 1.6 : 2.5) * rnd(.9, 1.15), tail: rnd(190, 330) * scale * (big ? 1.2 : 1), scale: scale,
        side: Math.random() < .5 ? 1 : -1, curve: rnd(.1, .26), seed: Math.random() * 100,
        warm: Math.random() < .3, big: big
      });
    }

    function tailPoly(x0, y0, dx, dy, len, w0, bend, side, color0, color1, alpha) {
      // axe de la queue : courbe de Bézier quadratique partant de la tête vers l'arrière
      var ex = x0 - dx * len, ey = y0 - dy * len;
      var cx = x0 - dx * len * .5 - dy * side * bend * len, cy = y0 - dy * len * .5 + dx * side * bend * len;
      var L = [], R = [], n = 14, i, t, px, py, tx, ty, nl, nx, ny, wd;
      for (i = 0; i <= n; i++) {
        t = i / n;
        px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * ex;
        py = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * ey;
        tx = 2 * (1 - t) * (cx - x0) + 2 * t * (ex - cx); ty = 2 * (1 - t) * (cy - y0) + 2 * t * (ey - cy);
        nl = Math.hypot(tx, ty) || 1; nx = -ty / nl; ny = tx / nl;
        wd = w0 * Math.pow(1 - t, 1.25);
        L.push([px + nx * wd, py + ny * wd]); R.push([px - nx * wd, py - ny * wd]);
      }
      var g = ctx.createLinearGradient(x0, y0, ex, ey);
      g.addColorStop(0, 'rgba(' + color0 + ',' + alpha + ')');
      g.addColorStop(.35, 'rgba(' + color1 + ',' + (alpha * .5).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(' + color1 + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]);
      for (i = 1; i <= n; i++) ctx.lineTo(L[i][0], L[i][1]);
      for (i = n; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
      ctx.closePath(); ctx.fill();
    }

    function drawComet(c, a, t) {
      var flick = .92 + .08 * Math.sin(t * 9 + c.seed) + .04 * Math.sin(t * 23 + c.seed * 2);
      var A = a * flick, r = c.r;
      // queue de poussière : plus large, dorée, légèrement courbée
      tailPoly(c.x, c.y, c.dx, c.dy, c.tail * .8, r * 2.1, c.curve, c.side, c.warm ? '255,226,160' : '255,236,190', '245,201,111', (.42 * A).toFixed(3));
      // queue ionique : fine, droite, bleu pâle
      tailPoly(c.x, c.y, c.dx, c.dy, c.tail * 1.15, r * .95, .015, -c.side, '215,240,255', '123,200,248', (.82 * A).toFixed(3));
      // chevelure (halo) puis noyau
      var h = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r * 7);
      h.addColorStop(0, 'rgba(235,248,255,' + (.65 * A).toFixed(3) + ')');
      h.addColorStop(.3, 'rgba(160,210,255,' + (.28 * A).toFixed(3) + ')');
      h.addColorStop(1, 'rgba(120,190,255,0)');
      ctx.fillStyle = h; ctx.beginPath(); ctx.arc(c.x, c.y, r * 7, 0, 6.283); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, A * 1.1).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 6.283); ctx.fill();
    }

    function shed(c, a, dt) {
      // quelques grains se détachent de la tête et restent sur place en s'éteignant
      var n = (c.big ? 90 : 55) * dt * a, k;
      while (n > 0 && deb.length < 220) {
        if (Math.random() < Math.min(1, n)) {
          k = Math.random();
          deb.push({
            x: c.x - c.dx * rnd(2, 26) + rnd(-3, 3) * c.scale, y: c.y - c.dy * rnd(2, 26) + rnd(-3, 3) * c.scale,
            vx: -c.dx * rnd(2, 12) + rnd(-6, 6), vy: -c.dy * rnd(2, 12) + rnd(-6, 8),
            life: 0, max: rnd(.6, 1.5), r: k < .12 ? rnd(1.2, 1.9) : rnd(.45, 1),
            c: k < .5 ? '255,244,205' : k < .8 ? '255,226,150' : '190,228,255'
          });
        }
        n -= 1;
      }
    }

    function frame(ts) {
      var dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts; clock += dt;
      var tr = tier(), cap = tr === 'full' ? CFG.maxFull : tr === 'medium' ? CFG.maxMedium : 0;
      if (cap && clock >= nextAt) {
        if (list.length < cap) {
          spawn(false);
          if (Math.random() < .2 && list.length < cap) setTimeout(function () { if (visible) spawn(false); }, rnd(350, 1100));
        }
        nextAt = clock + rnd(CFG.gapMin, CFG.gapMax);
      }
      if (list.length || deb.length || drewLast) {
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        for (var i = list.length - 1; i >= 0; i--) {
          var c = list[i], step = c.v * dt;
          c.x += c.dx * step; c.y += c.dy * step; c.run += step;
          var p = c.run / c.dist;
          if (p >= 1) { list.splice(i, 1); continue; }
          var a = ease(Math.min(1, p / .12)) * (1 - ease(Math.max(0, (p - .68) / .32)));
          drawComet(c, a, clock);
          shed(c, a, dt);
        }
        for (var j = deb.length - 1; j >= 0; j--) {
          var s = deb[j]; s.life += dt;
          if (s.life >= s.max) { deb.splice(j, 1); continue; }
          s.vx *= .97; s.vy *= .97; s.x += s.vx * dt; s.y += s.vy * dt;
          var k = s.life / s.max, tw = .6 + .4 * Math.sin(s.life * 30 + j);
          ctx.fillStyle = 'rgba(' + s.c + ',' + (Math.pow(1 - k, 1.6) * .85 * tw).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        drewLast = list.length > 0 || deb.length > 0;
      }
      raf = visible ? w.requestAnimationFrame(frame) : 0;
    }

    function start() { if (!raf) { last = performance.now(); raf = w.requestAnimationFrame(frame); } }

    // Quand on descend vite, une petite comète est réveillée (au plus une toutes les ~1,4 s)
    w.addEventListener('scroll', function () {
      if (!visible || tier() === 'minimal') return;
      var y = w.pageYOffset, dy = Math.abs(y - lastScrollY); lastScrollY = y;
      if (dy > 55 && clock - lastScrollSpawn > 1.4 && list.length < 3 && Math.random() < .5) {
        lastScrollSpawn = clock; spawn(false);
      }
    }, { passive: true });

    if (w.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        var was = visible;
        visible = es[0].isIntersecting;
        if (visible) {
          resize(); start();
          // arrivée dans la section : une grande comète passe après un court instant
          if (!was && tier() !== 'minimal') {
            clock = Math.max(clock, nextAt - 4);
            setTimeout(function () { if (visible) spawn(true); }, 350);
          }
        } else if (raf) { w.cancelAnimationFrame(raf); raf = 0; list.length = 0; deb.length = 0; ctx.clearRect(0, 0, W, H); drewLast = false; }
      }, { rootMargin: '60px' }).observe(section);
    } else { visible = true; resize(); start(); }
    var tm; w.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(resize, 200); });
    resize();
  }

  [].slice.call(d.querySelectorAll('.awards-section')).forEach(function (s) {
    var host = s.querySelector('.awards-fx');
    if (host) { try { Sky(s, host); } catch (e) { if (w.console) console.warn('[comets]', e); } }
  });
})();
