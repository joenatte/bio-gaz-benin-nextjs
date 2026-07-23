# Architecture — décisions et justifications

## 1. Analyse du site existant (rappel)

| Aspect | Constat |
|---|---|
| Structure | Fichier HTML unique statique (6,9 Mo, 40 images en base64) |
| CMS | Aucun — contenu codé en dur |
| Formulaires | Mockup visuel uniquement, aucun envoi réel |
| SEO | Aucune donnée structurée, aucun sitemap/robots.txt, aucune balise OG |
| Sécurité | Sans objet (pas de backend) |
| Points forts | Identité visuelle forte, contenu déjà vérifié authentique, bonnes interactions |

**Conclusion :** excellente vitrine, mais fondation technique incompatible
avec un CMS, des rôles ou un extranet. Reconstruction de la fondation
nécessaire — le design, lui, est conservé à l'identique.

## 2. Stack retenue et pourquoi

| Besoin exprimé | Solution retenue | Pourquoi |
|---|---|---|
| CMS sans code | **Decap CMS** | Gratuit, open-source, connecté à Git (traçabilité native = historique des actions demandé), pas de base de données à maintenir pour le contenu éditorial |
| Authentification / rôles de base | **Netlify Identity** | Mots de passe hashés (bcrypt côté serveur, géré par Netlify — pas de code d'auth "maison" non audité), invitations par email, intégré nativement à Git Gateway |
| Formulaires (devis, candidatures) | **Netlify Forms** | Aucun backend à écrire, anti-spam natif, notifications email automatiques |
| Permissions documentaires fines (9 rôles, accès par document) | **Supabase (Phase 2)** | Base Postgres avec Row Level Security — seule solution réaliste pour "ce document est visible par les Partenaires mais pas les Employés" sans réinventer un système d'autorisation |
| Rendu / pages / SEO | **Next.js** | Standard de l'industrie, rendu statique pour la performance, compatible Netlify nativement |
| Hébergement | **Netlify** | Demandé explicitement, gratuit au niveau de trafic actuel, build automatique à chaque publication CMS |

## 3. Ce qui change par rapport à la demande initiale — et pourquoi

La demande originale envisage un unique système "tout-en-un" (CMS +
9 rôles + extranet + bibliothèque documentaire) livré en un seul bloc.
En tant que directeur technique, je découpe cela en phases pour deux
raisons concrètes :

1. **Sécurité réelle vs. sécurité de façade.** Un système d'authentification
   et de permissions par rôle mal testé est pire que pas de système du
   tout — il donne un faux sentiment de sécurité. Netlify Identity est
   éprouvé et suffit largement pour la Phase 1 (accès simple : connecté
   / non connecté). Les permissions fines par rôle (Phase 2, via Supabase)
   demandent des règles Row Level Security qui doivent être écrites,
   revues et testées avec de vraies données — pas improvisées.

2. **Contrainte d'environnement.** Je ne peux pas exécuter de build ni
   déployer depuis mon environnement actuel (voir README.md). Livrer un
   bloc monolithique non testable d'un coup augmente le risque d'erreurs
   qui ne se révèlent qu'au premier vrai déploiement. Une Phase 1 stable
   et déployée avec succès est la meilleure base pour ajouter la Phase 2
   en confiance.

## 4. Architecture technique cible

```
Navigateur
   │
   ▼
Netlify (CDN + build Next.js)
   │
   ├── Pages publiques (SSG) ──── content/*.md, *.json (Git)
   ├── /admin (Decap CMS) ──────── Git Gateway ──── Netlify Identity
   ├── Formulaires ─────────────── Netlify Forms
   │
   └── (Phase 2) Netlify Functions ──── Supabase (Postgres + RLS)
                                          │
                                          └── Permissions documentaires par rôle
```

Voir ROADMAP.md pour le détail des phases et SECURITY.md pour le détail
de la posture de sécurité à chaque étape.
