/*
  LEGAL.JS : comportements des pages légales (aucune dépendance).
  Menu qui se détache au défilement, barre de progression, menu mobile,
  sélecteur de langue (EN / FR), sommaire actif et année du copyright.
*/
(function () {
  'use strict';
  var d = document, root = d.documentElement, win = window;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  // --- Année du copyright ---
  $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });

  // --- Défilement : menu verre (is-scrolled) et barre de progression ---
  var header = $('.site-header'), bar = $('[data-progress]'), ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    win.requestAnimationFrame(function () {
      ticking = false;
      var y = win.pageYOffset || root.scrollTop;
      if (header) header.classList.toggle('is-scrolled', y > 8);
      if (bar) {
        var h = root.scrollHeight - win.innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0).toFixed(4) + ')';
      }
    });
  };
  win.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Sélecteur de langue ---
  var picker = $('[data-lang-picker]');
  if (picker) {
    var lbtn = $('[data-lang-btn]', picker), lmenu = $('[data-lang-menu]', picker);
    var setLang = function (o) { lmenu.hidden = !o; picker.classList.toggle('is-open', o); lbtn.setAttribute('aria-expanded', String(o)); };
    lbtn.addEventListener('click', function (e) { e.stopPropagation(); setLang(lmenu.hidden); });
    d.addEventListener('click', function (e) { if (!picker.contains(e.target)) setLang(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lmenu.hidden) { setLang(false); lbtn.focus(); } });
  }

  // --- Menu mobile ---
  var menu = $('[data-mobile-menu]'), backdrop = $('[data-menu-backdrop]'), opener = $('[data-menu-open]'), back = null;
  var show = function (el) { el.hidden = false; void el.offsetWidth; el.classList.add('is-open'); };
  var hide = function (el) { el.classList.remove('is-open'); setTimeout(function () { if (!el.classList.contains('is-open')) el.hidden = true; }, 280); };
  var closeMenu = function () {
    if (!menu || !menu.classList.contains('is-open')) return;
    hide(menu); hide(backdrop);
    opener.setAttribute('aria-expanded', 'false');
    d.body.classList.remove('modal-is-open');
    if (back) back.focus();
  };
  if (opener && menu) {
    opener.addEventListener('click', function () {
      back = d.activeElement;
      show(menu); show(backdrop);
      opener.setAttribute('aria-expanded', 'true');
      d.body.classList.add('modal-is-open');
      $('[data-menu-close]', menu).focus();
    });
    $('[data-menu-close]', menu).addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    if (win.matchMedia) {
      var mq = win.matchMedia('(min-width: 901px)');
      var fn = function (e) { if (e.matches) closeMenu(); };
      if (mq.addEventListener) mq.addEventListener('change', fn); else if (mq.addListener) mq.addListener(fn);
    }
  }

  // --- Sommaire : met en évidence la section lue ---
  var links = $$('.legal-toc a'), map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in win && links.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var a = map[e.target.id];
        if (a && e.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var s = d.getElementById(id); if (s) io.observe(s); });
  }
})();
