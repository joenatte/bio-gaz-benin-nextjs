import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { Locale } from "./i18n";

const CONTENT = path.join(process.cwd(), "content");

// Lit un fichier JSON localisé : essaie <name>.<locale>.json, puis <name>.json
export function loadJson<T = any>(relPath: string, locale: Locale): T {
  const base = path.join(CONTENT, relPath);
  const localized = base.replace(/\.json$/, `.${locale}.json`);
  const file = fs.existsSync(localized) ? localized : base;
  if (!fs.existsSync(file)) {
    throw new Error(`Contenu introuvable : ${relPath} (${locale})`);
  }
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

// Convertit un texte markdown en HTML (pour les champs 'body' riches)
export async function mdToHtml(md: string): Promise<string> {
  if (!md) return "";
  const processed = await remark().use(html).process(md);
  return processed.toString();
}

// Liste + lit une collection en dossier (blog, projects, partners, etc.)
//
// Deux cas de figure cohabitent dans /content, selon que la collection Decap
// CMS déclare i18n:true ou non (voir public/admin/config.yml) :
//  - Collections i18n (blog, projects, testimonials) : structure "multiple_files"
//    -> fichiers plats nommés "<slug>.<locale>.json" dans le même dossier.
//  - Collections mono-langue (partners) : un seul fichier "<slug>.json".
// On liste donc le dossier une fois, on regroupe par slug de base, et pour
// chaque slug on prend en priorité le fichier de la langue demandée, sinon
// on retombe sur la version sans suffixe.
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
