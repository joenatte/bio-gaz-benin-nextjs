// Aide légère au bilinguisme. Le contenu réel (textes longs) vit dans
// /content/**/{fr,en}/*.md grâce à la config i18n de Decap CMS.
// Ce dictionnaire couvre seulement les chaînes d'interface fixes
// (navigation, boutons, libellés récurrents) qui ne passent pas par le CMS.

export type Locale = "fr" | "en";

export const dictionary: Record<Locale, Record<string, string>> = {
  fr: {
    nav_about: "À propos",
    nav_promoter: "Promoteur",
    nav_services: "Services",
    nav_tech: "Biodigesteurs",
    nav_projects: "Projets",
    nav_agrishell: "Agri-Shell",
    nav_sustain: "Durabilité",
    nav_contact: "Contact",
    cta_contact: "Nous contacter",
    cta_maps: "Ouvrir dans Google Maps",
  },
  en: {
    nav_about: "About",
    nav_promoter: "Founder",
    nav_services: "Services",
    nav_tech: "Biodigesters",
    nav_projects: "Projects",
    nav_agrishell: "Agri-Shell",
    nav_sustain: "Sustainability",
    nav_contact: "Contact",
    cta_contact: "Get in touch",
    cta_maps: "Open in Google Maps",
  },
};

export function t(locale: Locale, key: string): string {
  return dictionary[locale][key] ?? key;
}
