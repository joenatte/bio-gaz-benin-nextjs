import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { Locale } from "./i18n";
const CONTENT = path.join(process.cwd(), "content");
// Lit un fichier JSON de contenu, et renvoie la version dans la bonne langue.
//
// Deux formats cohabitent dans /content selon la rubrique (voir
// public/admin/config.yml) :
//  - Rubriques "fichier unique" (Coordonnées, Accueil, Services,
//    Biodigesteurs, Agri-Shell, À propos, Durabilité, Promoteur, FAQ,
//    Impact) : UN SEUL fichier "<name>.json" contenant les deux langues à
//    l'intérieur, sous la forme { "fr": {...}, "en": {...} }. Nécessaire
//    car Decap CMS ne supporte pas son mécanisme i18n natif sur les
//    collections de type "fichier" (bug connu de l'outil) — on gère donc le
//    bilinguisme "à la main" via ces deux blocs.
//  - Rubriques mono-langue (Réseaux sociaux, paramètres du calculateur) :
//    un seul fichier plat, pas de "fr"/"en", identique pour tout le monde.
export function loadJson<T = any>(relPath: string, locale: Locale): T {
  const base = path.join(CONTENT, relPath);
  const localized = base.replace(/\.json$/, `.${locale}.json`);
  const file = fs.existsSync(localized) ? localized : base;
  if (!fs.existsSync(file)) {
    throw new Error(`Contenu introuvable : ${relPath} (${locale})`);
  }
  const parsed = JSON.parse(fs.readFileSync(file, "utf-8"));

  // Format bilingue "à la main" : { fr: {...}, en: {...} }
  if (parsed && typeof parsed === "object" && "fr" in parsed && "en" in parsed) {
    return (parsed[locale] ?? parsed["fr"]) as T;
  }

  // Format plat mono-langue (ex: social.json, calculator.json) : inchangé.
  return parsed as T;
}
// Convertit un texte markdown en HTML (pour les champs 'body' riches)
export async function mdToHtml(md: string): Promise<string> {
  if (!md) return "";
  const processed = await remark().use(html).process(md);
  return processed.toString();
}
// Liste + lit une collection en dossier (blog, projects, partners, etc.)
// Non concernée par le changement ci-dessus : ces collections restent en
// "multiple_files" (un fichier par langue), qui fonctionne correctement
// pour les collections de type dossier.
export async function loadCollection(collection: string, locale: Locale) {
  const dir = path.join(CONTENT, collection);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".json"));
  type Entry = { locale?: string; plain?: string; ext: "json" | "md" };
  const bySlug: Record<string, Entry> = {};
  for (const f of files) {
    const ext: "json" | "md" = f.endsWith(".json") ? "json" : "md";
    const stem = f.replace(/\.(json|md)$/, "");
    const localeMatch = stem.match(/^(.*)\.(fr|en)$/);
    if (localeMatch) {
      const [, base, fLocale] = localeMatch;
      bySlug[base] = bySlug[base] || { ext };
      if (fLocale === locale) bySlug[base].locale = f;
    } else {
      bySlug[stem] = bySlug[stem] || { ext };
      bySlug[stem].plain = f;
    }
  }
  return Object.entries(bySlug)
    .map(([slug, entry]) => {
      const chosen = entry.locale || entry.plain;
      if (!chosen) return null;
      const raw = fs.readFileSync(path.join(dir, chosen), "utf-8");
      if (entry.ext === "json") return { slug, ...JSON.parse(raw) };
      const { data, content } = matter(raw);
      return { slug, body: content, ...data };
    })
    .filter(Boolean);
}
// Met un mot entre *astérisques* en <em> coloré (pour le titre hero)
export function highlight(text: string): string {
  return (text || "").replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
