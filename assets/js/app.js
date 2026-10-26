/*
  APP.JS : logique du site Afiri (aucune dépendance externe).
  Les textes, images, liens et langues se modifient dans config.js.
  Chaque bloc ci-dessous est précédé d'un commentaire.
*/
(function () {
  'use strict';
  var d = document, root = d.documentElement, body = d.body, win = window;
  var C = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};
  var SHOW = typeof SHOW_URGENT_SECTION === 'undefined' ? true : !!SHOW_URGENT_SECTION;
  // --- Petits outils : sélecteurs, échappement HTML, lecture d'un chemin de config, détection du mode d'animation ---
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var get = function (o, p) { return p.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); };
  var tier = function () { return root.getAttribute('data-motion') || 'minimal'; };
  var small = function () { return !!(win.matchMedia && win.matchMedia('(max-width: 767px)').matches); };
  var LANGS = C.languages || [], TR = C.translate || {}, PAGE_LANG = TR.pageLanguage || 'en';
  // --- Traduction Google : cookie « googtrans » (format /langue-source/langue-cible), lu et validé ---
  var setCookie = function (v) {
    var base = 'googtrans=' + v + '; path=/', exp = v ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 GMT', host = location.hostname;
    d.cookie = base + exp;
    if (host && host !== 'localhost' && !/^[\d.]+$/.test(host)) { d.cookie = base + '; domain=' + host + exp; d.cookie = base + '; domain=.' + host.replace(/^www\./, '') + exp; }
  };
  var ON_PROXY = /\.translate\.goog$/i.test(location.hostname);
  var CUR_LANG = PAGE_LANG;
  if (TR.enabled !== false) {
    if (ON_PROXY) {
      // Page servie par le proxy de Google : la langue est dans l'adresse (_x_tr_tl)
      var pm = location.search.match(/[?&]_x_tr_tl=([^&]+)/);
      if (pm) CUR_LANG = decodeURIComponent(pm[1]);
    } else {
      var ck = d.cookie.match(/(?:^|;\s*)googtrans=\/([^\/;]*)\/([^;]+)/);
      if (ck) {
        var tgt = decodeURIComponent(ck[2]);
        var okLang = LANGS.some(function (L) { return L.code === tgt && !L.native; });
        if (!okLang || tgt === PAGE_LANG) { setCookie(''); }
        else {
          CUR_LANG = tgt;
          // Le cookie est partagé entre fr.html et index.html : on le réaligne sur la langue de CETTE page
          if (ck[1] !== PAGE_LANG) setCookie('/' + PAGE_LANG + '/' + tgt);
        }
      }
    }
  }
  var isTr = CUR_LANG !== PAGE_LANG;
  if (isTr) root.classList.add('is-translated');
  // Textes de l'interface générés par le script (config.ui les remplace : voir config.fr.js)
  var UI = { image: 'Image', learnMore: 'Learn more', socialProfiles: 'Social profiles', readBio: 'Read full biography', hideBio: 'Hide full biography', openDocument: 'Open document:', openItem: 'Open:', openImage: 'Open image:', prev: 'Previous', next: 'Next', close: 'Close', impactArea: 'Impact area' };
  Object.keys(C.ui || {}).forEach(function (k) { UI[k] = C.ui[k]; });
  var onMq = function (q, fn) { var m = win.matchMedia(q); if (m.addEventListener) m.addEventListener('change', fn); else if (m.addListener) m.addListener(fn); return m; };

  // --- Icônes SVG (impact, réseaux sociaux) ---
  var stroke = function (p) { return '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + '</svg>'; };
  var fill = function (p) { return '<svg class="social-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">' + p + '</svg>'; };
  var ICONS = {
    education: stroke('<path d="M12 6.5C9 4.6 5.5 4 2 5v14c3.5-1 7-.4 10 1.5M12 6.5C15 4.6 18.5 4 22 5v14c-3.5-1-7-.4-10 1.5V6.5Z"></path>'),
    rights: stroke('<path d="M12 3v18M7 21h10M4 7h16M7 7l-4 8h8L7 7Zm10 0-4 8h8l-4-8Z"></path><circle cx="12" cy="5" r="2"></circle>'),
    women: stroke('<circle cx="9" cy="7" r="3"></circle><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-4-5.65"></path>'),
    leadership: stroke('<circle cx="12" cy="12" r="9"></circle><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"></path>'),
    humanitarian: stroke('<path d="M20.8 5.8a5.2 5.2 0 0 0-7.4 0L12 7.2l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 22l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z"></path>'),
    community: stroke('<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a17 17 0 0 1 0 18 17 17 0 0 1 0-18Z"></path>')
  };
  var SOCIAL = {
    linkedin: fill('<path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.79-1.52 2.99 0 3.58 1.97 3.58 4.53v5.24Z"></path>'),
    facebook: fill('<path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z"></path>'),
    instagram: fill('<g fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4.1"></circle></g><circle cx="17.6" cy="6.5" r="1.1"></circle>'),
    x: fill('<path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.43L5.55 22H2.42l7.52-8.6L1.8 2h6.41l4.42 6.75L18.9 2Zm-1.1 18h1.73L7.27 3.87H5.42L17.8 20Z"></path>')
  };

  // --- Remplissage des textes et liens depuis config.js (attributs data-text, data-href, data-img) ---
  $$('[data-text]').forEach(function (n) { var v = get(C, n.getAttribute('data-text')); if (v != null) n.textContent = v; });
  $$('[data-href]').forEach(function (n) {
    var v = get(C, n.getAttribute('data-href'));
    if (!v) return;
    var p = n.getAttribute('data-prefix') || '';
    if (p === 'tel:') v = String(v).replace(/[^\d+]/g, '');
    n.setAttribute('href', p + v);
  });
  var setImg = function (n) {
    var v = get(C.images || {}, n.getAttribute('data-img'));
    if (v && typeof v === 'object') v = (small() && v.mobile) || v.desktop;
    if (v && n.getAttribute('src') !== v) n.setAttribute('src', v);
  };
  $$('[data-img]').forEach(setImg);
  $$('[data-socials]').forEach(function (box) {
    box.innerHTML = (C.socials || []).map(function (s) {
      return '<a href="' + esc(s.url) + '" target="_blank" rel="noreferrer noopener" aria-label="' + esc(s.name) + '">' + (SOCIAL[s.icon] || '') + '</a>';
    }).join('');
  });
  // Liens légaux du pied de page : toujours les pages locales de la langue courante
  var isFr = (root.lang || 'en').slice(0, 2) === 'fr';
  $$('[data-href="site.legal.privacy"]').forEach(function (n) { n.setAttribute('href', isFr ? 'privacy-fr.html' : 'privacy.html'); });
  $$('[data-href="site.legal.terms"]').forEach(function (n) { n.setAttribute('href', isFr ? 'terms-fr.html' : 'terms.html'); });
  $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });

  // --- Section « Latest news » : création des cartes depuis config.urgent ---
  var fmtDate = function (v) {
    var t = new Date(v);
    if (isNaN(t.getTime())) return esc(v);
    try { return t.toLocaleDateString(root.lang || 'en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }); } catch (e) { return esc(v); }
  };
  var urgentCard = function (p) {
    var s = ['urgent', 'ongoing', 'news'].indexOf(p.status) > -1 ? p.status : 'ongoing';
    var pr = typeof p.progress === 'number' ? Math.max(0, Math.min(100, p.progress)) : null;
    return '<article class="urgent-card" data-status="' + s + '" data-reveal>' +
      '<div class="urgent-card__media"><img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.title) + '" loading="lazy" decoding="async"><span class="urgent-badge">' + esc(p.label || s) + '</span></div>' +
      '<div class="urgent-card__body">' +
      '<div class="urgent-meta">' + (p.date ? '<span>' + fmtDate(p.date) + '</span>' : '') + (p.location ? '<span>' + esc(p.location) + '</span>' : '') + '</div>' +
      '<h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p>' +
      (pr === null ? '' : '<div class="urgent-progress"><div class="urgent-progress__top"><span>' + esc(p.progressLabel || '') + '</span><span>' + pr + '%</span></div><div class="urgent-progress__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pr + '"><span style="--w:' + pr + '%"></span></div></div>') +
      (p.link ? '<a class="urgent-link" href="' + esc(p.link) + '">' + esc(p.linkLabel || UI.learnMore) + ' <span aria-hidden="true">→</span></a>' : '') +
      '</div></article>';
  };
  var urgent = $('[data-urgent]'), projects = (C.urgent && C.urgent.projects) || [];
  if (urgent) {
    if (SHOW && projects.length) {
      var ug = $('[data-urgent-grid]', urgent);
      ug.setAttribute('data-count', Math.min(projects.length, 3));
      ug.innerHTML = projects.map(urgentCard).join('');
      urgent.hidden = false;
      $$('[data-nav-urgent]').forEach(function (a) { a.hidden = false; });
    } else {
      urgent.parentNode.removeChild(urgent);
      $$('[data-nav-urgent]').forEach(function (a) { a.parentNode.removeChild(a); });
    }
  }

  // --- Bandeau jaune + carte « Featured news » (activables dans config.featured) ---
  var feat = C.featured || {}, featBanner = $('[data-featured-banner]'), featSection = $('[data-featured-section]');
  if (feat.enabled === false) {
    [featBanner, featSection].forEach(function (n) { if (n && n.parentNode) n.parentNode.removeChild(n); });
    featBanner = featSection = null;
  } else if (featSection) {
    var fp = $('[data-featured-points]', featSection), pts = (feat.detail && feat.detail.points) || [];
    if (fp && pts.length) {
      fp.innerHTML = pts.map(function (p, i) {
        return '<li class="news-point"><span>' + (i < 9 ? '0' : '') + (i + 1) + '</span><div><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p></div></li>';
      }).join('');
    }
    var card = $('[data-news-card]', featSection);
    // Image de fond de la carte marron (config.featured.background) : vide = simple dégradé marron
    var nbg = $('[data-news-bg]', featSection), bgc = feat.background || {};
    if (card && nbg && bgc.image) {
      nbg.style.backgroundImage = 'url(\'' + esc(bgc.image) + '\')';
      nbg.style.backgroundPosition = bgc.position || 'center';
      card.style.setProperty('--news-veil', bgc.overlay != null ? bgc.overlay : 0.7);
      card.classList.add('has-bg');
    } else if (nbg && nbg.parentNode) { nbg.parentNode.removeChild(nbg); }
    // Ouvrir / fermer les détails (points 01 à 03) : bouton + clic sur le bandeau du haut
    var more = $('[data-news-more]', featSection), tg = $('[data-news-toggle]', featSection), tgl = $('[data-news-toggle-label]', featSection), fd = feat.detail || {};
    if (more && tg) {
      var nClose = $('[data-news-close]', featSection);
      if (nClose && fd.lessLabel) nClose.setAttribute('aria-label', fd.lessLabel);
      var setMore = function (o, focus) {
        if (o === more.classList.contains('is-open')) return;
        if (o) {
          // Le rectangle s'agrandit depuis le centre du rond (cercle 2D) jusqu'à couvrir toute la carte
          var cr = card.getBoundingClientRect(), vis = $('.news-card__visual', card), vr = vis ? vis.getBoundingClientRect() : cr;
          var ox = vr.left + vr.width / 2 - cr.left - 12, oy = vr.top + vr.height / 2 - cr.top - 12;
          var hh = Math.max(cr.height, 700), R = Math.hypot(Math.max(ox, cr.width - ox), Math.max(oy, hh - oy)) + 60;
          more.style.setProperty('--ox', ox.toFixed(0) + 'px');
          more.style.setProperty('--oy', oy.toFixed(0) + 'px');
          more.style.setProperty('--or', R.toFixed(0) + 'px');
        }
        more.classList.toggle('is-open', o); card.classList.toggle('is-expanded', o); tg.setAttribute('aria-expanded', String(o));
        if (o) more.removeAttribute('inert'); else more.setAttribute('inert', '');
        if (focus) { var f = o ? nClose : tg; if (f) f.focus({ preventScroll: true }); }
      };
      if (fd.moreLabel && tgl) tgl.textContent = fd.moreLabel;
      tg.addEventListener('click', function () { setMore(true, true); });
      if (nClose) nClose.addEventListener('click', function () { setMore(false, true); });
      d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && more.classList.contains('is-open')) setMore(false, true); });
      if (featBanner) featBanner.addEventListener('click', function () { setMore(true); });
      if (fd.openByDefault) setMore(true);
    }
    // Flèches du bandeau du haut : banner.arrows = false les retire
    if (featBanner && feat.banner && feat.banner.arrows === false) featBanner.classList.add('no-arrows');
    if (card && win.matchMedia && win.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    }
  }

  // --- À propos : diaporama d'images de fond en fondu ---
  var aboutBg = $('[data-about-slides]');
  if (aboutBg) {
    var srcs = (C.images && C.images.aboutSlides) || (C.images && C.images.about ? [C.images.about] : []);
    if (srcs.length) {
      aboutBg.innerHTML = srcs.map(function (s, i) { return '<div class="about-slide' + (i ? '' : ' is-active') + '" style="background-image:url(\'' + esc(s) + '\')"></div>'; }).join('');
      var slides = $$('.about-slide', aboutBg), dots = $('[data-about-dots]'), ai = 0, aTimer = null, aboutEl = $('#about');
      var goSlide = function (n) {
        slides[ai].classList.remove('is-active'); ai = (n + slides.length) % slides.length; slides[ai].classList.add('is-active');
        if (dots) $$('button', dots).forEach(function (b, k) { b.setAttribute('aria-current', k === ai ? 'true' : 'false'); });
      };
      if (slides.length > 1 && dots) {
        dots.innerHTML = slides.map(function (s, i) { return '<button type="button" aria-label="' + esc(UI.image) + ' ' + (i + 1) + '" aria-current="' + (i === 0) + '"></button>'; }).join('');
        dots.hidden = false;
        dots.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; goSlide($$('button', dots).indexOf(b)); restart(); });
      }
      var restart = function () { clearInterval(aTimer); if (slides.length > 1 && tier() !== 'minimal') aTimer = setInterval(function () { if (!d.hidden) goSlide(ai + 1); }, 5500); };
      if (aboutEl && 'IntersectionObserver' in win) new IntersectionObserver(function (e) { if (e[0].isIntersecting) restart(); else clearInterval(aTimer); }).observe(aboutEl); else restart();
    }
  }

  // --- Accueil : diaporama facultatif (config.images.heroSlides) ; sinon l'image seule garde son zoom animé ---
  var heroMedia = $('[data-parallax]'), heroList = (C.images && C.images.heroSlides) || [];
  if (heroMedia && heroList.length) {
    var heroBase = $('.hero__image', heroMedia);
    heroList.forEach(function (it) {
      var u = typeof it === 'string' ? it : ((small() && it.mobile) || it.desktop);
      if (!u) return;
      var im2 = d.createElement('img');
      im2.className = 'hero__image hero__slide'; im2.alt = ''; im2.setAttribute('aria-hidden', 'true');
      im2.decoding = 'async'; im2.loading = 'lazy'; im2.src = u;
      heroMedia.appendChild(im2);
    });
    var heroImgs = $$('.hero__image', heroMedia), hk = 0, heroOn = true;
    var heroRm = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var heroHost = $('.hero');
    if ('IntersectionObserver' in win && heroHost) new IntersectionObserver(function (e) { heroOn = e[0].isIntersecting; }).observe(heroHost);
    if (heroImgs.length > 1 && !heroRm) setInterval(function () {
      if (d.hidden || !heroOn) return;
      heroImgs[hk].classList.remove('is-active'); hk = (hk + 1) % heroImgs.length; heroImgs[hk].classList.add('is-active');
    }, Math.max(3000, (C.images && C.images.heroSlideInterval) || 7000));
  }

  // --- Accueil : découpe du titre mot par mot pour l'animation d'entrée (ignorée si la page est traduite) ---
  var heroTitle = $('[data-hero-title]');
  if (heroTitle && !isTr) {
    var wi = 0, hiStart = -1;
    var splitWords = function (node, inHl) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(d.createTextNode(' ')); return; }
            var s = d.createElement('span');
            s.className = 'w'; s.setAttribute('aria-hidden', 'true');
            s.style.setProperty('--i', wi);
            if (inHl && hiStart < 0) hiStart = wi;
            s.textContent = part; frag.appendChild(s); wi++;
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) { splitWords(n, inHl || n.hasAttribute('data-hero-highlight')); }
      });
    };
    var label = heroTitle.textContent.replace(/\s+/g, ' ').trim();
    splitWords(heroTitle, false);
    heroTitle.setAttribute('aria-label', label);
    var hl = $('[data-hero-highlight]', heroTitle);
    if (hl && hiStart > -1) hl.style.setProperty('--hi', hiStart);
  }

  // --- Direction : cartes des leaders créées depuis config.leaders ---
  var lico = function (p) { return '<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + '</svg>'; };
  var LINK_ICONS = {
    portfolio: lico('<path d="M7 17 17 7M8 7h9v9"></path>'),
    email: lico('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path>'),
    whatsapp: lico('<path d="M21 12a8 8 0 0 1-11.7 7L4 20l1.1-4.9A8 8 0 1 1 21 12Z"></path><path d="M9 10c0 3 2 5 5 5l1.2-1.6-1.8-1-.8.7c-.8-.4-1.4-1-1.8-1.8l.7-.8-1-1.8L9 10Z"></path>'),
    facebook: lico('<path d="M14 8h2V5h-2.5A3.5 3.5 0 0 0 10 8.5V11H8v3h2v6h3v-6h2.2l.8-3H13V8.5c0-.3.3-.5.5-.5Z"></path>'),
    link: lico('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"></path>')
  };
  var leadersBox = $('[data-leaders]');
  if (leadersBox) {
    leadersBox.innerHTML = (C.leaders || []).map(function (L, i) {
      var photos = L.photos || [], uid = 'leader-' + (L.id || i);
      var theme = ['blue', 'green', 'brown'].indexOf(L.theme) > -1 ? L.theme : 'blue';
      var ph = photos.slice(0, 2).map(function (p, k) {
        return '<figure class="leader__photo leader__photo--' + (k ? 'second' : 'main') + '"><img src="' + esc(p.src) + '" alt="' + esc(p.alt || L.name) + '" loading="lazy" decoding="async"></figure>';
      }).join('');
      var logo = L.logo ? (L.logo.url ? '<a class="leader__logo" href="' + esc(L.logo.url) + '" target="_blank" rel="noreferrer noopener" aria-label="' + esc(L.logo.alt || '') + '">' : '<span class="leader__logo">') + '<img src="' + esc(L.logo.src) + '" alt="' + esc(L.logo.alt || '') + '" loading="lazy" decoding="async">' + (L.logo.url ? '</a>' : '</span>') : '';
      var NameTag = L.heading ? 'h3' : 'h2';
      var bio = (L.bio || []).length;
      var links = (L.links || []).map(function (l) {
        var ext = /^https?:/.test(l.url);
        return '<a class="leader__link" data-icon="' + esc(l.icon || 'link') + '" href="' + esc(l.url) + '"' + (ext ? ' target="_blank" rel="noreferrer noopener"' : '') + '>' + (LINK_ICONS[l.icon] || LINK_ICONS.link) + '<span>' + esc(l.label) + '</span></a>';
      }).join('');
      var soc = L.socials ? '<div class="leader__socials" aria-label="' + esc(UI.socialProfiles) + '">' + (C.socials || []).map(function (s) {
        return '<a href="' + esc(s.url) + '" target="_blank" rel="noreferrer noopener" aria-label="' + esc(s.name) + '">' + (SOCIAL[s.icon] || '') + '</a>';
      }).join('') + '</div>' : '';
      return '<article class="leader" id="' + esc(L.id || uid) + '" data-theme="' + theme + '" data-reveal>' +
        '<div class="leader__photos' + (photos.length > 1 ? ' has-two' : '') + '">' + ph + logo + '</div>' +
        '<div class="leader__panel">' +
        (L.eyebrow ? '<p class="leader__eyebrow">' + esc(L.eyebrow) + '</p>' : '') +
        (L.heading ? '<h2 class="leader__heading">' + esc(L.heading) + '</h2>' : '') +
        '<' + NameTag + ' class="leader__name">' + esc(L.name) + '</' + NameTag + '>' +
        ((L.titles || []).length ? '<ul class="leader__titles">' + L.titles.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        (L.summary ? '<p class="leader__summary">' + esc(L.summary) + '</p>' : '') +
        (bio ? '<button class="leader__toggle" type="button" aria-expanded="false" aria-controls="' + uid + '-bio" data-bio-toggle data-read="' + esc(UI.readBio) + '" data-hide="' + esc(UI.hideBio) + '"><span>' + esc(UI.readBio) + '</span> <b aria-hidden="true">+</b></button><div class="leader__bio" id="' + uid + '-bio" hidden>' + L.bio.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' : '') +
        ((links || soc) ? '<div class="leader__actions">' + links + soc + '</div>' : '') +
        '</div></article>';
    }).join('');
  }

  // --- Distinctions, domaines d'impact, galerie, partenaires (bandeau défilant) ---
  var fill2 = function (sel, list, tpl) { var el = $(sel); if (el) el.innerHTML = (list || []).map(tpl).join(''); };
  fill2('[data-awards-grid]', C.awards, function (a) {
    return '<button class="award-document" type="button" data-reveal data-gallery-item data-group="awards" data-src="' + esc(a.src) + '" data-alt="' + esc(a.title) + '" data-title="' + esc(a.title) + '" aria-label="' + esc(UI.openDocument) + ' ' + esc(a.title) + '"><span class="ad-frame"><img src="' + esc(a.src) + '" alt="' + esc(a.title) + '" loading="lazy" decoding="async"><span class="ad-cap"><strong>' + esc(a.title) + '</strong><span class="ad-zoom" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></span></span></span></button>';
  });
  fill2('[data-impact-grid]', C.impact, function (i, n) {
    return '<article class="impact-card" data-reveal data-impact="' + n + '" tabindex="0" role="button" aria-haspopup="dialog" aria-label="' + esc(UI.openItem) + ' ' + esc(i.title) + '">' +
      '<img class="impact-card__img" src="' + esc(i.image) + '" alt="' + esc(i.alt) + '" loading="lazy" decoding="async">' +
      '<span class="impact-card__shade" aria-hidden="true"></span>' +
      '<div class="impact-card__copy"><div class="impact-card__icon" data-icon="' + esc(i.icon) + '">' + (ICONS[i.icon] || ICONS.community) + '</div><h3>' + esc(i.title) + '</h3><p>' + esc(i.text) + '</p></div>' +
      '<span class="impact-card__open" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span></article>';
  });
  fill2('[data-gallery-grid]', C.gallery, function (g) {
    return '<button class="gallery-item" type="button" data-reveal aria-label="' + esc(UI.openImage) + ' ' + esc(g.title) + '" data-gallery-item data-group="gallery" data-src="' + esc(g.src) + '" data-alt="' + esc(g.alt) + '" data-title="' + esc(g.title) + '"><img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '" loading="lazy" decoding="async"><span class="gallery-item__open" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle class="go-ring" cx="24" cy="24" r="22" pathLength="1"/><g transform="translate(12 12)"><g class="go-arrows"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></g></g></svg></span><span class="gallery-item__bar" aria-hidden="true"></span><span class="gallery-item__copy"><small>' + esc(g.category) + '</small><strong>' + esc(g.title) + '</strong></span></button>';
  });
  // Partenaires : 4 copies de la liste pour un défilement infini sans coupure
  var pBox = $('[data-partners]');
  if (pBox) {
    var pList = C.partners || [];
    var pGroup = function (hid) {
      return '<div class="logo-group"' + (hid ? ' aria-hidden="true"' : '') + '>' + pList.map(function (p, k) {
        return '<article class="logo-card" style="--k:' + k + '"><span class="logo-card__plate"><img src="' + esc(p.src) + '" alt="' + (hid ? '' : esc(p.name)) + '" loading="lazy" decoding="async"></span><h3>' + esc(p.name) + '</h3></article>';
      }).join('') + '</div>';
    };
    pBox.innerHTML = pList.length ? '<div class="logo-track">' + pGroup(false) + pGroup(true) + pGroup(true) + pGroup(true) + '</div>' : '';
  }

  // --- Distinctions : rosace et étincelles animées ---
  var awFx = $('[data-awards-fx]');
  if (awFx && tier() !== 'minimal') {
    var rays = '';
    for (var ri = 0; ri < 36; ri++) {
      var ang = ri * Math.PI / 18, r1 = 128, r2 = ri % 2 ? 158 : 176;
      rays += '<path d="M' + (200 + r1 * Math.cos(ang)).toFixed(1) + ' ' + (200 + r1 * Math.sin(ang)).toFixed(1) + 'L' + (200 + r2 * Math.cos(ang)).toFixed(1) + ' ' + (200 + r2 * Math.sin(ang)).toFixed(1) + '"/>';
    }
    var ros = d.createElement('div');
    ros.className = 'awards-fx__rosette';
    ros.innerHTML = '<svg viewBox="0 0 400 400" fill="none" stroke="#f5c96f" stroke-width="1.2" stroke-linecap="round"><circle cx="200" cy="200" r="190" stroke-opacity=".35"/><circle cx="200" cy="200" r="120" stroke-opacity=".45"/><circle cx="200" cy="200" r="84" stroke-opacity=".25" stroke-dasharray="3 7"/>' + rays + '</svg>';
    awFx.appendChild(ros);
    var nSp = tier() === 'full' ? 22 : 10;
    for (var si = 0; si < nSp; si++) {
      var sp = d.createElement('i');
      sp.className = 'aw-spark';
      sp.style.cssText = 'left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (30 + Math.random() * 70).toFixed(1) + '%;--s:' + (3 + Math.random() * 5).toFixed(1) + 'px;--t:' + (6 + Math.random() * 6).toFixed(1) + 's;--dl:-' + (Math.random() * 10).toFixed(1) + 's';
      awFx.appendChild(sp);
    }
  }
  // --- Distinctions : emblème animé (médaille, lauriers, étoile, orbite) + badges sur les diplômes ---
  var awSec = $('#awards'), awHead = awSec && $('.section-heading', awSec);
  if (awHead) {
    var pt = function (r, deg) { var a = deg * Math.PI / 180; return [(200 + r * Math.cos(a)).toFixed(2), (200 + r * Math.sin(a)).toFixed(2)]; };
    var spk = function (x, y, s) { return 'M' + x + ' ' + (y - s) + 'Q' + x + ' ' + y + ' ' + (x + s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + s) + 'Q' + x + ' ' + y + ' ' + (x - s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - s) + 'Z'; };
    var ticks = '', leaves = '', i2, k2;
    for (i2 = 0; i2 < 72; i2++) {
      var t1 = pt(168, i2 * 5), t2 = pt(i2 % 6 === 0 ? 182 : 175, i2 * 5);
      ticks += '<line class="aw-a aw-tick" style="--i:' + i2 + '" x1="' + t1[0] + '" y1="' + t1[1] + '" x2="' + t2[0] + '" y2="' + t2[1] + '"/>';
    }
    var LEAF = 'M0 -12C7 -8 8 4 0 17C-8 4 -7 -8 0 -12Z';
    for (k2 = 0; k2 < 9; k2++) {
      [-1, 1].forEach(function (side) {
        var th = side < 0 ? 100 + k2 * 15.75 : 80 - k2 * 15.75;
        [['out', 134 + 8, 26], ['in', 134 - 8, -26]].forEach(function (L) {
          var p = pt(L[1], th), rot = (side < 0 ? th : th + 180) + L[2] * side;
          leaves += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + rot.toFixed(1) + ')"><path class="aw-a aw-leaf aw-leaf--' + L[0] + '" style="--i:' + k2 + '" d="' + LEAF + '"/></g>';
        });
      });
    }
    var a0 = pt(134, 95), a1 = pt(134, 228), b0 = pt(134, 85), b1 = pt(134, -48);
    var star = '', sp, si;
    for (si = 0; si < 10; si++) { sp = pt(si % 2 ? 21 : 50, -90 + si * 36); star += (si ? 'L' : 'M') + (sp[0] - 200 + 200) + ' ' + sp[1]; }
    star += 'Z';
    var sparks = [[44, 74, 11], [356, 104, 9], [340, 322, 12], [60, 318, 8], [200, 10, 7]].map(function (s, i) { return '<path class="aw-spk" style="--i:' + i + '" d="' + spk(s[0], s[1], s[2]) + '"/>'; }).join('');
    var emblem = '<div class="aw-emblem" aria-hidden="true" data-aw-emblem><svg viewBox="0 0 400 400" fill="none" focusable="false">' +
      '<defs><radialGradient id="awg-disc" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#fff6d6"/><stop offset=".45" stop-color="#f5c96f"/><stop offset="1" stop-color="#b9791f"/></radialGradient>' +
      '<linearGradient id="awg-shine" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="awg-rib" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4e9de0"/><stop offset="1" stop-color="#1767a5"/></linearGradient>' +
      '<clipPath id="awg-clip"><circle cx="200" cy="200" r="92"/></clipPath></defs>' +
      '<circle class="aw-pulse" style="--n:0" cx="200" cy="200" r="92"/><circle class="aw-pulse" style="--n:1" cx="200" cy="200" r="92"/>' +
      '<circle class="aw-draw aw-ring" cx="200" cy="200" r="192" pathLength="1"/>' +
      '<g class="aw-ticks">' + ticks + '</g>' +
      '<circle class="aw-a aw-dash" cx="200" cy="200" r="112"/>' +
      '<path class="aw-a aw-ribbon aw-ribbon--l" d="M176 262L146 362L172 346L194 372L206 268Z"/><path class="aw-a aw-ribbon aw-ribbon--r" d="M224 262L254 362L228 346L206 372L194 268Z"/>' +
      '<path class="aw-draw aw-stem aw-stem--l" pathLength="1" d="M' + a0[0] + ' ' + a0[1] + 'A134 134 0 0 1 ' + a1[0] + ' ' + a1[1] + '"/><path class="aw-draw aw-stem aw-stem--r" pathLength="1" d="M' + b0[0] + ' ' + b0[1] + 'A134 134 0 0 0 ' + b1[0] + ' ' + b1[1] + '"/>' +
      leaves +
      '<circle class="aw-burst" cx="200" cy="200" r="92"/>' +
      '<g class="aw-a aw-disc"><circle cx="200" cy="200" r="92" fill="url(#awg-disc)" stroke="#fff3c4" stroke-width="3"/><circle cx="200" cy="200" r="80" stroke="#8a5a14" stroke-opacity=".5" stroke-width="1.2"/>' +
      '<g clip-path="url(#awg-clip)"><g class="aw-shine"><rect x="30" y="100" width="36" height="200" fill="url(#awg-shine)" transform="skewX(-18)"/></g></g></g>' +
      '<g class="aw-starwrap"><path class="aw-draw aw-star-line" pathLength="1" d="' + star + '"/><path class="aw-a aw-star-fill" d="' + star + '"/></g>' +
      '<g class="aw-a aw-orbit"><circle cx="200" cy="8" r="5.5" fill="#fff3c4"/><circle cx="' + pt(192, -97)[0] + '" cy="' + pt(192, -97)[1] + '" r="3.6" fill="#f5c96f" fill-opacity=".65"/><circle cx="' + pt(192, -104)[0] + '" cy="' + pt(192, -104)[1] + '" r="2.6" fill="#f5c96f" fill-opacity=".4"/><circle cx="' + pt(192, -111)[0] + '" cy="' + pt(192, -111)[1] + '" r="1.8" fill="#f5c96f" fill-opacity=".22"/></g>' +
      sparks + '</svg></div>';
    awHead.classList.add('has-emblem');
    awHead.insertAdjacentHTML('beforeend', emblem);
    var emEl = $('[data-aw-emblem]', awHead);
    if ('IntersectionObserver' in win) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { emEl.classList.add('is-in', 'is-live'); } else { emEl.classList.remove('is-live'); }
        });
      }, { threshold: 0.35 }).observe(emEl);
    } else { emEl.classList.add('is-in', 'is-live'); }
  }
  $$('.award-document').forEach(function (card, i) {
    card.style.setProperty('--k', i);
    card.insertAdjacentHTML('beforeend', '<span class="ad-star" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17l-5.600 3.100 1.200-6.300L3 9.400l6.300-.8L12 2.800Z"/></svg></span>');
  });
  // --- Fonds animés : particules « Featured news » et « Approche », puis inclinaison 3D des photos de la galerie ---
  var nwFx = $('[data-news-fx]');
  if (nwFx && tier() !== 'minimal') {
    var nNw = tier() === 'full' ? 16 : 8;
    for (var ni = 0; ni < nNw; ni++) {
      var nd = d.createElement('i');
      nd.className = 'nf-dot' + (ni % 3 === 0 ? ' nf-dot--pink' : '');
      nd.style.cssText = 'left:' + (Math.random() * 100).toFixed(1) + '%;--s:' + (3 + Math.random() * 6).toFixed(1) + 'px;--t:' + (9 + Math.random() * 9).toFixed(1) + 's;--dl:-' + (Math.random() * 14).toFixed(1) + 's;--x:' + ((Math.random() - .5) * 120).toFixed(0) + 'px';
      nwFx.appendChild(nd);
    }
  }
  var apFx = $('[data-approach-fx]');
  if (apFx && tier() !== 'minimal') {
    var nDot = tier() === 'full' ? 20 : 10;
    for (var di = 0; di < nDot; di++) {
      var dt = d.createElement('i');
      dt.className = 'af-dot';
      dt.style.cssText = 'left:' + (Math.random() * 100).toFixed(1) + '%;--s:' + (3 + Math.random() * 6).toFixed(1) + 'px;--t:' + (9 + Math.random() * 9).toFixed(1) + 's;--dl:-' + (Math.random() * 14).toFixed(1) + 's;--x:' + ((Math.random() - .5) * 120).toFixed(0) + 'px';
      apFx.appendChild(dt);
    }
  }
  if (tier() !== 'minimal' && win.matchMedia && win.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.gallery-item').forEach(function (it) {
      it.addEventListener('pointermove', function (e) {
        var r = it.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        it.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        it.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        it.style.setProperty('--ry', ((x - .5) * 9).toFixed(2) + 'deg');
        it.style.setProperty('--rx', ((.5 - y) * 9).toFixed(2) + 'deg');
        it.style.setProperty('--px', ((.5 - x) * 16).toFixed(1) + 'px');
        it.style.setProperty('--py', ((.5 - y) * 16).toFixed(1) + 'px');
      });
      it.addEventListener('pointerleave', function () {
        ['--rx', '--ry', '--px', '--py'].forEach(function (k) { it.style.removeProperty(k); });
      });
    });
  }
  if (tier() !== 'minimal' && win.matchMedia && win.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.award-document').forEach(function (card) {
      var fr = $('.ad-frame', card);
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        fr.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
        fr.style.setProperty('--rx', (-y * 9).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () { fr.style.setProperty('--rx', '0deg'); fr.style.setProperty('--ry', '0deg'); });
    });
  }

  // --- Apparition au défilement (reveal) et séquence des 4 étapes de l'approche ---
  $$('[data-reveal-group]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--d', (i % 3) * 90 + 'ms'); });
  });
  root.classList.add('rr');
  var revealItems = $$('[data-reveal]');
  if (!('IntersectionObserver' in win)) {
    revealItems.forEach(function (n) { n.classList.add('is-in'); });
  } else {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach(function (n) { rio.observe(n); });
  }

  var seq = $('[data-seq]');
  if (seq) {
    var steps = $$('.process-step', seq), played = false;
    var play = function () {
      if (played) return; played = true;
      steps.forEach(function (s, i) { setTimeout(function () { s.classList.add('is-in'); }, tier() === 'minimal' ? 0 : i * 1000); });
    };
    if (!('IntersectionObserver' in win)) play();
    else new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { play(); o.disconnect(); } }, { threshold: 0.25 }).observe(seq);
  }

  // --- Défilement : menu verre (classe is-scrolled), barre de progression, parallaxe de l'accueil ---
  var hero = $('.hero'), header = $('.site-header'), bar = $('[data-progress]'), media = $('[data-parallax]');
  var heroH = hero ? hero.offsetHeight : 0, ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    win.requestAnimationFrame(function () {
      ticking = false;
      var y = win.pageYOffset || root.scrollTop, t = tier();
      if (header) header.classList.toggle('is-scrolled', y > 8);
      if (bar && t !== 'minimal') {
        var h = root.scrollHeight - win.innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0).toFixed(4) + ')';
      }
      if (media) {
        if (t === 'full' && y < heroH + 200) media.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0)';
        else if (media.style.transform) media.style.transform = '';
      }
    });
  };
  win.addEventListener('scroll', onScroll, { passive: true });
  var rzT;
  win.addEventListener('resize', function () {
    clearTimeout(rzT);
    rzT = setTimeout(function () { heroH = hero ? hero.offsetHeight : 0; $$('[data-img]').forEach(setImg); onScroll(); }, 150);
  });
  onScroll();

  // --- Accueil : phrases défilantes et vagues colorées (zones claire, bleue, or) ---
  var heroVisibleW = true;
  var ph = $('[data-hero-phrase]'), phrases = C.heroPhrases || [];
  if (ph && phrases.length) {
    ph.textContent = phrases[0];
    if (phrases.length > 1) {
      var pi = 0, heroVisible = true;
      if ('IntersectionObserver' in win && hero) new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; }).observe(hero);
      setInterval(function () {
        if (tier() === 'minimal' || d.hidden || !heroVisible) return;
        ph.classList.add('is-out');
        setTimeout(function () { pi = (pi + 1) % phrases.length; ph.textContent = phrases[pi]; ph.classList.remove('is-out'); }, 320);
      }, 3600);
    }
  }

  var wavesBox = $('[data-hero-waves]');
  if (wavesBox && phrases.length) {
    var P = {
      gold: 'M-60 600 C 480 730, 1130 560, 1680 20',
      blue: 'M-60 656 C 480 786, 1130 616, 1680 76',
      light: 'M-60 742 C 480 872, 1130 702, 1680 150'
    };
    var fillD = 'M-60 690 C 480 820, 1130 650, 1680 110 L1680 720 L-60 720 Z';
    var NS = 'http://www.w3.org/2000/svg';
    wavesBox.innerHTML = '<svg class="hero-waves" viewBox="0 0 1600 700" preserveAspectRatio="xMaxYMax meet" focusable="false">' +
      '<defs><path id="hwp-gold" d="' + P.gold + '"/><path id="hwp-blue" d="' + P.blue + '"/><path id="hwp-light" d="' + P.light + '"/><clipPath id="hwc"><path d="' + fillD + '"/></clipPath></defs>' +
      '<g class="hw-breathe">' +
      '<g class="hw-shape hw-shape--light"><path d="' + fillD + '" fill="#eef2f7"/>' +
        '<g clip-path="url(#hwc)"><g class="hw-drift"><circle cx="1180" cy="560" r="90"/><circle class="hw-fill" cx="820" cy="640" r="130"/><circle cx="1400" cy="430" r="60"/></g>' +
        '<circle class="hw-pulse" cx="1500" cy="640" r="120" fill="none" stroke="#4e9de0" stroke-width="2"/><circle class="hw-pulse" cx="1500" cy="640" r="120" fill="none" stroke="#f5c96f" stroke-width="3"/></g></g>' +
      '<g class="hw-shape hw-shape--blue"><path d="' + P.blue + '" fill="none" stroke="#4e9de0" stroke-width="44" stroke-linecap="butt"/><path class="hw-flow hw-flow--blue" d="' + P.blue + '" stroke="#bfe3fb" stroke-opacity=".55" stroke-width="14"/></g>' +
      '<g class="hw-shape hw-shape--gold"><path d="' + P.gold + '" fill="none" stroke="#f5c96f" stroke-width="52" stroke-linecap="butt"/><path class="hw-flow hw-flow--gold" d="' + P.gold + '" stroke="#fff" stroke-opacity=".6" stroke-width="16"/></g>' +
      ['gold', 'blue', 'light'].map(function (z) { return '<text class="hw-text hw-text--' + z + '" text-anchor="middle"><textPath href="#hwp-' + z + '" startOffset="' + (z === 'light' ? 70 : 66) + '%"></textPath></text>'; }).join('') +
      '</g></svg>';
    ['gold', 'blue', 'light'].forEach(function (z, zi) {
      var list = phrases.filter(function (p, i) { return i % 3 === zi; });
      if (!list.length) list = [phrases[zi % phrases.length]];
      var tp = $('.hw-text--' + z + ' textPath', wavesBox), tx = $('.hw-text--' + z, wavesBox), k = 0;
      tp.textContent = list[0];
      if (list.length > 1) setInterval(function () {
        if (tier() === 'minimal' || d.hidden || !heroVisibleW) return;
        tx.classList.add('is-out');
        setTimeout(function () { k = (k + 1) % list.length; tp.textContent = list[k]; tx.classList.remove('is-out'); }, 480);
      }, 4200 + zi * 700);
    });
  }

  // --- Accueil : les icônes 3D en rectangles et la synchronisation des vagues sont gérées par hero3d.js ---

  // --- Menu : lien actif selon la section visible ---
  var navLinks = $$('.desktop-nav a[href^="#"]');
  if ('IntersectionObserver' in win && navLinks.length) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    if (map.prestige) map.awards = map.prestige;
    var nio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var a = map[e.target.id];
        if (a && e.isIntersecting) {
          navLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = d.getElementById(id); if (s) nio.observe(s); });
  }

  // --- Langues : sélecteur, cookie googtrans et chargement de Google Translate (uniquement si une langue traduite est choisie) ---
  // Pages natives : adresses locales fiables (priment sur un ancien config.js qui pointerait vers l'ancien site)
  var NATIVE_URL = { en: 'index.html', fr: 'fr.html' };
  // Adresse du proxy de traduction de Google (méthode de secours qui ne dépend d'aucun script)
  var proxyUrl = function (tl) {
    var h = location.hostname.replace(/-/g, '--').replace(/\./g, '-');
    return 'https://' + h + '.translate.goog' + location.pathname + '?_x_tr_sl=' + encodeURIComponent(PAGE_LANG) + '&_x_tr_tl=' + encodeURIComponent(tl) + '&_x_tr_hl=' + encodeURIComponent(PAGE_LANG) + '&_x_tr_pto=wapp' + location.hash;
  };
  // Depuis le proxy : retrouve l'adresse réelle du site
  var realUrl = function (path) {
    var h = location.hostname.replace(/\.translate\.goog$/i, '').replace(/--/g, '\u0001').replace(/-/g, '.').replace(/\u0001/g, '-');
    return 'https://' + h + path;
  };
  // ===== SYSTÈME DE TRADUCTION GOOGLE (même système que le site GreenLab Design) =====
  //  1) le cookie « googtrans » est posé AVANT de charger le traducteur : il démarre directement dans la bonne langue
  //  2) le script attend que le menu caché de Google soit prêt (12 s maximum), puis lui donne la langue
  //  3) il VÉRIFIE 1,6 s plus tard que la page est traduite ; sinon il remet Google à zéro et redemande (4 essais au total)
  //  4) <html lang> n'est jamais modifié ici : c'est Google qui le met à jour une fois la traduction faite
  var GT_CODES = LANGS.filter(function (L) { return !L.native; }).map(function (L) { return L.code; }).join(',');
  // La page est-elle traduite ? (classe sur <html>, ou texte enveloppé par Google dans des <font>)
  var gtDone = function () { return /translated-(ltr|rtl)/.test(root.className) || !!$('body font'); };
  // Change la valeur du menu interne de Google et le prévient
  var gtSet = function (c, v) { c.value = v; c.dispatchEvent(new Event('change', { bubbles: true })); };
  // Demande la langue l à Google : attend qu'il soit prêt, applique, puis vérifie (gtCheck)
  var gtApply = function (l, tries) {
    tries = tries || 0;
    var n = 0, t = setInterval(function () {
      var c = $('.goog-te-combo');
      if (c) { clearInterval(t); gtSet(c, l); gtCheck(l, tries); }
      else if (++n > 80) clearInterval(t);
    }, 150);
  };
  // Vérification : si rien n'est traduit au bout de 1,6 s, on remet Google à zéro puis on redemande
  var gtCheck = function (l, tries) {
    setTimeout(function () {
      if (CUR_LANG !== l || gtDone() || tries >= 3) return;   // langue changée entre-temps, déjà traduit, ou assez d'essais
      var c = $('.goog-te-combo'); if (!c) return;
      gtSet(c, '');
      setTimeout(function () { if (CUR_LANG === l) gtApply(l, tries + 1); }, 350);
    }, 1600);
  };
  // Charge le traducteur (une seule fois) puis lui demande la langue l
  var gtLoad = function (l) {
    // les titres découpés mot à mot (animation d'accueil) sont recollés : sinon Google les traduit mot par mot
    $$('h1,h2').forEach(function (h) {
      $$('.w', h).forEach(function (w) { w.parentNode.replaceChild(d.createTextNode(w.textContent), w); });
      h.normalize();
    });
    if ($('.goog-te-combo')) return gtApply(l);
    win.googleTranslateElementInit = function () {
      try { new win.google.translate.TranslateElement({ pageLanguage: PAGE_LANG, includedLanguages: GT_CODES, autoDisplay: false }, 'google_translate_element'); } catch (err) {}
      gtApply(l);
    };
    if (!$('#gt-js')) {
      var g = d.createElement('script');
      g.id = 'gt-js'; g.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      d.head.appendChild(g);
    }
  };
  // Met à jour l'interface (menu de langues, formulaire) quand la langue change sans rechargement
  var markLang = function (code) {
    CUR_LANG = code;
    root.classList.toggle('is-translated', code !== PAGE_LANG);
    var Lc = LANGS.filter(function (L) { return L.code === code; })[0];
    $$('[data-lang-current]').forEach(function (n) { n.textContent = Lc ? (Lc.short || Lc.code.toUpperCase()) : code.toUpperCase(); });
    $$('[data-code]').forEach(function (b) { if (b.getAttribute('data-code') === code) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    var lf2 = $('input[name="language"]'); if (lf2) lf2.value = code;
    if (typeof setLang === 'function') setLang(false);
  };
  var chooseLang = function (L) {
    if (!L || L.code === CUR_LANG) return;
    var nat = L.native && L.code !== PAGE_LANG ? (NATIVE_URL[L.code] || L.url) : '';
    if (ON_PROXY) {
      if (nat) { location.href = realUrl('/' + nat); return; }
      if (L.code === PAGE_LANG) { location.href = realUrl(location.pathname); return; }
      location.href = proxyUrl(L.code).replace(/^https:\/\/[^/]+/, location.origin); return;
    }
    if (nat) { setCookie(''); location.href = nat; return; }
    // Retour à la langue de la page : cookie effacé puis rechargement (page d'origine intacte)
    if (L.code === PAGE_LANG || L.native) { setCookie(''); location.reload(); return; }
    // Langue traduite : cookie posé AVANT de charger Google, puis traduction en direct, sans rechargement
    setCookie('/' + PAGE_LANG + '/' + L.code);
    markLang(L.code);
    gtLoad(L.code);
  };
  var picker = $('[data-lang-picker]'), langGrid = $('[data-lang-grid]');
  var langBtns = function (cls) {
    return LANGS.map(function (L) {
      return '<button type="button" class="' + cls + '" role="menuitem" lang="' + esc(L.code) + '" data-code="' + esc(L.code) + '"' + (L.code === CUR_LANG ? ' aria-current="true"' : '') + '><span>' + esc(L.label) + '</span>' + (L.native ? '' : '<small>Google</small>') + '</button>';
    }).join('');
  };
  var langClick = function (e) {
    var b = e.target.closest ? e.target.closest('[data-code]') : null;
    if (!b) return;
    chooseLang(LANGS.filter(function (L) { return L.code === b.getAttribute('data-code'); })[0]);
  };
  if (LANGS.length) {
    var curL = LANGS.filter(function (L) { return L.code === CUR_LANG; })[0];
    if (picker) {
      var lmenu = $('[data-lang-menu]', picker), lbtn = $('[data-lang-btn]', picker);
      $('[data-lang-current]', picker).textContent = curL ? (curL.short || curL.code.toUpperCase()) : CUR_LANG.toUpperCase();
      lmenu.innerHTML = langBtns('lang-item');
      var setLang = function (o) { lmenu.hidden = !o; picker.classList.toggle('is-open', o); lbtn.setAttribute('aria-expanded', String(o)); };
      lbtn.addEventListener('click', function (e) { e.stopPropagation(); setLang(lmenu.hidden); });
      lmenu.addEventListener('click', langClick);
      d.addEventListener('click', function (e) { if (!picker.contains(e.target)) setLang(false); });
      d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lmenu.hidden) { setLang(false); lbtn.focus(); } });
    }
    if (langGrid) { langGrid.innerHTML = langBtns('lang-chip'); langGrid.addEventListener('click', langClick); }
    var lf = $('input[name="language"]'); if (lf) lf.value = CUR_LANG;
  } else if (picker) { picker.parentNode.removeChild(picker); }
  // Page ouverte avec une langue traduite déjà choisie (cookie présent) : on lance le traducteur tout de suite
  if (isTr && TR.enabled !== false && !ON_PROXY) { setCookie('/' + PAGE_LANG + '/' + CUR_LANG); gtLoad(CUR_LANG); }

  // --- Fenêtres modales : ouverture/fermeture, piège du focus clavier ---
  var show = function (el) { el.hidden = false; void el.offsetWidth; el.classList.add('is-open'); };
  var hide = function (el) { el.classList.remove('is-open'); setTimeout(function () { if (!el.classList.contains('is-open')) el.hidden = true; }, 280); };
  var focusables = function (e) { return $$('a[href],button:not([disabled]),input:not([disabled])', e).filter(function (n) { return n.getClientRects().length; }); };

  // --- Menu mobile (panneau latéral) ---
  var menu = $('[data-mobile-menu]'), backdrop = $('[data-menu-backdrop]'), opener = $('[data-menu-open]'), returnFocus = null;
  var closeMenu = function () {
    if (!menu || !menu.classList.contains('is-open')) return;
    hide(menu); hide(backdrop);
    opener.setAttribute('aria-expanded', 'false');
    body.classList.remove('modal-is-open');
    if (returnFocus) returnFocus.focus();
  };
  var openMenu = function () {
    returnFocus = d.activeElement;
    show(menu); show(backdrop);
    opener.setAttribute('aria-expanded', 'true');
    body.classList.add('modal-is-open');
    $('[data-menu-close]', menu).focus();
  };
  if (opener && menu) {
    opener.addEventListener('click', openMenu);
    $('[data-menu-close]', menu).addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);
    $$('[data-menu-link]').forEach(function (a) { a.addEventListener('click', closeMenu); });
    onMq('(min-width: 901px)', function (e) { if (e.matches) closeMenu(); });
  }

  // --- Direction : bouton « Read full biography » ---
  d.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-bio-toggle]') : null;
    if (!t) return;
    var box = d.getElementById(t.getAttribute('aria-controls')), open = t.getAttribute('aria-expanded') === 'true';
    if (!box) return;
    t.setAttribute('aria-expanded', String(!open));
    $('span', t).textContent = open ? t.getAttribute('data-read') : t.getAttribute('data-hide');
    // Ouverture / fermeture fluide : la hauteur, la marge et l'opacité s'animent ; les paragraphes arrivent un à un
    var anim = box.animate && !(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (box._bioAnim) { box._bioAnim.cancel(); box._bioAnim = null; }
    if (!anim) { box.hidden = open; return; }
    var cs = win.getComputedStyle(box), mt = cs.marginTop, ease = 'cubic-bezier(.22,1,.36,1)';
    box.style.overflow = 'hidden';
    if (!open) {
      box.hidden = false; box.classList.add('is-opening');
      var h = box.scrollHeight;
      box._bioAnim = box.animate([{ height: '0px', marginTop: '0px', opacity: 0 }, { height: h + 'px', marginTop: mt, opacity: 1 }], { duration: 750, easing: ease });
      box._bioAnim.onfinish = function () { box._bioAnim = null; box.style.overflow = ''; box.classList.remove('is-opening'); };
    } else {
      var h0 = box.offsetHeight;
      box.classList.add('is-closing');
      box._bioAnim = box.animate([{ height: h0 + 'px', marginTop: mt, opacity: 1 }, { height: '0px', marginTop: '0px', opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.65,0,.35,1)' });
      box._bioAnim.onfinish = function () { box._bioAnim = null; box.hidden = true; box.style.overflow = ''; box.classList.remove('is-closing'); };
    }
  });

  // --- Visionneuse plein écran : flèches, clavier, balayage tactile ---
  var lb = $('[data-lightbox]'), items = [], idx = 0, lbFocus = null;
  if (lb) {
    var lbImg = $('[data-lightbox-image]', lb), lbTitle = $('[data-lightbox-title]', lb), lbCount = $('[data-lightbox-count]', lb), lbBg = $('[data-lightbox-bg]', lb), prev = $('[data-lightbox-prev]', lb), next = $('[data-lightbox-next]', lb);
    var render = function () {
      var it = items[idx];
      lbImg.src = it.getAttribute('data-src');
      if (lbBg) lbBg.style.backgroundImage = 'url("' + it.getAttribute('data-src') + '")';
      lbImg.classList.remove('is-swap'); void lbImg.offsetWidth; lbImg.classList.add('is-swap');
      lbImg.alt = it.getAttribute('data-alt') || '';
      lbTitle.textContent = it.getAttribute('data-title') || '';
      lbCount.textContent = items.length > 1 ? (idx + 1) + ' / ' + items.length : '';
      if (items.length > 1) { var n = items[(idx + 1) % items.length]; new Image().src = n.getAttribute('data-src'); }
    };
    var closeLb = function () {
      if (!lb.classList.contains('is-open')) return;
      hide(lb);
      body.classList.remove('modal-is-open');
      if (lbFocus) lbFocus.focus();
    };
    var move = function (s) { if (items.length < 2) return; idx = (idx + s + items.length) % items.length; render(); };
    d.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-gallery-item]') : null;
      if (!b) return;
      lbFocus = d.activeElement;
      items = $$('[data-gallery-item]').filter(function (x) { return x.getAttribute('data-group') === b.getAttribute('data-group'); });
      idx = items.indexOf(b);
      prev.hidden = next.hidden = items.length < 2;
      render(); show(lb);
      body.classList.add('modal-is-open');
      $('[data-lightbox-close]', lb).focus();
    });
    $('[data-lightbox-close]', lb).addEventListener('click', closeLb);
    prev.addEventListener('click', function () { move(-1); });
    next.addEventListener('click', function () { move(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    var sx = 0, sy = 0;
    lb.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX; sy = e.changedTouches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  d.addEventListener('keydown', function (e) {
    var modal = lb && lb.classList.contains('is-open') ? lb : menu && menu.classList.contains('is-open') ? menu : null;
    if (!modal) return;
    if (e.key === 'Escape') { e.preventDefault(); if (modal === lb) closeLb(); else closeMenu(); return; }
    if (modal === lb && e.key === 'ArrowRight') move(1);
    if (modal === lb && e.key === 'ArrowLeft') move(-1);
    if (e.key === 'Tab') {
      var f = focusables(modal), first = f[0], last = f[f.length - 1];
      if (!first) return;
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // --- Domaines d'impact : fenêtre de détail avec navigation ---
  var imCards = $$('.impact-card'), imList = C.impact || [];
  if (imCards.length) {
    var IMS = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
    var im = d.createElement('div');
    im.className = 'impact-modal'; im.hidden = true;
    im.setAttribute('role', 'dialog'); im.setAttribute('aria-modal', 'true'); im.setAttribute('aria-label', UI.impactArea);
    im.innerHTML = '<div class="impact-modal__panel">' +
      '<div class="impact-modal__media"><img data-im-img alt=""><span class="impact-modal__chip" data-im-icon></span></div>' +
      '<div class="impact-modal__body"><h3 data-im-title></h3><p class="impact-modal__lead" data-im-lead></p><div class="impact-modal__details" data-im-details></div><ul class="impact-modal__points" data-im-points></ul>' +
      '<div class="impact-modal__nav"><span data-im-count></span><div><button type="button" aria-label="' + esc(UI.prev) + '" data-im-prev>' + IMS('<path d="m14.500 5.500-6.500 6.500 6.500 6.500"/>') + '</button><button type="button" aria-label="' + esc(UI.next) + '" data-im-next>' + IMS('<path d="m9.500 5.500 6.500 6.500-6.500 6.500"/>') + '</button></div></div></div>' +
      '<button class="impact-modal__close" type="button" aria-label="' + esc(UI.close) + '" data-im-close>' + IMS('<path d="M6 6l12 12M18 6 6 18"/>') + '</button></div>';
    body.appendChild(im);
    var iq = function (s) { return $(s, im); };
    var imI = 0, imFocus = null;
    var fillIm = function (n) {
      var it = imList[(n + imList.length) % imList.length]; if (!it) return;
      imI = (n + imList.length) % imList.length;
      var img = iq('[data-im-img]'); img.src = it.image; img.alt = it.alt || '';
      iq('[data-im-title]').textContent = it.title;
      iq('[data-im-lead]').textContent = it.text;
      iq('[data-im-details]').innerHTML = (it.details || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
      iq('[data-im-points]').innerHTML = (it.points || []).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('');
      var ch = iq('[data-im-icon]'); ch.innerHTML = ICONS[it.icon] || ICONS.community; ch.setAttribute('data-icon', it.icon || '');
      iq('[data-im-count]').textContent = (imI < 9 ? '0' : '') + (imI + 1) + ' / ' + (imList.length < 10 ? '0' : '') + imList.length;
      iq('.impact-modal__body').scrollTop = 0;
      im.classList.remove('is-swap'); void im.offsetWidth; im.classList.add('is-swap');
    };
    var openIm = function (n) { imFocus = d.activeElement; fillIm(n); show(im); body.classList.add('modal-is-open'); iq('[data-im-close]').focus({ preventScroll: true }); };
    var closeIm = function () { if (!im.classList.contains('is-open')) return; hide(im); body.classList.remove('modal-is-open'); if (imFocus && imFocus.focus) imFocus.focus({ preventScroll: true }); };
    imCards.forEach(function (card) {
      var n = Number(card.getAttribute('data-impact'));
      card.addEventListener('click', function () { openIm(n); });
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openIm(n); } });
      if (win.matchMedia && win.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
          card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
        });
      }
    });
    iq('[data-im-close]').addEventListener('click', closeIm);
    iq('[data-im-prev]').addEventListener('click', function () { fillIm(imI - 1); });
    iq('[data-im-next]').addEventListener('click', function () { fillIm(imI + 1); });
    im.addEventListener('click', function (e) { if (e.target === im) closeIm(); });
    d.addEventListener('keydown', function (e) {
      if (!im.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeIm(); return; }
      if (e.key === 'ArrowRight') fillIm(imI + 1);
      if (e.key === 'ArrowLeft') fillIm(imI - 1);
      if (e.key === 'Tab') {
        var f = focusables(im), first = f[0], last = f[f.length - 1];
        if (!first) return;
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // glissement horizontal = domaine suivant/précédent ; un défilement vertical du texte ne change plus de page
    var tsx = 0, tsy = 0;
    im.addEventListener('touchstart', function (e) { tsx = e.changedTouches[0].clientX; tsy = e.changedTouches[0].clientY; }, { passive: true });
    im.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - tsx, dy = e.changedTouches[0].clientY - tsy; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8) fillIm(imI + (dx < 0 ? 1 : -1)); }, { passive: true });
  }

  // --- Formulaire de contact : envoi asynchrone par Formspree (config.site.formspree) ---
  var FSP = (C.site && C.site.formspree) || {};
  var fspReady = !!FSP.id && !/^VOTRE_/.test(FSP.id);
  $$('[data-async-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (form.reportValidity && !form.reportValidity()) return;
      var status = $('[data-form-status]', form), button = $('[data-submit]', form);
      var fd = new FormData(form), data = {};
      fd.forEach(function (v, k) { data[k] = v; });
      data.consent = fd.has('consent');
      button.disabled = true; button.textContent = button.getAttribute('data-loading'); status.hidden = true;
      var done = function (ok) {
        status.textContent = ok ? form.getAttribute('data-success') : form.getAttribute('data-failure');
        status.className = 'form-status' + (ok ? '' : ' form-status--error');
        status.hidden = false;
        if (ok) form.reset();
        button.disabled = false; button.textContent = button.getAttribute('data-default') + ' →';
      };
      var sent;
      if (fspReady) {
        // Envoi par Formspree (voir config.site.formspree)
        if (data.website) { done(true); return; }   // champ piège anti-robots rempli
        sent = fetch('https://formspree.io/f/' + encodeURIComponent(FSP.id), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: 'Nouvelle demande Afiri : ' + (data.interest || '') + ' (' + (data.fullName || '') + ')',
            _replyto: data.email || '',
            Email: data.email || '',
            Nom: data.fullName || '',
            Organisation: data.organization || '-',
            Domaine: data.interest || '-',
            Message: data.message || '',
            Langue: data.language || document.documentElement.lang || '',
            Page: location.href
          })
        }).then(function (r) {
          if (!r.ok) r.json().then(function (j) { console.error('[Formulaire] Formspree a répondu :', r.status, j); }, function () {});
          return r.ok;
        });
      } else {
        console.error('[Formulaire] Formspree n’est pas configuré : renseignez config.site.formspree.id');
        sent = Promise.resolve(false);
      }
      sent.then(done, function (err) { console.error('[Formulaire] Échec de l’envoi (réseau ou page ouverte en local ?) :', err); done(false); });
    });
  });
})();
