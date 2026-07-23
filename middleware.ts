import { NextRequest, NextResponse } from "next/server";

// Système bilingue réel : chaque page vit sous /fr ou /en.
// Ce middleware redirige la racine "/" (et toute URL sans préfixe de langue)
// vers la langue par défaut (fr), ou vers la langue préférée du navigateur
// si elle est détectée (Accept-Language).
const LOCALES = ["fr", "en"];
const DEFAULT_LOCALE = "fr";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Laisse passer les fichiers statiques, l'admin CMS et les routes déjà préfixées.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  ) {
    return NextResponse.next();
  }

  const acceptLang = request.headers.get("accept-language") || "";
  const preferred = acceptLang.toLowerCase().startsWith("en") ? "en" : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|admin|uploads|icons|favicon.png|robots.txt|sitemap.xml|manifest.webmanifest).*)"],
};
