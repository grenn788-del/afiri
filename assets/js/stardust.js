/*
==========================================================================
 STARDUST.JS : poussière d'étoiles dorée interactive derrière les
 distinctions (sections « Prestige » et « Distinctions »).
 - Fond : poussière dorée qui scintille et fuit doucement devant la souris
 - Souris / doigt : une traînée d'étoiles brillantes naît sous le curseur
 - Pause automatique hors écran ; allégé sur mobile ; fixe si « réduire les animations »
 RÉGLAGES : objet CFG ci-dessous.
==========================================================================
*/
(function () {
  'use strict';
  var d = document, w = window, root = d.documentElement;
  var CFG = { ambient: 90, ambientMobile: 36, trail: 2, max: 220, gold: ['255,226,150', '245,201,111', '255,244,205', '232,176,64'] };
  var rm = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function Dust(section, host) {
    var cv = d.createElement('canvas'), ctx = cv.getContext('2d');
    cv.className = 'stardust'; cv.setAttribute('aria-hidden', 'true');
    host.appendChild(cv);
    var W = 0, H = 0, dpr = 1, amb = [], sp = [], mouse = { x: -999, y: -999, on: false, lx: 0, ly: 0 };
    var visible = false, raf = 0, glow = 0;
    var tier = function () { return root.getAttribute('data-motion') || 'minimal'; };
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    var col = function () { return CFG.gold[(Math.random() * CFG.gold.length) | 0]; };

    function resize() {
      var r = section.getBoundingClientRect();
      dpr = Math.min(w.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = tier() === 'minimal' ? CFG.ambientMobile : CFG.ambient;
      n = Math.round(n * Math.min(1, W * H / 1100000) + 14);
      amb.length = 0;
      for (var i = 0; i < n; i++) amb.push({
        x: Math.random() * W, y: Math.random() * H, hx: 0, hy: 0, vx: 0, vy: 0,
        r: rnd(.6, 2.2), a: rnd(.25, .9), ph: rnd(0, 6.28), sp: rnd(.6, 2), c: col(), z: rnd(.3, 1), star: Math.random() < .18
      });
      amb.forEach(function (p) { p.hx = p.x; p.hy = p.y; });
      if (!raf) draw(0);
    }

    function star(x, y, R, rot) {
      ctx.beginPath();
      for (var i = 0; i < 8; i++) {
        var a = rot + i * Math.PI / 4, rr = i % 2 ? R * .28 : R;
        ctx[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      ctx.closePath(); ctx.fill();
    }

    function spawn(x, y, dx, dy) {
      var n = tier() === 'minimal' ? 1 : CFG.trail;
      for (var i = 0; i < n && sp.length < CFG.max; i++) {
        var big = Math.random() < .45;
        sp.push({
          x: x + rnd(-8, 8), y: y + rnd(-8, 8), vx: dx * .05 + rnd(-.7, .7), vy: dy * .05 + rnd(-1, .3),
          life: 0, max: rnd(.8, 1.7), r: big ? rnd(4, 9) : rnd(1, 2.6), big: big, rot: rnd(0, 6), vr: rnd(-2, 2), c: col()
        });
      }
    }

    var last = 0;
    function draw(t) {
      var dt = Math.min(.05, (t - last) / 1000 || .016); last = t;
      ctx.clearRect(0, 0, W, H);
      // lueur douce qui suit le curseur
      glow += ((mouse.on ? 1 : 0) - glow) * .08;
      if (glow > .01) {
        var g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 190);
        g.addColorStop(0, 'rgba(255,214,120,' + (.2 * glow) + ')'); g.addColorStop(1, 'rgba(255,214,120,0)');
        ctx.fillStyle = g; ctx.fillRect(mouse.x - 190, mouse.y - 190, 380, 380);
      }
      ctx.globalCompositeOperation = 'lighter';
      var mx = mouse.on ? (mouse.x / W - .5) : 0, my = mouse.on ? (mouse.y / H - .5) : 0;
      for (var i = 0; i < amb.length; i++) {
        var p = amb[i];
        // décalage de parallaxe + fuite douce devant la souris
        var tx = p.hx - mx * 40 * p.z, ty = p.hy - my * 40 * p.z;
        if (mouse.on) {
          var ddx = p.x - mouse.x, ddy = p.y - mouse.y, d2 = ddx * ddx + ddy * ddy;
          if (d2 < 22500) { var f = (1 - Math.sqrt(d2) / 150) * 60 * dt * 6; var dd = Math.sqrt(d2) || 1; p.vx += ddx / dd * f; p.vy += ddy / dd * f; }
        }
        p.vx += (tx - p.x) * 1.6 * dt; p.vy += (ty - p.y) * 1.6 * dt;
        p.vx *= .92; p.vy *= .92; p.x += p.vx; p.y += p.vy;
        var tw = .5 + .5 * Math.sin(t / 1000 * p.sp + p.ph);
        var near = mouse.on ? Math.max(0, 1 - Math.hypot(p.x - mouse.x, p.y - mouse.y) / 220) : 0;
        var al = Math.min(1, p.a * (.35 + .65 * tw) + near * .5);
        ctx.fillStyle = 'rgba(' + p.c + ',' + al.toFixed(3) + ')';
        if (p.star) { star(p.x, p.y, p.r * (2.4 + tw * 1.6 + near * 2), t / 3000 * p.sp); }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + near * .8), 0, 6.283); ctx.fill(); }
      }
      for (var j = sp.length - 1; j >= 0; j--) {
        var s = sp[j]; s.life += dt;
        if (s.life >= s.max) { sp.splice(j, 1); continue; }
        var k = s.life / s.max;
        s.vy += 1.1 * dt; s.vx *= .985; s.vy *= .985; s.x += s.vx; s.y += s.vy; s.rot += s.vr * dt;
        var a = (1 - k) * (1 - k) * (.7 + .3 * Math.sin(s.life * 18));
        ctx.fillStyle = 'rgba(' + s.c + ',' + Math.max(0, a).toFixed(3) + ')';
        if (s.big) star(s.x, s.y, s.r * (1 - k * .5), s.rot);
        else { ctx.beginPath(); ctx.arc(s.x, s.y, s.r * (1 - k * .6), 0, 6.283); ctx.fill(); }
      }
      ctx.globalCompositeOperation = 'source-over';
      raf = (visible && !rm) ? w.requestAnimationFrame(draw) : 0;
    }

    function start() { if (!raf) { last = performance.now(); raf = w.requestAnimationFrame(draw); } }

    function move(e) {
      var r = section.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var dx = x - mouse.lx, dy = y - mouse.ly;
      mouse.lx = mouse.x = x; mouse.ly = mouse.y = y; mouse.on = true;
      if (rm || !visible) return;
      if (dx * dx + dy * dy > 16) spawn(x, y, dx, dy);
      start();
    }
    section.addEventListener('pointermove', move, { passive: true });
    section.addEventListener('pointerdown', function (e) { move(e); if (!rm) for (var i = 0; i < 10; i++) spawn(mouse.x, mouse.y, rnd(-60, 60), rnd(-60, 60)); }, { passive: true });
    section.addEventListener('pointerleave', function () { mouse.on = false; }, { passive: true });

    if (w.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible) { resize(); if (!rm) start(); } else if (raf) { w.cancelAnimationFrame(raf); raf = 0; }
      }, { rootMargin: '100px' }).observe(section);
    } else { visible = true; start(); }
    var tm; w.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(resize, 200); });
    resize();
  }

  [].slice.call(d.querySelectorAll('.awards-section')).forEach(function (s) {
    var host = s.querySelector('.awards-fx');
    if (host) { try { Dust(s, host); } catch (e) { if (w.console) console.warn('[stardust]', e); } }
  });
})();
