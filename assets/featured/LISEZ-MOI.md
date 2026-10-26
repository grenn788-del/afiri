# Bandeau du haut + carte « Featured news » : tout au même endroit

Dossier : `assets/featured/`
- `featured-news.js`  : le SEUL fichier à modifier (textes FR + EN, symbole, couleurs, image de fond, interrupteur)
- `featured-news.css` : l'apparence et les animations des symboles (en général, ne pas toucher)

## Changer d'événement (3 minutes)
1. Ouvrez `assets/featured/featured-news.js` avec un éditeur de texte.
2. Partie 2 : changez `symbol: 'ribbon'` (ruban, heart, star, megaphone, globe, flame, leaf, trophy, none).
3. Partie 3 : changez les couleurs `theme` (format #rrggbb).
4. Partie 4 : changez `background.image` (ex. 'assets/images/gallery/mon-image.jpg') ; `overlay` 0 à 1.
5. Partie 5 : changez les textes `en` (index.html) et `fr` (fr.html).
6. Enregistrez, remplacez le fichier sur l'hébergeur, rechargez la page (Ctrl+F5).

## Cacher le bandeau et la carte
`enabled: false` en haut du fichier (les textes restent enregistrés).

## Ajouter une image de fond
Placez l'image dans `assets/images/gallery/` (jpg en HD, 1920 à 2560 px de large) puis indiquez son chemin dans `background.image`.
`image: ''` = dégradé de couleurs seul.

## Symbole personnalisé
`symbol: 'custom'` et collez votre SVG dans `customSvg` (viewBox carré, une seule couleur).
