/*
==========================================================================
 ZONE DE CONFIGURATION : AFIRI CONSULTING INTERNATIONAL
 C'est le SEUL fichier à modifier pour changer images, textes dynamiques,
 projets d'actualité, galerie, distinctions et coordonnées.
 Le reste du code (HTML, CSS, app.js) est commenté section par section,
 mais n'a normalement pas besoin d'être touché.
==========================================================================

 PLAN GÉNÉRAL
 ------------
 0. Structure des dossiers
 1. Activer / désactiver la section « Projets d'actualité / Urgences »
 2. Ajouter, modifier ou supprimer un projet d'actualité
 3. Remplacer une image existante
 4. Ajouter une photo à la galerie
 5. Ajouter une distinction (awards), un domaine d'impact, un partenaire
 6. Modifier les phrases animées du Hero
 7. Modifier coordonnées, réseaux sociaux, liens légaux
 8. Modifier les textes fixes (titres, biographie, etc.)
 9. Règles d'optimisation des images (performance mobile)

 0. STRUCTURE DES DOSSIERS
 -------------------------
 index.html
 assets/
   css/style.css
   js/config.js        <- ce fichier
   js/boot.js          (détection du mode d'animation, ne pas modifier)
   js/app.js           (logique du site, ne pas modifier)
   images/
     brand/            logos (Afiri, GreenLab Design)
     hero/             image d'accueil (version bureau + version mobile)
     about/            image de la section « À propos »
     leadership/       portraits de la direction et du contributeur créatif
     awards/           diplômes, citations, certificats
     impact/           photos des six domaines d'impact
     gallery/          photos de la galerie
     partners/         logos des institutions partenaires

 1. ACTIVER / DÉSACTIVER LA SECTION D'ACTUALITÉ
 ----------------------------------------------
 Ligne « const SHOW_URGENT_SECTION » ci-dessous :
   true   -> la section s'affiche juste après l'accueil, avec son lien
             dans le menu.
   false  -> la section et son lien de menu disparaissent entièrement.
 La section se masque aussi toute seule si la liste « projects » est vide.

 2. AJOUTER UN PROJET D'ACTUALITÉ
 --------------------------------
 a) Déposez la photo dans assets/images/impact/ (HD : 1920 à 2560 px de large,
    format .jpg). Exemple : project-04.jpg
 b) Dans « urgent.projects » plus bas, copiez un bloc { ... }, collez-le
    à la suite (sans oublier la virgule entre deux blocs) et modifiez :
      status        'urgent' (pastille rouge + point pulsé),
                    'ongoing' (bleu) ou 'news' (vert)
      label         texte de la pastille (ex. 'Urgent', 'In progress')
      title         titre du projet
      summary       résumé court (2 à 3 phrases maximum)
      date          'AAAA-MM-JJ' (affichée automatiquement), ou un texte
                    libre comme 'Ongoing'. Laissez '' pour ne rien afficher.
      location      lieu (laissez '' pour ne rien afficher)
      progress      nombre de 0 à 100 (barre d'avancement). Supprimez la
                    ligne « progress » pour ne pas afficher de barre.
      progressLabel texte au-dessus de la barre (ex. 'Funding secured')
      image         chemin de la photo (ex. 'assets/images/impact/project-04.jpg')
      imageAlt      description de l'image pour l'accessibilité
      link          lien du bouton ('#contact' ou une adresse https://...)
      linkLabel     texte du bouton
 c) Pour supprimer un projet : effacez tout son bloc { ... } et la virgule.
 d) Affichage : 1 à 3 projets en grille ; sur mobile, les cartes défilent
    horizontalement au doigt.
 e) Les trois projets fournis sont des EXEMPLES (titres « Example: ... ») :
    remplacez-les avant la mise en ligne.

 3. REMPLACER UNE IMAGE EXISTANTE
 --------------------------------
 Le plus simple : gardez le même nom de fichier et écrasez l'ancien
 fichier dans son dossier. Sinon, déposez la nouvelle image dans le bon
 dossier et changez le chemin correspondant dans « images » ci-dessous.
 Image d'accueil : une seule image HD (2560 px de large) pour tous les
 appareils. Laissez mobile: '' (une version allégée est possible mais
 n'est plus utilisée).

 4. AJOUTER UNE PHOTO À LA GALERIE
 ---------------------------------
 Déposez la photo dans assets/images/gallery/, puis ajoutez un bloc dans
 « gallery » (src, alt, title, category). La mise en page s'adapte seule :
 une photo large toutes les cinq photos, aucune autre retouche nécessaire.

 5. DISTINCTIONS, IMPACT, PARTENAIRES
 ------------------------------------
 awards    : { src, title }. Image dans assets/images/awards/
 impact    : { icon, image, alt, title, text, details, points }.
             « details » = paragraphes affichés à l'ouverture de la carte,
             « points » = liste à puces (facultatifs). Icônes disponibles :
             'education', 'rights', 'women', 'leadership',
             'humanitarian', 'community'
 partners  : { src, name }. Logo dans assets/images/partners/
             (fond transparent recommandé, format .png)
 Si vous ajoutez un domaine d'impact, ajoutez aussi son nom dans la liste
 déroulante du formulaire (index.html, balise <select name="interest">).

 6. PHRASES ANIMÉES DU HERO
 --------------------------
 Modifiez la liste « heroPhrases ». Sur ordinateur et tablette elles
 défilent ; sur mobile seule la première reste affichée (fluidité).

 7. COORDONNÉES, RÉSEAUX, LIENS LÉGAUX
 -------------------------------------
 Bloc « site » : e-mail, téléphone, lieu, adresse du script du formulaire
 (Formspree), liens FR/EN, pages légales, crédit du pied de page.
 Bloc « socials » : un bloc par réseau (icon : 'linkedin', 'facebook',
 'instagram' ou 'x'). Utilisé dans la section direction et le pied de page.

 8. TEXTES FIXES
 ---------------
 Les textes qui ne sont pas dans ce fichier sont directement dans
 index.html. Repérez-les par l'identifiant de leur section :
   #home (accueil) · #about (à propos + valeurs) · section approche
   (4 étapes) · #leadership (direction + biographie) · section créative
   (contributeur) · #contact (titre, texte).
 Modifiez uniquement le texte entre les balises, jamais les balises.

 10. BANDEAU DU HAUT + CARTE MARRON « FEATURED NEWS » : DÉPLACÉ
 --------------------------------------------------
 TOUT se règle maintenant dans assets/featured/featured-news.js (textes FR/EN,
 symbole animé, couleurs, image de fond, interrupteur). Ce qui suit est obsolète.
 ACTIVER / DÉSACTIVER à tout moment : const SHOW_FEATURED_NEWS (true / false)
 tout en haut de ce fichier. Les textes restent enregistrés : il suffit de
 repasser à true pour tout réafficher.
 Bloc « featured » ci-dessous (ex. : Octobre Rose) :
   banner.arrows  true / false : flèches animées du bandeau du haut
   background     image de la carte marron : { image, overlay, position }
                  (image: '' = dégradé marron seul ; overlay 0 à 1)
   enabled        piloté par SHOW_FEATURED_NEWS (ne pas modifier ici)
   banner         texte du bandeau (label en gras, text, lien « linkLabel »
                  qui mène à « link », par défaut #news-detail)
   detail         contenu de la carte : eyebrow, title, date, intro,
                  points (liste de { title, text }), ctaLabel, ctaLink
 Les textes fournis sont des EXEMPLES à adapter avant la mise en ligne.

 11. IMAGES DE FOND « À PROPOS »
 -------------------------------
 Liste « images.aboutSlides » : 3 photos (ou plus) qui défilent en fondu
 derrière le texte, sur fond bleu. Remplacez les chemins pour changer.

 12. AJOUTER UN LEADER
 --------------------
 Dans la liste « leaders » : copiez un bloc { ... } complet, collez-le à la
 suite (virgule entre deux blocs) et modifiez-le. La carte (photos à gauche,
 cadre coloré à droite) est créée automatiquement.
   id        identifiant unique (sans espace), ex. 'cfo'
   theme     couleur du cadre : 'blue', 'green' ou 'brown'
   eyebrow   petit titre au-dessus ; heading : grand titre (ou '')
   name      nom ; titles : liste de titres (pastilles)
   summary   présentation courte ; bio : paragraphes « Read full biography »
             (liste vide [] = pas de bouton)
   photos    1 ou 2 photos { src, alt } (dossier assets/images/leadership/)
   logo      { src, alt, url } ou null : badge en bas de la photo
   links     boutons : { label, url, icon } avec icon 'portfolio', 'email',
             'whatsapp' ou 'link'
   socials   true = affiche les réseaux du bloc « socials » ; false = non

 14. IMAGES D'ACCUEIL SUPPLÉMENTAIRES
 ------------------------------------
 « images.heroSlides » est VIDE par défaut : l'image d'accueil seule s'affiche
 avec un zoom animé. Ajoutez des chemins pour obtenir un diaporama en fondu
 (chaque image garde son zoom). « heroSlideInterval » = durée en millisecondes.

 15. HERO 3D (ACCUEIL)
 --------------------
 Interrupteur SHOW_HERO_3D en haut ; réglages dans le bloc « hero3d » ;
 textes dans « heroStages » ; la forme de chaque icône est dans hero3d.js
 (liste de rectangles). Sur mobile et tablette : version 2D simple.

 13. LANGUES (TRADUCTION GOOGLE)
 -------------------------------
 Bloc « languages » ci-dessous. L'anglais est la version native du site.
   native  true  -> langue native : le visiteur est redirigé vers la page
                    « url » (ex. fr.html = version française hors ligne,
                    sans Google ; index.html = version anglaise) ;
                    sans url, retour à l'anglais d'origine.
   native  false -> traduite automatiquement par Google Translate
                    (le script Google ne se charge que si le visiteur
                    choisit une de ces langues).
 Pour ajouter une langue : copiez une ligne et mettez son code Google
 (es, pt, de, it, zh-CN, ja, ar, ru, hi, sw, tr, nl, ko, ...).
 Pour désactiver la traduction : translate.enabled = false.
 Fonctionne uniquement en ligne (hébergement http/https), pas en ouvrant
 le fichier directement depuis l'ordinateur.

 9. QUALITÉ DES IMAGES
 --------------------
 Toutes les images sont en HD, sur tous les appareils : photos .jpg de 1920 à
 2560 px de large, qualité 85 à 90. Pas de version allégée.
 .png uniquement pour les logos.
==========================================================================
*/

/*
==========================================================================
 0. INTERRUPTEURS : activer / désactiver une partie du site en un mot
    true  = affichée      false = retirée entièrement (code et menu)
==========================================================================
*/
// (Bandeau du haut + carte « Featured news » : interrupteur dans assets/featured/featured-news.js)
// Section « Latest news » (projets d'actualité)
const SHOW_URGENT_SECTION = false;
// Icônes 3D en rectangles de l'accueil (version 2D simple sur mobile)
const SHOW_HERO_3D = true;

// Toute la configuration du site, regroupée dans un seul objet
const SITE_CONFIG = {

  // Coordonnées, formulaire, liens FR/EN, pages légales et crédit du pied de page
  site: {
    name: 'Afiri Consulting International',
    email: 'contact@afiriconsulting.com',
    phone: '+1 202 297 2212',
    location: 'Worldwide',
    // FORMSPREE : remplacez VOTRE_FORM_ID par l'identifiant du formulaire créé sur formspree.io
    // (URL https://formspree.io/f/xxxxxxxx -> l'identifiant est « xxxxxxxx »).
    // L'adresse qui reçoit les messages (contact@afiriconsulting.com) se règle dans Formspree, onglet Settings du formulaire.
    formspree: { id: 'VOTRE_FORM_ID' },
    languageLinks: {
      en: 'index.html',
      fr: 'fr.html'
    },
    legal: {
      privacy: 'privacy.html',
      terms: 'terms.html'
    },
    credit: { label: 'GreenLab Design', url: 'https://www.greenlabdesign.tech' }
  },

  // Réseaux sociaux (affichés dans Contact et dans la section direction)
  socials: [
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/h-e-amb-dr-antoinette-carole-grace-m-79788834' },
    { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/blessedmac' },
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/carolegracembarga/' },
    { name: 'X', icon: 'x', url: 'https://x.com/profgracembarga' }
  ],

  // Traduction automatique Google : enabled = true/false
  translate: { enabled: true, pageLanguage: 'en' },

  // Langues proposées dans le menu (native = true : version propre au site ; sinon traduite par Google)
  languages: [
    { code: 'en', label: 'English', short: 'EN', native: true },
    { code: 'fr', label: 'Français', short: 'FR', native: true, url: 'fr.html' },
    { code: 'es', label: 'Español', short: 'ES' },
    { code: 'pt', label: 'Português', short: 'PT' },
    { code: 'de', label: 'Deutsch', short: 'DE' },
    { code: 'it', label: 'Italiano', short: 'IT' },
    { code: 'nl', label: 'Nederlands', short: 'NL' },
    { code: 'ar', label: 'العربية', short: 'AR' },
    { code: 'zh-CN', label: '中文', short: 'ZH' },
    { code: 'ja', label: '日本語', short: 'JA' },
    { code: 'ko', label: '한국어', short: 'KO' },
    { code: 'ru', label: 'Русский', short: 'RU' },
    { code: 'hi', label: 'हिन्दी', short: 'HI' },
    { code: 'sw', label: 'Kiswahili', short: 'SW' },
    { code: 'tr', label: 'Türkçe', short: 'TR' }
  ],

  // Phrases qui défilent sur les vagues colorées de l'accueil
  heroPhrases: [
    'Transformational Leadership',
    'Human Rights & Advocacy',
    'Women’s Empowerment',
    'Humanitarian Action',
    'Community & International Development',
    'Inclusive Education'
  ],

  /* Animation d'accueil : les 3 formes du bas apparaissent une par une.
     Chaque étape : zone ('light' | 'blue' | 'gold'), kicker (petit titre),
     title (texte principal), text (phrase courte). Ordre = ordre d'apparition. */
  heroStages: [
    { zone: 'light', kicker: 'Strategy', title: 'Transformational Leadership', text: 'Purpose turned into clear priorities and a roadmap.' },
    { zone: 'blue', kicker: 'Advocacy', title: 'Human Rights & Advocacy', text: 'Inclusive policy and community voices, side by side.' },
    { zone: 'gold', kicker: 'Impact', title: 'Women’s Empowerment', text: 'Lasting change, built with and for people.' }
  ],

  /* ======================================================================
     HERO 3D : icônes d'accueil faites de rectangles (script : hero3d.js)
     Désactiver complètement : SHOW_HERO_3D = false en haut du fichier.
     Les textes (kicker, title, text) viennent de « heroStages » ci-dessus.
     Couleurs et tailles : style.css, bloc « HERO 3D » (variables --h3d-...).
     ====================================================================== */
  hero3d: {
    layers: 6,          // épaisseur du relief (3D ordinateur) : 3 = léger, 8 = très épais
    barThickness: 4.4,  // épaisseur des rectangles (sur une grille de 100)
    start: 600,         // délai avant la première icône (ms)
    step: 3800,         // temps entre deux icônes (ms)
    hold: 2700,         // durée d'affichage d'une icône (ms)
    show: 7500          // durée où les 3 vagues restent visibles à la fin (ms)
  },

  // Chemins des images principales (logo, accueil, à propos)
  images: {
    logo: 'assets/images/brand/afiri-logo-original.webp',
    hero: {
      desktop: 'assets/images/hero/hero-consulting.webp',
      mobile: ''   // vide = la même image HD sur tous les appareils
    },
    /* Images supplémentaires de l'accueil (diaporama en fondu avec zoom dynamique).
       VIDE par défaut : seule l'image « hero » ci-dessus s'affiche, avec son zoom animé.
       Pour ajouter des images, déposez-les dans assets/images/hero/ puis écrivez
       leur chemin, par exemple :
         heroSlides: ['assets/images/hero/hero-2.jpg', 'assets/images/hero/hero-3.jpg'],
       (ou { desktop: '...', mobile: '...' } pour une version mobile allégée). */
    heroSlides: [],
    /* Durée d'affichage de chaque image du diaporama, en millisecondes. */
    heroSlideInterval: 7000,
    about: 'assets/images/about/about-afiri.webp',
    aboutSlides: [
      'assets/images/about/about-afiri.webp',
      'assets/images/gallery/gallery-leadership.webp',
      'assets/images/gallery/gallery-community.webp'
    ]
  },

  // Cartes de direction (voir mode d'emploi n° 12 plus haut)
  leaders: [
    {
      id: 'leadership',
      theme: 'blue',
      eyebrow: 'Executive leadership',
      heading: 'Leadership with a global horizon',
      name: 'H.E. Dr. Antoinette Carole Grace Mbarga',
      titles: [
        'United Nations Global Peace Ambassador',
        'Entrepreneur and Humanitarian',
        'Human Rights and Women’s Empowerment Advocate',
        'International Author',
        'Public Speaker'
      ],
      summary: 'Born and raised in Cameroon, Dr. Mbarga has built an international career at the intersection of human rights, education, women’s empowerment, peacebuilding, and community development. Her leadership connects lived experience with the institutional insight required to turn advocacy into practical action.',
      bio: [
        'Her path from Cameroon to the United States has shaped a distinctly cross-cultural perspective. She has worked with communities navigating migration, social exclusion, domestic violence, human trafficking, and unequal access to opportunity—bringing dignity, cultural intelligence, and a rights-based lens to each engagement.',
        'Dr. Mbarga champions girls’ education in rural communities, women entrepreneurs, African immigrant rights, and the development of emerging leaders. She has participated in international forums bringing together governments, universities, nonprofit organizations, business leaders, and community institutions across several continents.',
        'As an international author, public speaker, entrepreneur, and humanitarian leader, she advances policy conversations and community initiatives that promote equity, inclusion, peace, and sustainable development. Her advocacy against feminicide in Cameroon reflects a wider commitment to protection, accountability, and systemic change.'
      ],
      photos: [
        { src: 'assets/images/leadership/ceo-dr-mbarga-office.webp', alt: 'H.E. Dr. Antoinette Carole Grace Mbarga' },
        { src: 'assets/images/leadership/ceo-dr-mbarga.webp', alt: 'Portrait of H.E. Dr. Antoinette Carole Grace Mbarga' }
      ],
      logo: null,
      links: [],
      socials: true
    },
    {
      id: 'manager',
      theme: 'brown',
      eyebrow: 'Management',
      heading: '',
      name: 'Bassale Samuel Eric Alonso',
      titles: [
        'President of the Family charity association',
        'Managing Director of the Abeng Henriette Foundation',
        'Operations Manager, NOUNJI Foundation (Miss Cameroon 2024)',
        'CEO of the ORPHAN Never Alone (ONA) Challenge'
      ],
      summary: 'Born in Douala and raised in Yaoundé, Cameroon, Mr. Bassale Eric is passionate about football and humanitarian work. He has built a career supporting disadvantaged communities, educating orphans, and assisting the sick, widows, and others in need. His leadership, experience, and knowledge have enabled him to manage several associations, notably the field actions of Miss Universe 2024 and her NOUNJI Foundation.',
      bio: [
        'His years working with associations and orphanages led him to found his own charity six years ago, to stand with disadvantaged communities, and to work against gender-based violence through preventive measures: free training for women, seminars, and conferences.',
        'His fight against the lack of basic necessities in Cameroon reflects a wider commitment to protection, accountability, and systemic change.'
      ],
      photos: [
        { src: 'assets/images/leadership/manager.webp', alt: 'Portrait of Bassale Samuel Eric Alonso' }
      ],
      logo: null,
      links: [
        { label: 'Facebook', url: 'https://www.facebook.com/eric.alonso.3954', icon: 'facebook' }
      ],
      socials: false
    },
    {
      id: 'creative',
      theme: 'green',
      eyebrow: 'Creative and Design Contributor',
      heading: '',
      name: 'Brillant Gislain Diffo',
      titles: ['Design Consultant', 'Brand and Packaging Designer', 'Web Designer', 'Web Developer', 'Founder of GreenLab Design'],
      summary: 'Brillant Gislain Diffo is a graphic designer and the founder of GreenLab Design, a creative agency specialized in visual identity. Drawing on solid design experience, he supports Afiri Consulting International on the creative dimension of selected projects.',
      bio: [
        'Within Afiri Consulting International, Brillant Gislain Diffo leads creative work in all its forms: visual identity, communication materials, packaging, web design, web development, and online presence. He combines the rigor of a designer with the technical command of a developer, which allows him to follow a project from the first idea to its launch online, with the same consistency at every stage.',
        'He translates Afiri’s mission and values into a clear, consistent, and credible image for its partners and its audiences.'
      ],
      photos: [
        { src: 'assets/images/leadership/brillant-gislain-diffo.webp', alt: 'Portrait of Brillant Gislain Diffo' }
      ],
      logo: { src: 'assets/images/brand/greenlab-design.webp', alt: 'GreenLab Design', url: 'https://www.greenlabdesign.tech/' },
      links: [
        { label: 'Portfolio', url: 'https://www.greenlabdesign.tech/', icon: 'portfolio' },
        { label: 'Email', url: 'mailto:contact@afiriconsulting.com', icon: 'email' },
        { label: 'WhatsApp', url: 'https://wa.me/237671008373', icon: 'whatsapp' }
      ],
      socials: false
    }
  ],

  // Bandeau du haut + carte « Featured news » : tout se règle dans assets/featured/featured-news.js

  // Section « Latest news » : projets d'actualité (voir n° 1 et 2)
  urgent: {
    eyebrow: 'Latest news & urgent projects',
    title: 'What we are working on right now',
    intro: 'Follow the initiatives, emergencies and milestones currently mobilizing our team and partners.',
    projects: [
      {
        status: 'urgent',
        label: 'Urgent',
        title: 'Example: Urgent humanitarian response',
        summary: 'Replace this text with a short description of the situation, what is needed right now and who to contact.',
        date: '2026-10-20',
        location: 'Location',
        progress: 62,
        progressLabel: 'Support mobilized',
        image: 'assets/images/impact/human-rights.webp',
        imageAlt: 'Community members joining hands in solidarity',
        link: '#contact',
        linkLabel: 'Support this project'
      },
      {
        status: 'ongoing',
        label: 'In progress',
        title: 'Example: Girls’ education campaign',
        summary: 'Replace this text with the goals, the current phase and the next milestone of the project.',
        date: '2026-10-12',
        location: 'Location',
        progress: 35,
        progressLabel: 'Phase 1 completed',
        image: 'assets/images/impact/education.webp',
        imageAlt: 'A team reviewing educational program materials',
        link: '#contact',
        linkLabel: 'Get involved'
      },
      {
        status: 'news',
        label: 'News',
        title: 'Example: International advocacy briefing',
        summary: 'Replace this text with a short news update, an upcoming event or a recent announcement.',
        date: '2026-10-05',
        location: 'Online',
        image: 'assets/images/impact/international-advocacy.webp',
        imageAlt: 'Professionals forming an international partnership',
        link: '#contact',
        linkLabel: 'Learn more'
      }
    ]
  },

  // Distinctions : diplômes et citations (voir n° 5)
  awards: [
    { src: 'assets/images/awards/governor-citation.webp', title: 'Maryland Governor’s Citation', short: 'Governor’s Citation', tag: 'Maryland' },
    { src: 'assets/images/awards/general-assembly-citation.webp', title: 'Maryland General Assembly Official Citation', short: 'General Assembly Citation', tag: 'Maryland' },
    { src: 'assets/images/awards/bell-seal-2023.webp', title: 'Mental Health America — Bronze, 2023', short: 'Bronze Bell Seal', tag: 'MHA · 2023' },
    { src: 'assets/images/awards/bell-seal-2024.webp', title: 'Mental Health America — Bronze, 2024', short: 'Bronze Bell Seal', tag: 'MHA · 2024' }
  ],

  /* Section « Prestige » (au-dessus de Awards) : anneaux dorés, textes en orbite.
     Elle se remplit TOUTE SEULE à partir de la liste « awards » ci-dessus :
     chaque distinction ajoutée apparaît en orbite (champs facultatifs :
     short = titre court, tag = petite mention comme « Maryland · 2025 »),
     et le compteur se met à jour. Les mots des anneaux : ringWords. */
  prestige: {
    ringWords: ['Excellence', 'Integrity', 'Leadership', 'Impact', 'Recognition'],
    countLabel: 'Awards & citations',
    hint: 'Tap an award to see the document',
    eyebrow: 'Prestige & recognition',
    title: 'Recognized for',
    titleGold: 'impact that lasts',
    intro: 'Citations and seals received for leadership, advocacy, and community impact: each one a milestone in a shared journey toward dignity and progress.',
    cta: 'See the awards'
  },

  // Six domaines d'impact (voir n° 5)
  impact: [
    { icon: 'education', image: 'assets/images/impact/education.webp', alt: 'A team reviewing educational program materials', title: 'Education', text: 'Inclusive learning strategy, program design, and pathways for youth opportunity.', details: ['We help institutions, schools, and community programs design learning strategies that are inclusive, measurable, and grounded in local realities.', 'From curriculum frameworks to youth pathways, our work connects what is taught with the opportunities young people can actually reach.'], points: ['Program and curriculum design', 'Youth opportunity pathways', 'Capacity building for educators and leaders'] },
    { icon: 'rights', image: 'assets/images/impact/human-rights.webp', alt: 'Community members joining hands in solidarity', title: 'Human rights & advocacy', text: 'Rights-based analysis, public policy insight, and advocacy that turns community priorities into action. We connect local priorities with institutions and global conversations.', details: ['Our rights-based analysis helps organizations understand the legal, social, and political context in which they work.', 'We translate community priorities into clear advocacy messages and policy recommendations that decision-makers can act on.'], points: ['Rights-based analysis', 'Policy insight and briefings', 'Advocacy strategy and campaigns'] },
    { icon: 'women', image: 'assets/images/impact/women-empowerment.webp', alt: 'Two women collaborating at a laptop', title: 'Women’s empowerment', text: 'Programs that expand voice, safety, leadership, and economic agency.', details: ['We support programs that expand women’s voice, safety, leadership, and economic agency, with approaches shaped alongside the women they serve.', 'Our guidance connects individual empowerment to the institutional change that makes progress last.'], points: ['Leadership and mentoring programs', 'Safety and protection strategies', 'Economic empowerment pathways'] },
    { icon: 'leadership', image: 'assets/images/impact/leadership.webp', alt: 'Business leaders greeting one another', title: 'Transformational leadership', text: 'Values-led leadership development for resilient people and organizations.', details: ['Transformational leadership starts with values. We accompany leaders and teams as they clarify purpose, build trust, and make hard choices well.', 'Our approach strengthens resilience at both the personal and the organizational level.'], points: ['Leadership development', 'Advisory and coaching', 'Organizational resilience'] },
    { icon: 'humanitarian', image: 'assets/images/impact/international-advocacy.webp', alt: 'Professionals forming an international partnership', title: 'Humanitarian action', text: 'Human-centered planning for urgent needs and long-term recovery.', details: ['We provide human-centered planning for urgent needs, with attention to dignity, coordination, and what comes after the emergency.', 'Our guidance links immediate response with long-term recovery so that support strengthens people rather than replacing them.'], points: ['Needs assessment and response planning', 'Partner coordination', 'Recovery and transition strategy'] },
    { icon: 'community', image: 'assets/images/impact/community-development.webp', alt: 'A diverse group linking arms in a circle', title: 'Community & international development', text: 'Participatory strategies that strengthen local capacity and connect initiatives across borders.', details: ['Participatory strategies place community knowledge at the center of development, so that solutions are owned locally and connected globally.', 'We help organizations build local capacity while linking communities to international partners and resources.'], points: ['Participatory planning', 'Local capacity strengthening', 'International partnerships'] }
  ],

  // Photos de la galerie (voir n° 4)
  gallery: [
    { src: 'assets/images/gallery/gallery-leadership.webp', alt: 'Professionals discussing a digital presentation', title: 'International Leadership Forum', category: 'Leadership' },
    { src: 'assets/images/gallery/gallery-community.webp', alt: 'A collaborative team meeting in a bright office', title: 'Community Outreach Initiative', category: 'Community' },
    { src: 'assets/images/impact/women-empowerment.webp', alt: 'Two women sharing ideas at a laptop', title: 'Women’s Empowerment Program', category: 'Empowerment' },
    { src: 'assets/images/gallery/gallery-operations.webp', alt: 'A focused workspace prepared for program delivery', title: 'Education and Youth Development', category: 'Education' },
    { src: 'assets/images/gallery/gallery-global-forum.webp', alt: 'A community gathering at sunset', title: 'Global Advocacy Event', category: 'Global advocacy' }
  ],

  // Logos du bandeau défilant « Global ecosystem » (voir n° 5)
  partners: [
    { src: 'assets/images/partners/united-nations.webp', name: 'United Nations' },
    { src: 'assets/images/partners/unicef.webp', name: 'UNICEF' },
    { src: 'assets/images/partners/mbarga-project.webp', name: 'The Mbarga Project' },
    { src: 'assets/images/partners/family.webp', name: 'Family' },
    { src: 'assets/images/partners/foundation-abeng-henriette.webp', name: 'Fondation Abeng Henriette' }
  ]
};
