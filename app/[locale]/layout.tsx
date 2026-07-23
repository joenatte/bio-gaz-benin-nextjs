import type { Metadata } from "next";
import "../../styles/tokens.css";
import "../globals.css";
import type { Locale } from "../../lib/i18n";

// Layout racine RÉEL du site : il vit sous /[locale] (fr ou en), donc
// <html lang="..."> reflète toujours la langue effectivement servie.
// generateStaticParams pré-génère les deux versions du site au build.
export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

const METADATA_BY_LOCALE: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Bio-Gaz-Benin-Afrique — Biodigesteurs & Biofertilisants Agri-Shell",
    description:
      "Bio-Gaz-Benin-Afrique SARL conçoit et construit des biodigesteurs, produit le biofertilisant Agri-Shell et accompagne l'agriculture biologique au Bénin et en Afrique de l'Ouest.",
  },
  en: {
    title: "Bio-Gaz-Benin-Afrique — Biodigesters & Agri-Shell Biofertilizers",
    description:
      "Bio-Gaz-Benin-Afrique SARL designs and builds biodigesters, produces the Agri-Shell biofertilizer, and supports organic farming in Benin and West Africa.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const locale = params.locale === "en" ? "en" : "fr";
  const m = METADATA_BY_LOCALE[locale];
  return {
    metadataBase: new URL("https://bio-gaz-benin-afrique.netlify.app"),
    title: { default: m.title, template: `%s | Bio-Gaz-Benin-Afrique` },
    description: m.description,
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_BJ" : "en_US",
      alternateLocale: locale === "fr" ? "en_US" : "fr_BJ",
      siteName: "Bio-Gaz-Benin-Afrique",
      title: m.title,
      description: m.description,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en" },
    },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/favicon.png",
      apple: "/icons/icon-192.png",
    },
  };
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bio-Gaz-Benin-Afrique SARL",
  url: "https://bio-gaz-benin-afrique.netlify.app",
  logo: "https://bio-gaz-benin-afrique.netlify.app/uploads/logo-biogaz.jpg",
  email: "biogazbeninafrique1@gmail.com",
  telephone: "+22997111808",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Parakou",
    addressCountry: "BJ",
  },
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const locale = params.locale === "en" ? "en" : "fr";
  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
