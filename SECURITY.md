# Posture de sécurité

Ce document dit précisément ce qui est protégé, comment, et ce qui ne
l'est pas encore. Pas de promesse vague — chaque ligne de la demande
originale est traitée explicitement.

## Couvert dès la Phase 1 (base actuelle)

| Exigence demandée | Mécanisme réel |
|---|---|
| Chiffrement des mots de passe | Géré nativement par Netlify Identity (GoTrue), bcrypt côté serveur — aucun mot de passe ne transite ni n'est stocké par notre code |
| Protection XSS | React échappe automatiquement tout contenu affiché ; aucun `dangerouslySetInnerHTML` sauf pour les données Schema.org statiques et contrôlées |
| En-têtes de sécurité | CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy — définis dans `netlify.toml`, appliqués à chaque requête par le CDN Netlify |
| Sauvegardes | Historique Git complet = chaque version de chaque contenu est restaurable (`git revert`) ; Netlify conserve aussi l'historique des déploiements |
| Journalisation des actions | Historique Git (qui a modifié quoi, quand) + logs d'audit Netlify Identity (connexions, invitations) |
| Protection anti-spam formulaires | Honeypot natif Netlify Forms |

## Pas encore couvert — nécessite la Phase 2

| Exigence demandée | Pourquoi ce n'est pas encore fait | Solution prévue |
|---|---|---|
| 9 rôles avec permissions différenciées par document | Netlify Identity gère "connecté / non connecté" mais pas une matrice de permissions fine par fichier | Supabase + Row Level Security : chaque document a un `access_level` (déjà présent dans le CMS, champ préparé), vérifié par une Netlify Function avant de servir le fichier |
| Limitation des tentatives de connexion (rate limiting) | Non configuré par défaut sur Netlify Identity | À activer via les paramètres Identity ou une Function dédiée en Phase 2 |
| Protection CSRF | Peu pertinent tant qu'il n'y a pas de session cookie côté serveur custom (Phase 1 = rendu statique + Identity gère ses propres tokens) | Sera revu si Phase 2 introduit des sessions serveur custom |
| Protection contre les injections SQL | Sans objet en Phase 1 (pas de base de données SQL) | Supabase utilise des requêtes paramétrées par défaut + RLS en Phase 2 |

## Ce que je ne ferai pas

Je n'écrirai pas un système d'authentification "maison" (gestion de mots
de passe, sessions, tokens) codé à la main pour ce projet. Ce type de
code, non audité par une équipe sécurité dédiée, est une source
classique de failles graves. Netlify Identity et Supabase Auth sont
audités, maintenus, et couvrent exactement ce besoin — les utiliser est
la décision technique la plus sûre, pas un raccourci.
