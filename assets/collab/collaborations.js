/*
==========================================================================
 COLLABORATIONS.JS : section « Nos Collaborations » (juste sous « Featured news »)
 Un SEUL fichier à modifier.
--------------------------------------------------------------------------
 Chemin : assets/collab/collaborations.js   (+ collaborations.css à côté)

 AJOUTER UNE COLLABORATION
   1. Dans la liste « items », copiez un bloc complet, de « { » jusqu'à « }, »
      (repères « DÉBUT » et « FIN » ci-dessous), et collez-le à la suite.
   2. Changez l'image, la couleur et les textes du bloc collé. C'est tout.

 AFFICHER / CACHER UNE COLLABORATION
   Dans le bloc : enabled: true  = affichée · enabled: false = cachée
   (elle reste enregistrée, vous pouvez la réactiver quand vous voulez).

 ÉVOLUTION AUTOMATIQUE
   · 3 collaborations affichées ou moins : les blocs sont côte à côte.
   · Plus de 3 : flèches gauche / droite et petits points pour naviguer.
   · Plus de 4 : défilement automatique (stoppé au survol ou quand un bloc est ouvert).
   Réglages dans « carousel » ci-dessous.

 DANS CHAQUE BLOC
   image          chemin de l'image de couverture (ex. 'assets/images/gallery/mon-image.jpg')
   imagePosition  cadrage : 'center', 'top', 'left center', '70% 30%'...
   color          couleur du rectangle qui apparaît au survol puis s'agrandit (#rrggbb)
   fr / en        textes : catégorie, date, titre, résumé (survol), détails (ouverture)
                  « fr » s'affiche sur fr.html, « en » sur index.html

 Pour cacher toute la section : enabled: false (tout en haut, hors des blocs).
 Image conseillée : jpg en HD (1920 à 2560 px de large).
 ⚠ Les textes fournis sont des EXEMPLES : remplacez-les par vos vraies collaborations.
==========================================================================
*/
window.COLLABORATIONS = {

  /* AFFICHER / CACHER : true ou false */
  enabled: true,

  /* EN-TÊTE DE LA SECTION */
  head: {
    fr: {
      eyebrow: 'Partenariats',
      title: 'Nos Collaborations',
      intro: 'Des projets menés avec des partenaires qui partagent notre exigence : un impact concret, durable et mesurable.'
    },
    en: {
      eyebrow: 'Partnerships',
      title: 'Our Collaborations',
      intro: 'Projects carried out with partners who share our standards: concrete, lasting and measurable impact.'
    }
  },

  /* DÉFILEMENT (utile seulement s'il y a plus de 3 collaborations) */
  carousel: {
    autoplay: true,      // défilement automatique si plus de 4 collaborations affichées
    delay: 5000          // temps entre deux défilements, en millisecondes
  },

  /* LIBELLÉS DES BOUTONS */
  labels: {
    fr: { open: 'Découvrir', close: 'Fermer', prev: 'Précédent', next: 'Suivant' },
    en: { open: 'Discover', close: 'Close', prev: 'Previous', next: 'Next' }
  },

  /* LES BLOCS */
  items: [

    /* ▼▼▼ DÉBUT collaboration 1 ▼▼▼ */
    {
      enabled: true,                          // true = affichée · false = cachée
      image: 'assets/images/impact/human-rights.webp',
      imagePosition: 'center',
      color: '#1767a5',                       // bleu
      fr: {
        category: 'Santé',
        date: 'Octobre 2026',
        title: 'Sensibilisation et dépistage précoce',
        summary: 'Une campagne communautaire pour informer, orienter et soutenir les femmes et leurs familles.',
        lead: 'Avec nos partenaires locaux, nous avons conçu un parcours de sensibilisation simple et accessible : information fiable, orientation vers des professionnels de santé et accompagnement des familles.',
        points: [
          { title: 'Informer', text: 'Des messages clairs, adaptés à chaque communauté et à chaque langue.' },
          { title: 'Orienter', text: 'Un lien direct avec les structures de santé et les professionnels.' },
          { title: 'Accompagner', text: 'Une écoute et un suivi pour ne laisser personne seul face au dépistage.' }
        ],
        ctaLabel: 'Nous contacter',
        ctaLink: '#contact'
      },
      en: {
        category: 'Health',
        date: 'October 2026',
        title: 'Awareness and early detection',
        summary: 'A community campaign to inform, guide and support women and their families.',
        lead: 'With our local partners, we designed a simple and accessible awareness path: trustworthy information, referral to health professionals and support for families.',
        points: [
          { title: 'Inform', text: 'Clear messages adapted to each community and each language.' },
          { title: 'Guide', text: 'A direct link with health facilities and professionals.' },
          { title: 'Support', text: 'Listening and follow-up so no one faces screening alone.' }
        ],
        ctaLabel: 'Contact us',
        ctaLink: '#contact'
      }
    },
    /* ▲▲▲ FIN collaboration */

    /* ▼▼▼ DÉBUT collaboration 2 ▼▼▼ */
    {
      enabled: true,                          // true = affichée · false = cachée
      image: 'assets/images/impact/education.webp',
      imagePosition: 'center',
      color: '#0f8b8d',                       // vert d'eau
      fr: {
        category: 'Éducation',
        date: 'Septembre 2026',
        title: 'Accès à l’éducation pour les jeunes filles',
        summary: 'Un programme pour garder les jeunes filles à l’école et leur ouvrir des perspectives.',
        lead: 'Ce programme réunit écoles, familles et organisations locales autour d’un objectif commun : permettre à chaque jeune fille d’étudier dans de bonnes conditions et de construire son avenir.',
        points: [
          { title: 'Soutien scolaire', text: 'Du matériel, du tutorat et un cadre d’apprentissage stable.' },
          { title: 'Mentorat', text: 'Des modèles inspirants pour oser viser plus haut.' },
          { title: 'Mobilisation', text: 'Les familles et les communautés impliquées dès le départ.' }
        ],
        ctaLabel: 'Nous contacter',
        ctaLink: '#contact'
      },
      en: {
        category: 'Education',
        date: 'September 2026',
        title: 'Access to education for young girls',
        summary: 'A programme to keep young girls in school and open new perspectives for them.',
        lead: 'This programme brings schools, families and local organisations together around one goal: allowing every girl to study in good conditions and build her future.',
        points: [
          { title: 'Learning support', text: 'Materials, tutoring and a stable learning environment.' },
          { title: 'Mentoring', text: 'Inspiring role models to aim higher.' },
          { title: 'Mobilisation', text: 'Families and communities involved from the start.' }
        ],
        ctaLabel: 'Contact us',
        ctaLink: '#contact'
      }
    },
    /* ▲▲▲ FIN collaboration */

    /* ▼▼▼ DÉBUT collaboration 3 ▼▼▼ */
    {
      enabled: true,                          // true = affichée · false = cachée
      image: 'assets/images/impact/international-advocacy.webp',
      imagePosition: 'center',
      color: '#8a4c19',                       // brun
      fr: {
        category: 'Leadership',
        date: 'Juin 2026',
        title: 'Forum du leadership communautaire',
        summary: 'Un forum pour former, relier et valoriser les leaders qui font avancer leurs communautés.',
        lead: 'Un temps fort qui rassemble des responsables associatifs, institutionnels et communautaires pour partager leurs pratiques, se former et construire des projets communs.',
        points: [
          { title: 'Se former', text: 'Des ateliers pratiques animés par des experts.' },
          { title: 'Se relier', text: 'Un réseau d’acteurs qui continue à travailler ensemble.' },
          { title: 'Agir', text: 'Des projets concrets lancés à l’issue du forum.' }
        ],
        ctaLabel: 'Nous contacter',
        ctaLink: '#contact'
      },
      en: {
        category: 'Leadership',
        date: 'June 2026',
        title: 'Community leadership forum',
        summary: 'A forum to train, connect and recognise the leaders moving their communities forward.',
        lead: 'A key event gathering community, institutional and association leaders to share practices, learn and build joint projects.',
        points: [
          { title: 'Learn', text: 'Hands-on workshops led by experts.' },
          { title: 'Connect', text: 'A network of players who keep working together.' },
          { title: 'Act', text: 'Concrete projects launched after the forum.' }
        ],
        ctaLabel: 'Contact us',
        ctaLink: '#contact'
      }
    },
    /* ▲▲▲ FIN collaboration */
  ]
};

/*
==========================================================================
 ▼▼▼  NE MODIFIEZ RIEN SOUS CETTE LIGNE (moteur de la section)  ▼▼▼
==========================================================================
*/
(function () {
  'use strict';
  var C = window.COLLABORATIONS, d = document, root = d.documentElement;
  var section = d.querySelector('[data-collab]');
  if (!C || !section) return;
  var items = (C.items || []).filter(function (it) { return it && it.enabled !== false; });
  if (C.enabled === false || !items.length) { section.hidden = true; return; }

  var lang = /^fr/i.test(root.lang || '') ? 'fr' : 'en';
  var L = (C.labels && (C.labels[lang] || C.labels.en)) || {};
  var H = (C.head && (C.head[lang] || C.head.en)) || {};
  var row = section.querySelector('[data-collab-row]');
  var mqMobile = window.matchMedia('(max-width:899px)');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var IMG_H = 210;                       // hauteur d'image visible au-dessus du texte (mobile)
  var PER = Math.min(items.length, 3);   // blocs visibles en même temps (ordinateur)
  var page = 0, openCard = null, ro = null, timer = null, inView = false;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rgb(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return '23,103,165';
    var n = parseInt(m[1], 16);
    return (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255);
  }
  function setText(key, v) {
    var el = section.querySelector('[data-collab-' + key + ']');
    if (el && v) el.textContent = v;
  }
  setText('eyebrow', H.eyebrow); setText('title', H.title); setText('intro', H.intro);

  var ARROW = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var BACK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  var FWD = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CROSS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  function card(it, i) {
    var T = it[lang] || it.en || it.fr || {};
    var id = 'collab-' + (i + 1);
    var pts = (T.points || []).map(function (p, k) {
      return '<li><span class="cd-num" aria-hidden="true">' + (k < 9 ? '0' : '') + (k + 1) + '</span><div><h4>' + esc(p.title) + '</h4><p>' + esc(p.text) + '</p></div></li>';
    }).join('');
    return '' +
      '<article class="collab-card" id="' + id + '" tabindex="-1" style="--c:' + esc(it.color || '#1767a5') + ';--c-rgb:' + rgb(it.color) + ';--pos:' + esc(it.imagePosition || 'center') + ';--i:' + i + '">' +
        '<img class="cc-img" src="' + esc(it.image) + '" alt="" decoding="async">' +
        '<span class="cc-shade" aria-hidden="true"></span>' +
        '<div class="cc-rect" aria-hidden="true"></div>' +
        '<div class="cc-top"><span class="cc-cat">' + esc(T.category) + '</span><time class="cc-date">' + esc(T.date) + '</time></div>' +
        '<div class="cc-bottom">' +
          '<h3>' + esc(T.title) + '</h3>' +
          '<div class="cc-summary"><p>' + esc(T.summary) + '</p></div>' +
          '<button class="cc-btn" type="button" aria-expanded="false" aria-controls="' + id + '-detail"><span>' + esc(L.open) + '</span><i>' + ARROW + '</i><span class="sr-only"> : ' + esc(T.title) + '</span></button>' +
        '</div>' +
        '<div class="cc-detail" id="' + id + '-detail" role="region" aria-label="' + esc(T.title) + '" inert>' +
          '<div class="cd-meta"><span class="cc-cat">' + esc(T.category) + '</span><time class="cc-date">' + esc(T.date) + '</time></div>' +
          '<h3 class="cd-title">' + esc(T.title) + '</h3>' +
          '<p class="cd-lead">' + esc(T.lead || T.summary) + '</p>' +
          (pts ? '<ol class="cd-points">' + pts + '</ol>' : '') +
          (T.ctaLabel ? '<div class="cd-actions"><a class="cd-cta" href="' + esc(T.ctaLink || '#contact') + '"><span>' + esc(T.ctaLabel) + '</span><i>' + ARROW + '</i></a></div>' : '') +
        '</div>' +
        '<button class="cc-close" type="button" aria-label="' + esc(L.close) + '" tabindex="-1">' + CROSS + '</button>' +
      '</article>';
  }

  row.innerHTML = '<div class="collab__track" data-collab-track>' + items.map(card).join('') + '</div>';
  var track = row.firstChild;
  var cards = [].slice.call(track.querySelectorAll('.collab-card'));
  row.style.setProperty('--per', PER);
  var maxPage = Math.max(0, items.length - PER);

  /* --- flèches + points (seulement s'il y a plus de 3 collaborations) --- */
  var nav = null, dots = [];
  if (maxPage > 0) {
    nav = d.createElement('div');
    nav.className = 'collab__nav';
    var dh = '';
    for (var k = 0; k <= maxPage; k++) dh += '<button type="button" class="collab__dot" data-page="' + k + '" aria-label="' + (k + 1) + ' / ' + (maxPage + 1) + '"></button>';
    nav.innerHTML = '<div class="collab__dots">' + dh + '</div>' +
      '<div class="collab__arrows"><button type="button" class="collab__arrow" data-dir="-1" aria-label="' + esc(L.prev) + '">' + BACK + '</button>' +
      '<button type="button" class="collab__arrow" data-dir="1" aria-label="' + esc(L.next) + '">' + FWD + '</button></div>';
    row.parentNode.appendChild(nav);
    dots = [].slice.call(nav.querySelectorAll('.collab__dot'));
    nav.addEventListener('click', function (e) {
      var a = e.target.closest('.collab__arrow'), dt = e.target.closest('.collab__dot');
      if (a) go(page + parseInt(a.getAttribute('data-dir'), 10), true);
      else if (dt) go(parseInt(dt.getAttribute('data-page'), 10), true);
    });
  }

  function gapPx() { return parseFloat(getComputedStyle(section).getPropertyValue('--gap')) || 20; }
  function layout() {
    var mob = mqMobile.matches;
    if (mob) { track.style.removeProperty('--shift'); }
    else {
      var cw = (row.clientWidth - (PER - 1) * gapPx()) / PER;
      track.style.setProperty('--shift', (-page * (cw + gapPx())) + 'px');
    }
    cards.forEach(function (c, i) {
      var off = !mob && (i < page || i >= page + PER);
      c.inert = off && !c.classList.contains('is-open');
      c.setAttribute('aria-hidden', off ? 'true' : 'false');
    });
    dots.forEach(function (b, k) { b.setAttribute('aria-current', k === page ? 'true' : 'false'); });
  }
  function go(n, user) {
    if (maxPage < 1) return;
    page = n > maxPage ? 0 : (n < 0 ? maxPage : n);
    layout();
    if (user) restart();
  }

  /* --- défilement automatique : seulement s'il y a plus de 4 collaborations --- */
  var auto = (C.carousel && C.carousel.autoplay === false) ? false : items.length > 4 && !reduce;
  var delay = Math.max(2000, (C.carousel && C.carousel.delay) || 5000);
  function restart() {
    clearInterval(timer); timer = null;
    if (!auto || mqMobile.matches) return;
    timer = setInterval(function () {
      if (openCard || !inView || d.hidden || row.matches(':hover') || section.querySelector(':focus-visible') || (nav && nav.matches(':hover'))) return;
      go(page + 1, false);
    }, delay);
  }

  /* --- hauteur du bloc ouvert sur mobile (le texte décide) --- */
  function fitMobile(c) {
    if (!c) return;
    if (!mqMobile.matches) { c.style.height = ''; c.style.removeProperty('--img-h'); return; }
    var det = c.querySelector('.cc-detail');
    c.style.setProperty('--img-h', IMG_H + 'px');
    c.style.height = (IMG_H + 12 + det.offsetHeight + 12) + 'px';
  }
  var probe = d.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:0;height:var(--h-open)';
  section.appendChild(probe);
  function bringIntoView(c) {
    var r = c.getBoundingClientRect(), top = r.top, vh = window.innerHeight;
    var bottom = mqMobile.matches ? r.bottom : top + probe.offsetHeight;
    if (top < 90 || bottom > vh - 10 || (mqMobile.matches && top > vh * 0.45)) {
      var y = window.pageYOffset + top - 96;
      if (!reduce && window.smoothScrollTo) window.smoothScrollTo(y);
      else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  function open(c) {
    if (openCard === c) return;
    if (openCard) close(openCard, true);
    openCard = c;
    c.inert = false;
    c.classList.add('is-open');
    row.classList.add('has-open');
    if (nav) nav.classList.add('is-hidden');
    c.querySelector('.cc-detail').inert = false;
    c.querySelector('.cc-btn').setAttribute('aria-expanded', 'true');
    c.querySelector('.cc-close').tabIndex = 0;
    fitMobile(c);
    if (window.ResizeObserver) {
      ro = new ResizeObserver(function () { fitMobile(c); });
      ro.observe(c.querySelector('.cc-detail'));
    }
    bringIntoView(c);
    setTimeout(function () { if (openCard === c) c.querySelector('.cc-close').focus({ preventScroll: true }); }, 650);
  }
  function close(c, silent) {
    if (!c || !c.classList.contains('is-open')) return;
    if (ro) { ro.disconnect(); ro = null; }
    c.classList.remove('is-open');
    c.style.height = ''; c.style.removeProperty('--img-h');
    c.querySelector('.cc-detail').inert = true;
    var btn = c.querySelector('.cc-btn');
    btn.setAttribute('aria-expanded', 'false');
    c.querySelector('.cc-close').tabIndex = -1;
    if (openCard === c) openCard = null;
    if (!openCard) { row.classList.remove('has-open'); if (nav) nav.classList.remove('is-hidden'); }
    layout();
    if (!silent) c.focus({ preventScroll: true });
  }

  row.addEventListener('click', function (e) {
    var c = e.target.closest('.collab-card');
    if (!c) return;
    if (e.target.closest('.cc-close')) { close(c); return; }
    if (!c.classList.contains('is-open') && !e.target.closest('.cc-detail')) open(c);
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openCard) close(openCard); });

  var onChange = function () { layout(); if (openCard) fitMobile(openCard); restart(); };
  if (mqMobile.addEventListener) mqMobile.addEventListener('change', onChange); else if (mqMobile.addListener) mqMobile.addListener(onChange);
  if (window.ResizeObserver) new ResizeObserver(function () { layout(); }).observe(row); else window.addEventListener('resize', layout);

  /* --- apparition en cascade quand la section entre à l'écran --- */
  function show() { row.classList.add('is-in'); }
  if ('IntersectionObserver' in window) {
    var seen = false;
    new IntersectionObserver(function (en) {
      inView = en.some(function (x) { return x.isIntersecting; });
      if (inView && !seen) { seen = true; show(); }
    }, { threshold: 0.15 }).observe(row);
  } else { inView = true; show(); }

  layout();
  restart();
})();
