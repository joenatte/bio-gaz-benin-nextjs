# Feuille de route

## Phase 1 — Fondation administrable (base livrée dans ce scaffold)
- [x] Architecture Next.js + Decap CMS + Netlify Identity
- [x] Schéma CMS complet (11 collections couvrant toute la demande)
- [x] Design system porté à l'identique (tokens.css)
- [x] En-têtes de sécurité réels
- [x] SEO de base (Schema.org, Open Graph, structure sitemap)
- [x] Structure bilingue FR/EN native
- [ ] **Portage des 13 sections du prototype en composants Next.js**
      (Hero + boucle Bio-Gaz animée, calculateur de dimensionnement,
      slider avant/après, compteurs animés, accordéon FAQ...)
- [ ] Formulaires de contact/devis/candidature réellement fonctionnels
      (Netlify Forms)
- [ ] Premier déploiement réel et vérification Lighthouse

## Phase 2 — Espace privé sécurisé (Extranet)
- [ ] Intégration Supabase (base + authentification étendue)
- [ ] Implémentation des 9 rôles avec permissions par document
- [ ] Tableau de bord par rôle (documents accessibles, activité récente)
- [ ] Netlify Function de service de fichiers protégés
- [ ] Tests de sécurité sur les permissions (vérifier qu'un rôle ne peut
      pas accéder à un document hors de son niveau)

## Phase 3 — Fonctionnalités avancées
- [ ] Galerie photo/vidéo avec filtres
- [ ] Partage réseaux sociaux sur les articles
- [ ] Recherche et filtres dans la bibliothèque de ressources
- [ ] Aperçu PDF intégré

## Phase 4 — Extensions futures (architecture déjà compatible)
Prévu dans la conception mais non développé tant que non demandé :
boutique en ligne, espace client, plateforme e-learning, réservation de
formations, suivi de projets, espace investisseurs, application mobile
sur la même API.

---

## Liste unique des informations à me fournir

Conformément à votre instruction, une seule liste, groupée, ne bloquant
rien d'autre :

| Élément | Format recommandé | Utilisé pour |
|---|---|---|
| 2 photographies principales page d'accueil | JPG/WebP, 2000px de large mini. | Hero de la page d'accueil |
| Photo professionnelle du Promoteur | JPG, haute résolution | Page "Le Promoteur" — ✅ intégrée (`/uploads/nda-natte-jonas.jpg`) |
| ~~Biographie, parcours académique, expériences, réalisations, vision, message~~ | ✅ Intégré (juillet 2026) | Page "Le Promoteur" + "Mot du Promoteur" en accueil |
| Distinctions (le cas échéant) | Texte | Page "Le Promoteur" |
| Logos et informations des partenaires | PNG/SVG transparent + texte | Page "Partenaires" — ✅ 10 partenaires intégrés (`content/partners/`) |
| Photos, titres, descriptions, localisations — Tourisme & Patrimoine | JPG/WebP + texte | Nouvelle rubrique "Tourisme" |
| Témoignages (noms, photos, textes, projet associé) | Texte + JPG | Page "Témoignages" |
| Liens officiels réseaux sociaux (Facebook, Instagram, TikTok, LinkedIn, YouTube) | URLs | Pied de page + paramètres CMS |
| Lien Google Maps officiel | URL de partage Google Maps | Section Contact |
| Confirmation coordonnées (téléphone, email, adresse, horaires) | Texte | Déjà pré-rempli depuis vos flyers — à confirmer ou corriger |
| Documents pour la bibliothèque Ressources (brochures, fiches techniques, rapports...) | PDF | Rubrique "Ressources" — ✅ 2 fiches ajoutées à partir de vos flyers (présentation + PDEV-UC), fichiers PDF téléchargeables à fournir si vous en avez |

Rien ci-dessus ne bloque la suite du développement — j'avance sur le
portage des sections en parallèle.
