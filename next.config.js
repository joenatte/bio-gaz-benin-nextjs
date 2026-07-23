/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Toutes les images du site viennent de /public/uploads et sont affichées
  // via de simples <img> (pas de next/image) pour rester compatible avec le
  // contenu géré par le CMS (chemins dynamiques). Rien à configurer ici tant
  // qu'on ne bascule pas vers next/image.
};

module.exports = nextConfig;
