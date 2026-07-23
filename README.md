# Bio-Gaz-Benin-Afrique — Plateforme digitale

Fondation technique de la nouvelle plateforme, construite pour préserver
l'identité visuelle du prototype validé tout en la rendant administrable
sans code, sécurisée et évolutive.

## Ce qui est livré dans cette base

- Architecture Next.js prête pour Netlify (voir ARCHITECTURE.md)
- Panneau d'administration Decap CMS complet (`/admin`) couvrant : pages,
  actualités/blog, réalisations, partenaires, témoignages, tourisme,
  carrières, ressources, FAQ, profil du promoteur, paramètres du site
- Identité visuelle portée à l'identique (`styles/tokens.css`)
- En-têtes de sécurité réels (CSP, HSTS, X-Frame-Options...) via `netlify.toml`
- Structure bilingue FR/EN native au CMS
- SEO de base : Schema.org, Open Graph, sitemap (généré au build)
- Une page d'accueil fonctionnelle prouvant le circuit CMS → contenu → site

## Ce qui n'est PAS encore fait (voir ROADMAP.md)

Le portage complet des 13 sections du prototype, l'espace privé sécurisé
par rôle, et l'intégration Supabase pour les permissions documentaires
fines. Rien de tout cela n'est bloqué — c'est la suite planifiée.

## Pourquoi vous devez faire le premier déploiement

Mon environnement de développement n'a pas d'accès réseau vers npm,
GitHub ou Netlify (contrainte de sandbox, vérifiée techniquement, pas
un choix). Je peux écrire tout le code, mais je ne peux pas :
- exécuter `npm install` moi-même
- pousser sur un dépôt GitHub
- créer ou configurer un compte Netlify

Ces trois étapes prennent environ 15 minutes. Voici exactement quoi faire.

## Déploiement — étape par étape

### 1. Créer le dépôt GitHub
```
cd biogaz-platform
git init
git add .
git commit -m "Fondation technique initiale"
```
Créez un dépôt vide sur github.com (ex: `biogaz-benin-afrique-platform`),
puis :
```
git remote add origin https://github.com/VOTRE-COMPTE/biogaz-benin-afrique-platform.git
git branch -M main
git push -u origin main
```

### 2. Connecter Netlify
1. Sur [netlify.com](https://netlify.com), "Add new site" → "Import an existing project"
2. Choisissez votre dépôt GitHub
3. Netlify détecte automatiquement `netlify.toml` — ne changez rien
4. Cliquez "Deploy" — c'est le tout premier vrai build/test de ce code

### 3. Activer l'administration (Netlify Identity + Git Gateway)
1. Site settings → Identity → **Enable Identity**
2. Identity → Registration → **Invite only** (recommandé au départ)
3. Site settings → Identity → Services → **Enable Git Gateway**
4. Invitez-vous vous-même comme premier utilisateur (Identity → Invite users)
5. Accédez à `https://votre-site.netlify.app/admin` et connectez-vous

À partir de là, vous pouvez modifier tout le contenu du site (textes,
photos, articles, projets, partenaires...) sans jamais toucher au code.
Chaque modification publiée crée un commit Git et redéploie automatiquement.

### 4. Domaine personnalisé (optionnel)
Site settings → Domain management → Add custom domain.

## Développement local (pour un développeur)

```
npm install
npm run dev
```
Site disponible sur `http://localhost:3000`, admin CMS sur `/admin`
(nécessite `netlify dev` avec les CLI Netlify pour simuler Git Gateway
en local — voir la documentation Decap CMS pour le mode "local backend"
si vous préférez éditer sans passer par Netlify Identity en développement).
