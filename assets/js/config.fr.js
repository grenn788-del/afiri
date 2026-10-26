/*
==========================================================================
 CONFIGURATION FRANÇAISE : AFIRI CONSULTING INTERNATIONAL
 Version NATIVE du site (fr.html) : tous les textes sont écrits en français,
 sans Google Translate pour le français. C'est le pendant de config.js (anglais).
 Même structure, mêmes images : voir le mode d'emploi détaillé en haut de
 config.js. Pour modifier un texte français, changez-le ici ou dans fr.html.
 Les autres langues du menu (espagnol, portugais, etc.) restent traduites
 automatiquement par Google, à partir de cette page française.
==========================================================================
*/

/*
==========================================================================
 0. INTERRUPTEURS : activer / désactiver une partie du site en un mot
    true  = affichée      false = retirée entièrement (code et menu)
==========================================================================
*/
// (Bandeau du haut + carte « Featured news » : interrupteur dans assets/featured/featured-news.js)
// Section « Dernières nouvelles » (projets d'actualité)
const SHOW_URGENT_SECTION = false;
// Icônes 3D en rectangles de l'accueil (version 2D simple sur mobile)
const SHOW_HERO_3D = true;

const SITE_CONFIG = {

  site: {
    name: 'Afiri Consulting International',
    email: 'contact@afiriconsulting.com',
    phone: '+1 202 297 2212',
    location: 'Dans le monde entier',
    // FORMSPREE : remplacez VOTRE_FORM_ID par l'identifiant du formulaire créé sur formspree.io
    // (URL https://formspree.io/f/xxxxxxxx -> l'identifiant est « xxxxxxxx »).
    // L'adresse qui reçoit les messages (contact@afiriconsulting.com) se règle dans Formspree, onglet Settings du formulaire.
    formspree: { id: 'VOTRE_FORM_ID' },
    languageLinks: { en: 'index.html', fr: 'fr.html' },
    legal: { privacy: 'privacy-fr.html', terms: 'terms-fr.html' },
    credit: { label: 'GreenLab Design', url: 'https://www.greenlabdesign.tech' }
  },

  socials: [
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/h-e-amb-dr-antoinette-carole-grace-m-79788834' },
    { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/blessedmac' },
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/carolegracembarga/' },
    { name: 'X', icon: 'x', url: 'https://x.com/profgracembarga' }
  ],

  // Le français est la langue de la page : Google ne traduit qu'à partir de celle-ci vers les autres langues
  translate: { enabled: true, pageLanguage: 'fr' },

  languages: [
    { code: 'fr', label: 'Français', short: 'FR', native: true },
    { code: 'en', label: 'English', short: 'EN', native: true, url: 'index.html' },
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

  // Textes générés par le script (boutons, étiquettes d'accessibilité)
  ui: {
    image: 'Image',
    learnMore: 'En savoir plus',
    socialProfiles: 'Profils sur les réseaux sociaux',
    readBio: 'Lire la biographie complète',
    hideBio: 'Masquer la biographie complète',
    openDocument: 'Ouvrir le document :',
    openItem: 'Ouvrir :',
    openImage: 'Ouvrir l’image :',
    prev: 'Précédent',
    next: 'Suivant',
    close: 'Fermer',
    impactArea: 'Domaine d’impact'
  },

  heroPhrases: [
    'Leadership transformationnel',
    'Droits humains et plaidoyer',
    'Autonomisation des femmes',
    'Action humanitaire',
    'Développement communautaire et international',
    'Éducation inclusive'
  ],

  heroStages: [
    { zone: 'light', kicker: 'Stratégie', title: 'Leadership transformationnel', text: 'Une vision traduite en priorités claires et en feuille de route.' },
    { zone: 'blue', kicker: 'Plaidoyer', title: 'Droits humains et plaidoyer', text: 'Politiques inclusives et voix des communautés, côte à côte.' },
    { zone: 'gold', kicker: 'Impact', title: 'Autonomisation des femmes', text: 'Un changement durable, construit avec et pour les personnes.' }
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

  images: {
    logo: 'assets/images/brand/afiri-logo-original.webp',
    hero: {
      desktop: 'assets/images/hero/hero-consulting.webp',
      mobile: ''   // vide = la même image HD sur tous les appareils
    },
    heroSlides: [],
    heroSlideInterval: 7000,
    about: 'assets/images/about/about-afiri.webp',
    aboutSlides: [
      'assets/images/about/about-afiri.webp',
      'assets/images/gallery/gallery-leadership.webp',
      'assets/images/gallery/gallery-community.webp'
    ]
  },

  leaders: [
    {
      id: 'leadership',
      theme: 'blue',
      eyebrow: 'Direction exécutive',
      heading: 'Un leadership à l’horizon mondial',
      name: 'S.E. Dre Antoinette Carole Grace Mbarga',
      titles: [
        'Ambassadrice mondiale de la paix des Nations Unies',
        'Entrepreneure et humanitaire',
        'Défenseure des droits humains et de l’autonomisation des femmes',
        'Auteure internationale',
        'Conférencière'
      ],
      summary: 'Née et élevée au Cameroun, la Dre Mbarga a construit une carrière internationale à la croisée des droits humains, de l’éducation, de l’autonomisation des femmes, de la consolidation de la paix et du développement communautaire. Son leadership allie expérience vécue et connaissance des institutions pour transformer le plaidoyer en actions concrètes.',
      bio: [
        'Son parcours du Cameroun aux États-Unis lui a donné une perspective résolument interculturelle. Elle a travaillé auprès de communautés confrontées à la migration, à l’exclusion sociale, aux violences conjugales, à la traite des êtres humains et à l’inégalité d’accès aux opportunités, en apportant dignité, intelligence culturelle et approche fondée sur les droits à chaque mission.',
        'La Dre Mbarga défend l’éducation des filles en milieu rural, les femmes entrepreneures, les droits des immigrés africains et la formation des leaders de demain. Elle a participé à des forums internationaux réunissant gouvernements, universités, organisations à but non lucratif, dirigeants d’entreprise et institutions communautaires sur plusieurs continents.',
        'Auteure internationale, conférencière, entrepreneure et dirigeante humanitaire, elle fait avancer les débats de politique publique et les initiatives communautaires qui promeuvent l’équité, l’inclusion, la paix et le développement durable. Son combat contre le féminicide au Cameroun reflète un engagement plus large en faveur de la protection, de la responsabilité et d’un changement systémique.'
      ],
      photos: [
        { src: 'assets/images/leadership/ceo-dr-mbarga-office.webp', alt: 'S.E. Dre Antoinette Carole Grace Mbarga' },
        { src: 'assets/images/leadership/ceo-dr-mbarga.webp', alt: 'Portrait de S.E. Dre Antoinette Carole Grace Mbarga' }
      ],
      logo: null,
      links: [],
      socials: true
    },
    {
      id: 'manager',
      theme: 'brown',
      eyebrow: 'Direction opérationnelle',
      heading: '',
      name: 'Bassale Samuel Eric Alonso',
      titles: [
        'Président de l’association caritative Family',
        'Directeur général de la Fondation Abeng Henriette',
        'Chargé des opérations à la Fondation NOUNJI (Miss Cameroun 2024)',
        'CEO du concept ORPHAN Never Alone (ONA Challenge)'
      ],
      summary: 'Né à Douala et grandi à Yaoundé (Cameroun), M. Bassale Eric est passionné de football et d’action humanitaire. Il a bâti une carrière dans l’accompagnement des couches défavorisées, l’éducation des orphelins, le soutien aux malades, aux veuves et aux personnes en difficulté. Son leadership, son expérience et ses connaissances lui ont permis de gérer plusieurs associations, notamment les actions de terrain de Miss Univers 2024 et de sa fondation NOUNJI.',
      bio: [
        'Son parcours auprès des associations et des orphelinats lui a permis de créer, il y a six ans, sa propre association caritative, de lutter en faveur des couches défavorisées et de travailler contre les violences basées sur le genre, grâce à des mesures préventives : formations gratuites pour les femmes, séminaires et conférences.',
        'Son combat contre les problèmes de première nécessité au Cameroun reflète un engagement plus large en faveur de la protection, de la responsabilité et d’un changement systémique.'
      ],
      photos: [
        { src: 'assets/images/leadership/manager.webp', alt: 'Portrait de Bassale Samuel Eric Alonso' }
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
      eyebrow: 'Contributeur créatif et design',
      heading: '',
      name: 'Brillant Gislain Diffo',
      titles: ['Consultant en design', 'Designer de marque et d’emballage', 'Web designer', 'Développeur web', 'Fondateur de GreenLab Design'],
      summary: 'Brillant Gislain Diffo est designer graphique et fondateur de GreenLab Design, une agence créative spécialisée dans l’identité visuelle. Fort d’une solide expérience en design, il accompagne Afiri Consulting International sur la dimension créative de projets sélectionnés.',
      bio: [
        'Au sein d’Afiri Consulting International, Brillant Gislain Diffo pilote la création sous toutes ses formes : identité visuelle, supports de communication, packaging, web design, développement web et présence en ligne. Il unit la rigueur du designer à la maîtrise technique du développeur, ce qui lui permet de suivre un projet de l’idée jusqu’à sa mise en ligne, avec la même cohérence à chaque étape.',
        'Il traduit la mission et les valeurs d’Afiri en une image claire, cohérente et crédible auprès de ses partenaires comme de ses publics.'
      ],
      photos: [
        { src: 'assets/images/leadership/brillant-gislain-diffo.webp', alt: 'Portrait de Brillant Gislain Diffo' }
      ],
      logo: { src: 'assets/images/brand/greenlab-design.webp', alt: 'GreenLab Design', url: 'https://www.greenlabdesign.tech/' },
      links: [
        { label: 'Portfolio', url: 'https://www.greenlabdesign.tech/', icon: 'portfolio' },
        { label: 'E-mail', url: 'mailto:contact@afiriconsulting.com', icon: 'email' },
        { label: 'WhatsApp', url: 'https://wa.me/237671008373', icon: 'whatsapp' }
      ],
      socials: false
    }
  ],

  // Bandeau du haut + carte « Featured news » : tout se règle dans assets/featured/featured-news.js

  urgent: {
    eyebrow: 'Actualités et projets urgents',
    title: 'Ce sur quoi nous travaillons en ce moment',
    intro: 'Suivez les initiatives, les urgences et les étapes qui mobilisent actuellement notre équipe et nos partenaires.',
    projects: [
      {
        status: 'urgent', label: 'Urgent',
        title: 'Exemple : réponse humanitaire urgente',
        summary: 'Remplacez ce texte par une courte description de la situation, des besoins immédiats et de la personne à contacter.',
        date: '2026-10-20', location: 'Lieu', progress: 62, progressLabel: 'Soutien mobilisé',
        image: 'assets/images/impact/human-rights.webp', imageAlt: 'Des membres de la communauté se tenant la main en signe de solidarité',
        link: '#contact', linkLabel: 'Soutenir ce projet'
      },
      {
        status: 'ongoing', label: 'En cours',
        title: 'Exemple : campagne pour l’éducation des filles',
        summary: 'Remplacez ce texte par les objectifs, la phase en cours et la prochaine étape du projet.',
        date: '2026-10-12', location: 'Lieu', progress: 35, progressLabel: 'Phase 1 terminée',
        image: 'assets/images/impact/education.webp', imageAlt: 'Une équipe examinant des supports de programme éducatif',
        link: '#contact', linkLabel: 'S’impliquer'
      },
      {
        status: 'news', label: 'Actualité',
        title: 'Exemple : séance d’information sur le plaidoyer international',
        summary: 'Remplacez ce texte par une courte actualité, un événement à venir ou une annonce récente.',
        date: '2026-10-05', location: 'En ligne',
        image: 'assets/images/impact/international-advocacy.webp', imageAlt: 'Des professionnels concluant un partenariat international',
        link: '#contact', linkLabel: 'En savoir plus'
      }
    ]
  },

  awards: [
    { src: 'assets/images/awards/governor-citation.webp', title: 'Citation du gouverneur du Maryland', short: 'Citation du gouverneur', tag: 'Maryland' },
    { src: 'assets/images/awards/general-assembly-citation.webp', title: 'Citation officielle de l’Assemblée générale du Maryland', short: 'Citation de l’Assemblée générale', tag: 'Maryland' },
    { src: 'assets/images/awards/bell-seal-2023.webp', title: 'Mental Health America — Bronze, 2023', short: 'Sceau Bell en bronze', tag: 'MHA · 2023' },
    { src: 'assets/images/awards/bell-seal-2024.webp', title: 'Mental Health America — Bronze, 2024', short: 'Sceau Bell en bronze', tag: 'MHA · 2024' }
  ],

  // Section « Prestige » (au-dessus de Distinctions) : se remplit seule à partir de « awards »
  prestige: {
    ringWords: ['Excellence', 'Intégrité', 'Leadership', 'Impact', 'Reconnaissance'],
    countLabel: 'Distinctions et citations',
    hint: 'Touchez une distinction pour voir le document',
    eyebrow: 'Prestige et reconnaissance',
    title: 'Reconnue pour',
    titleGold: 'un impact durable',
    intro: 'Citations et sceaux reçus pour le leadership, le plaidoyer et l’impact communautaire : chacun est une étape d’un chemin partagé vers la dignité et le progrès.',
    cta: 'Voir les distinctions'
  },

  impact: [
    { icon: 'education', image: 'assets/images/impact/education.webp', alt: 'Une équipe examinant des supports de programme éducatif', title: 'Éducation', text: 'Stratégie d’apprentissage inclusive, conception de programmes et parcours d’opportunités pour les jeunes.', details: ['Nous aidons les institutions, les écoles et les programmes communautaires à concevoir des stratégies d’apprentissage inclusives, mesurables et ancrées dans les réalités locales.', 'Des cadres de programmes aux parcours des jeunes, notre travail relie ce qui est enseigné aux opportunités que les jeunes peuvent réellement atteindre.'], points: ['Conception de programmes et de curriculums', 'Parcours d’opportunités pour les jeunes', 'Renforcement des capacités des éducateurs et des leaders'] },
    { icon: 'rights', image: 'assets/images/impact/human-rights.webp', alt: 'Des membres de la communauté se tenant la main en signe de solidarité', title: 'Droits humains et plaidoyer', text: 'Analyse fondée sur les droits, éclairage sur les politiques publiques et plaidoyer qui transforme les priorités des communautés en actions. Nous relions les priorités locales aux institutions et aux débats mondiaux.', details: ['Notre analyse fondée sur les droits aide les organisations à comprendre le contexte juridique, social et politique dans lequel elles travaillent.', 'Nous traduisons les priorités des communautés en messages de plaidoyer et en recommandations de politiques sur lesquels les décideurs peuvent agir.'], points: ['Analyse fondée sur les droits', 'Éclairage et notes sur les politiques publiques', 'Stratégie de plaidoyer et campagnes'] },
    { icon: 'women', image: 'assets/images/impact/women-empowerment.webp', alt: 'Deux femmes collaborant devant un ordinateur portable', title: 'Autonomisation des femmes', text: 'Des programmes qui renforcent la voix, la sécurité, le leadership et l’autonomie économique.', details: ['Nous soutenons des programmes qui renforcent la voix, la sécurité, le leadership et l’autonomie économique des femmes, avec des approches élaborées aux côtés de celles qu’elles servent.', 'Nos conseils relient l’autonomisation individuelle au changement institutionnel qui rend le progrès durable.'], points: ['Programmes de leadership et de mentorat', 'Stratégies de sécurité et de protection', 'Parcours d’autonomisation économique'] },
    { icon: 'leadership', image: 'assets/images/impact/leadership.webp', alt: 'Des dirigeants d’entreprise se saluant', title: 'Leadership transformationnel', text: 'Un développement du leadership fondé sur les valeurs, pour des personnes et des organisations résilientes.', details: ['Le leadership transformationnel commence par les valeurs. Nous accompagnons les leaders et les équipes pour clarifier leur raison d’être, bâtir la confiance et faire les choix difficiles avec justesse.', 'Notre approche renforce la résilience, sur le plan personnel comme sur le plan organisationnel.'], points: ['Développement du leadership', 'Conseil et coaching', 'Résilience organisationnelle'] },
    { icon: 'humanitarian', image: 'assets/images/impact/international-advocacy.webp', alt: 'Des professionnels concluant un partenariat international', title: 'Action humanitaire', text: 'Une planification centrée sur la personne pour les besoins urgents et le rétablissement à long terme.', details: ['Nous proposons une planification centrée sur la personne pour répondre aux besoins urgents, avec une attention portée à la dignité, à la coordination et à l’après-urgence.', 'Nos conseils relient la réponse immédiate au rétablissement à long terme, afin que l’aide renforce les personnes au lieu de les remplacer.'], points: ['Évaluation des besoins et planification de la réponse', 'Coordination des partenaires', 'Stratégie de relèvement et de transition'] },
    { icon: 'community', image: 'assets/images/impact/community-development.webp', alt: 'Un groupe diversifié formant un cercle, bras dessus bras dessous', title: 'Développement communautaire et international', text: 'Des stratégies participatives qui renforcent les capacités locales et relient les initiatives par-delà les frontières.', details: ['Les stratégies participatives placent le savoir des communautés au cœur du développement, pour que les solutions soient portées localement et connectées au monde.', 'Nous aidons les organisations à renforcer les capacités locales tout en mettant les communautés en relation avec des partenaires et des ressources internationales.'], points: ['Planification participative', 'Renforcement des capacités locales', 'Partenariats internationaux'] }
  ],

  gallery: [
    { src: 'assets/images/gallery/gallery-leadership.webp', alt: 'Des professionnels discutant autour d’une présentation numérique', title: 'Forum international du leadership', category: 'Leadership' },
    { src: 'assets/images/gallery/gallery-community.webp', alt: 'Une réunion d’équipe collaborative dans un bureau lumineux', title: 'Initiative de sensibilisation communautaire', category: 'Communauté' },
    { src: 'assets/images/impact/women-empowerment.webp', alt: 'Deux femmes échangeant des idées devant un ordinateur portable', title: 'Programme d’autonomisation des femmes', category: 'Autonomisation' },
    { src: 'assets/images/gallery/gallery-operations.webp', alt: 'Un espace de travail préparé pour la mise en œuvre d’un programme', title: 'Éducation et développement des jeunes', category: 'Éducation' },
    { src: 'assets/images/gallery/gallery-global-forum.webp', alt: 'Un rassemblement communautaire au coucher du soleil', title: 'Événement de plaidoyer mondial', category: 'Plaidoyer mondial' }
  ],

  partners: [
    { src: 'assets/images/partners/united-nations.webp', name: 'Nations Unies' },
    { src: 'assets/images/partners/unicef.webp', name: 'UNICEF' },
    { src: 'assets/images/partners/mbarga-project.webp', name: 'The Mbarga Project' },
    { src: 'assets/images/partners/family.webp', name: 'Family' },
    { src: 'assets/images/partners/foundation-abeng-henriette.webp', name: 'Fondation Abeng Henriette' }
  ]
};
