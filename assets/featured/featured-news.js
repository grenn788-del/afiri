/*
==========================================================================
 FEATURED-NEWS.JS : TOUT ce qui concerne le bandeau du haut + la carte
 « Featured news » (juste après l'accueil). Un seul fichier à modifier.
--------------------------------------------------------------------------
 Chemin : assets/featured/featured-news.js   (+ featured-news.css à côté)

 CE QUE VOUS POUVEZ CHANGER (partie 1 à 4 ci-dessous) :
   1. enabled    true = affiché · false = bandeau ET carte cachés
   2. symbol     le symbole animé (bandeau + grand rond de la carte)
   3. theme      couleurs du bandeau, du symbole et du fond de la carte
   4. background image de fond de la carte (ou '' pour un simple dégradé)
   5. en / fr    les textes (anglais pour index.html, français pour fr.html)

 Pour un nouvel événement : changez le symbole, les couleurs, l'image et les
 textes, enregistrez, rechargez la page. Rien d'autre à toucher.
==========================================================================
*/
window.FEATURED_NEWS = {

  /* 1. AFFICHER / CACHER : true ou false */
  enabled: true,

  /* 2. SYMBOLE ANIMÉ
     'ribbon'    ruban de sensibilisation (Octobre rose, santé)
     'heart'     cœur qui bat (solidarité, dons, humanitaire)
     'star'      étoile qui scintille (célébration, distinction, fêtes)
     'megaphone' mégaphone (campagne, appel, plaidoyer)
     'globe'     globe (forum international, journée mondiale)
     'flame'     flamme (mobilisation, urgence, commémoration)
     'leaf'      feuille (environnement, développement durable)
     'trophy'    trophée (prix, remise de distinction)
     'none'      aucun symbole
     Symbole personnalisé : mettez symbol: 'custom' et collez votre SVG dans customSvg. */
  symbol: 'ribbon',
  customSvg: '',   // ex. '<svg viewBox="0 0 24 24"><path d="..."/></svg>' (fill = currentColor)

  /* 3. COULEURS (format #rrggbb) */
  theme: {
    bannerBg: '#7bc8f8',       // fond du bandeau du haut
    bannerText: '#0d2a43',     // texte du bandeau et bouton « Read the details »
    bannerSymbol: '#c2185b',   // couleur du symbole dans le bandeau
    accent: '#f48fb1',         // symbole de la carte + lueurs, vagues et points
    card1: '#8a4c19',          // fond de la carte : 3 couleurs du dégradé
    card2: '#754013',
    card3: '#5f3210'
  },

  /* 4. IMAGE DE FOND DE LA CARTE
     image    chemin de l'image ('' = dégradé de couleurs seul)
     overlay  0 (image très visible) à 1 (couleur opaque) : garder ~0.5 pour que le flou du rectangle se voie
     position 'center', 'top', 'left center'... */
  background: {
    image: 'assets/images/gallery/gallery-community.webp',
    overlay: 0.5,
    position: 'center'
  },

  /* 5. TEXTES : ANGLAIS (index.html) */
  en: {
    banner: {
      label: 'Pink October',
      text: 'Breast cancer awareness month: together for early detection and hope.',
      linkLabel: 'Read the details',
      link: '#news-detail'
    },
    detail: {
      moreLabel: 'Read more',      // bouton qui ouvre les détails
      lessLabel: 'Show less',      // bouton une fois ouvert
      openByDefault: false,        // true = détails déjà ouverts au chargement
      eyebrow: 'Featured news',
      title: 'Pink October: standing together for early detection',
      date: 'October 2026',
      intro: 'Every October, the world unites to raise awareness about breast cancer. Afiri Consulting International joins this movement through its commitment to women’s health, dignity, and empowerment.',
      points: [   // les points numérotés 01, 02, 03... (ajoutez ou retirez des blocs)
        { title: 'Raise awareness', text: 'Sharing clear, trustworthy information about breast health and the importance of regular check-ups.' },
        { title: 'Encourage early detection', text: 'Early screening saves lives. We encourage everyone to know their options and speak with a health professional.' },
        { title: 'Support our communities', text: 'Standing with women, survivors, and families through solidarity, listening, and access to resources.' }
      ],
      ctaLabel: 'Get involved',
      ctaLink: '#contact'
    }
  },

  /* 5. TEXTES : FRANÇAIS (fr.html) */
  fr: {
    banner: {
      label: 'Octobre rose',
      text: 'Mois de sensibilisation au cancer du sein : ensemble pour le dépistage précoce et l’espoir.',
      linkLabel: 'Lire les détails',
      link: '#news-detail'
    },
    detail: {
      moreLabel: 'Lire la suite',
      lessLabel: 'Réduire',
      openByDefault: false,
      eyebrow: 'À la une',
      title: 'Octobre rose : unis pour le dépistage précoce',
      date: 'Octobre 2026',
      intro: 'Chaque mois d’octobre, le monde se mobilise pour sensibiliser au cancer du sein. Afiri Consulting International s’associe à ce mouvement par son engagement pour la santé, la dignité et l’autonomisation des femmes.',
      points: [
        { title: 'Sensibiliser', text: 'Partager une information claire et fiable sur la santé du sein et l’importance des contrôles réguliers.' },
        { title: 'Encourager le dépistage précoce', text: 'Un dépistage précoce sauve des vies. Nous invitons chacun à connaître ses options et à consulter un professionnel de santé.' },
        { title: 'Soutenir nos communautés', text: 'Être aux côtés des femmes, des survivantes et des familles par la solidarité, l’écoute et l’accès aux ressources.' }
      ],
      ctaLabel: 'Nous rejoindre',
      ctaLink: '#contact'
    }
  }
};

/*
==========================================================================
 ▼▼▼  NE MODIFIEZ RIEN SOUS CETTE LIGNE (moteur du bandeau et de la carte)  ▼▼▼
==========================================================================
*/
(function () {
  'use strict';
  var F = window.FEATURED_NEWS, d = document, root = d.documentElement;
  var isFr = /^fr/i.test(root.lang || '');
  var T = (isFr ? F.fr : F.en) || F.en;

  // Branche les textes sur le reste du site (app.js lit SITE_CONFIG.featured)
  if (typeof SITE_CONFIG !== 'undefined') {
    SITE_CONFIG.featured = { enabled: F.enabled !== false, banner: T.banner, detail: T.detail, background: F.background };
  }
  if (F.enabled === false) return;

  // Couleurs : variables CSS lues par featured-news.css
  var th = F.theme || {}, st = root.style;
  function rgb(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return null;
    var n = parseInt(m[1], 16);
    return (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255);
  }
  function put(name, v) { if (v) st.setProperty(name, v); }
  put('--ft-banner-bg', th.bannerBg); put('--ft-banner-text', th.bannerText); put('--ft-banner-symbol', th.bannerSymbol);
  put('--ft-accent', th.accent); put('--ft-accent-rgb', rgb(th.accent));
  put('--ft-card-1', th.card1); put('--ft-card-2', th.card2); put('--ft-card-3', th.card3);
  put('--ft-card-1-rgb', rgb(th.card1)); put('--ft-card-2-rgb', rgb(th.card2)); put('--ft-card-3-rgb', rgb(th.card3));

  // Bibliothèque de symboles (viewBox 24 x 24, couleur = currentColor)
  var SYM = {
    ribbon: '<path d="M12 2.5c-3.600 0-6 2.400-6 5.400 0 2.300 1.300 4 3.200 6.400L12 18l2.800-3.700C16.700 11.900 18 10.200 18 7.900c0-3-2.400-5.400-6-5.400Zm0 2.300c2.100 0 3.600 1.300 3.600 3.100 0 1.400-.8 2.700-2.300 4.600L12 14.200l-1.300-1.700C9.200 10.600 8.400 9.300 8.400 7.900c0-1.800 1.500-3.100 3.600-3.100Z"/><path opacity=".78" d="m9.300 14.600-3.400 6.300c-.4.800.5 1.500 1.200 1l4.900-3.700 4.900 3.700c.7.500 1.600-.2 1.200-1l-3.400-6.300-2.700 3.500-2.700-3.500Z"/>',
    heart: '<path d="M12 21.300s-8-4.800-9.900-9.700C.6 7.700 2.700 4 6.600 4c2 0 3.500 1 4.500 2.600h1.800C13.900 5 15.400 4 17.400 4c3.900 0 6 3.700 4.500 7.600-1.900 4.900-9.900 9.700-9.900 9.700Z"/>',
    star: '<path d="m12 2.200 2.900 6.200 6.800.8-5 4.700 1.300 6.700L12 17.100l-6 3.500 1.300-6.700-5-4.700 6.800-.8L12 2.200Z"/>',
    megaphone: '<path d="M3 9.500v5a1 1 0 0 0 1 1h2.200l1.300 4.500h2.400l-1.300-4.500H10l7 4.200V5.300l-7 4.200H4a1 1 0 0 0-1 1Z"/><path class="ft-w ft-w1" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" d="M19.500 9.300a4 4 0 0 1 0 5.400"/><path class="ft-w ft-w2" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" d="M21.600 6.800a7.500 7.500 0 0 1 0 10.400"/>',
    globe: '<g fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round"><circle cx="12" cy="12" r="9.200"/><path d="M2.800 12h18.400"/><path class="ft-mer" d="M12 2.800c3.200 3 3.200 15.600 0 18.400M12 2.800c-3.200 3-3.200 15.600 0 18.400"/></g>',
    flame: '<path d="M12.400 1.800c.5 3.600 5.300 6 5.300 11.200a5.700 5.700 0 0 1-11.400 0c0-2.400 1.100-3.900 2.300-5.100.2 1.700 1 2.600 2 2.800-.7-3.400.2-6.300 1.800-8.900Z"/><path opacity=".55" fill="#fff" d="M12 21.600a3 3 0 0 1-3-3c0-1.900 1.500-2.800 2.200-4.500.6 1.200 3.800 2.200 3.800 4.500a3 3 0 0 1-3 3Z"/>',
    leaf: '<path d="M20.500 3.500C10.500 3.200 4 8.500 4 15.600c0 1.500.4 3 1.200 4.400 1.400.8 2.900 1.200 4.400 1.200 7.100 0 11.500-6.700 10.900-17.700Z"/><path opacity=".5" fill="none" stroke="#fff" stroke-width="1.400" stroke-linecap="round" d="M5.500 19.500c3-5.500 6.500-8.700 11-11"/>',
    trophy: '<path d="M7 3.500h10v5.800a5 5 0 0 1-10 0V3.500Z"/><path fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" d="M7 5.500H3.800v1.200A3.300 3.300 0 0 0 7 10m10-4.500h3.200v1.200A3.300 3.300 0 0 1 17 10M12 14.200v3.600M8 20.500h8"/><path d="M9.500 17.500h5l.8 3h-6.600l.8-3Z"/>'
  };
  var name = F.symbol || 'none';
  var inner = name === 'custom' ? '' : (SYM[name] || '');
  function build() {
    if (name === 'custom' && F.customSvg) {
      var t = d.createElement('div'); t.innerHTML = F.customSvg;
      var s = t.querySelector('svg'); if (!s) return '';
      s.setAttribute('class', 'ft-svg'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
      s.innerHTML = '<g class="ft-g">' + s.innerHTML + '</g>';
      return s.outerHTML;
    }
    if (!inner) return '';
    return '<svg class="ft-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><g class="ft-g">' + inner + '</g></svg>';
  }
  var svg = build();
  root.setAttribute('data-ft-symbol', svg ? name : 'none');
  [].slice.call(d.querySelectorAll('[data-ft-symbol]')).forEach(function (n) {
    if (n === root) return;
    if (svg) n.innerHTML = svg; else if (n.parentNode) n.parentNode.removeChild(n);
  });
})();
