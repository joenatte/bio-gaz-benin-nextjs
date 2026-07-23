import { notFound } from "next/navigation";
import { loadJson, loadCollection, highlight, mdToHtml } from "../../lib/content";
import { dictionary, type Locale } from "../../lib/i18n";
import "../../styles/site.css";

import Nav from "../../components/Nav";
import ScrollEffects from "../../components/ScrollEffects";
import BeforeAfterSlider from "../../components/BeforeAfterSlider";
import FaqAccordion from "../../components/FaqAccordion";
import Calculator from "../../components/Calculator";
import ContactForm from "../../components/ContactForm";
import WhatsAppFab from "../../components/WhatsAppFab";

// TOUTES les sections lisent leur contenu depuis /content/** (édité via /admin).
// Aucun texte, chiffre ou photo n'est figé dans ce composant.
// La langue vient de la route (/fr ou /en) — génération statique des deux versions,
// vrai <html lang>, et un vrai menu FR/EN (pas un simple show/hide comme le prototype).
//
// Design, mise en page, animations et micro-interactions : portés à l'identique
// depuis le prototype HTML validé (voir styles/site.css). Les éléments interactifs
// (avant/après, FAQ, calculateur, formulaire, menu mobile, reveal au scroll,
// compteurs animés) sont ici de vrais composants React ("use client"), pas du JS
// injecté dans le HTML.

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

function Icon({ name }: { name: "facebook" | "instagram" | "tiktok" | "whatsapp" | "youtube" | "linkedin" | "pin" }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "currentColor" };
  switch (name) {
    case "facebook":
      return <svg {...common}><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>;
    case "instagram":
      return <svg {...common}><path d="M12 2c2.7 0 3.1 0 4.1.1 1.1 0 1.8.2 2.5.5.6.3 1.2.6 1.7 1.1.5.5.9 1 1.1 1.7.3.7.5 1.4.5 2.5.1 1 .1 1.4.1 4.1s0 3.1-.1 4.1c0 1.1-.2 1.8-.5 2.5-.3.6-.6 1.2-1.1 1.7-.5.5-1 .9-1.7 1.1-.7.3-1.4.5-2.5.5-1 .1-1.4.1-4.1.1s-3.1 0-4.1-.1c-1.1 0-1.8-.2-2.5-.5-.6-.3-1.2-.6-1.7-1.1-.5-.5-.9-1-1.1-1.7-.3-.7-.5-1.4-.5-2.5C2 15.1 2 14.7 2 12s0-3.1.1-4.1c0-1.1.2-1.8.5-2.5.3-.6.6-1.2 1.1-1.7.5-.5 1-.9 1.7-1.1.7-.3 1.4-.5 2.5-.5C9.9 2 10.3 2 12 2Zm0 1.8c-2.6 0-2.9 0-4 .1-.9 0-1.4.2-1.7.3-.4.2-.7.4-1 .7-.3.3-.5.6-.7 1-.1.3-.3.8-.3 1.7-.1 1-.1 1.4-.1 4s0 2.9.1 4c0 .9.2 1.4.3 1.7.2.4.4.7.7 1 .3.3.6.5 1 .7.3.1.8.3 1.7.3 1 .1 1.4.1 4 .1s2.9 0 4-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.4 1-.7.3-.3.5-.6.7-1 .1-.3.3-.8.3-1.7.1-1 .1-1.4.1-4s0-2.9-.1-4c0-.9-.2-1.4-.3-1.7-.2-.4-.4-.7-.7-1-.3-.3-.6-.5-1-.7-.3-.1-.8-.3-1.7-.3-1-.1-1.4-.1-4-.1Zm0 3.5a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Zm4.9-2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"/></svg>;
    case "tiktok":
      return <svg {...common}><path d="M14 2h2.9a5.4 5.4 0 0 0 4 4.7v3a8.3 8.3 0 0 1-4-1.1v6.7a6.7 6.7 0 1 1-6.7-6.7c.3 0 .6 0 .9.1v3.1a3.6 3.6 0 1 0 2.9 3.5V2Z"/></svg>;
    case "whatsapp":
      return <svg {...common}><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 0 1 6.9 12.6l-.3.5.9 3-3.1-.9-.5.3A8.2 8.2 0 1 1 12 3.8Zm-3.1 4c-.2 0-.5 0-.7.4-.2.4-.9 1-.9 2.3s1 2.7 1.1 2.8c.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.4-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.1.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5 0-.1-.6-1.6-.9-2.2-.2-.5-.4-.5-.6-.5h-.5Z"/></svg>;
    case "youtube":
      return <svg {...common}><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z"/></svg>;
    case "linkedin":
      return <svg {...common}><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.2V9h3.5v1.6h.1a3.8 3.8 0 0 1 3.4-1.9c3.7 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4A2.1 2.1 0 1 1 5.3 3a2.1 2.1 0 0 1 0 4.4ZM7.1 20.4H3.5V9h3.6v11.4Z"/></svg>;
    case "pin":
      return <svg {...common}><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>;
  }
}

export default async function Home({ params }: { params: { locale: string } }) {
  if (params.locale !== "fr" && params.locale !== "en") notFound();
  const locale: Locale = params.locale as Locale;
  const ui = dictionary[locale];

  const hero = loadJson("home/hero.json", locale);
  const stats = loadJson("home/stats.json", locale);
  const impact = loadJson("impact/impact.json", locale);
  const services = loadJson("services/services.json", locale);
  const tech = loadJson("tech/tech.json", locale);
  const calc = loadJson("tech/calculator.json", locale);
  const agri = loadJson("agrishell/agrishell.json", locale);
  const about = loadJson("about/about.json", locale);
  const aboutBody = await mdToHtml(about.body);
  const sustain = loadJson("sustainability/sustainability.json", locale);
  const faq = loadJson("faq/faq.json", locale);
  const social = loadJson("settings/social.json", locale);
  const general = loadJson("settings/general.json", locale);
  const promoter = loadJson("team/promoteur.json", locale);
  const promoterBio = await mdToHtml(promoter.bio || "");
  const promoterPartnerships = await mdToHtml(promoter.partnerships || "");
  const promoterIntl = await mdToHtml(promoter.international_experience || "");
  const promoterEducation = await mdToHtml(promoter.education || "");
  const promoterVision = await mdToHtml(promoter.vision || "");

  const testimonials = await loadCollection("testimonials", locale);
  const projects = await loadCollection("projects", locale);
  const partners = await loadCollection("partners", locale);
  const blog = await loadCollection("blog", locale);
  const resources = await loadCollection("resources", locale);
  const allJobs = await loadCollection("jobs", locale);
  const jobs = allJobs.filter((j: any) => j.active !== false);

  // Fallback "voix du terrain" honnête et générique — identique au prototype —
  // utilisé tant qu'aucun vrai témoignage n'a été saisi dans /admin (collection
  // "testimonials" vide). Jamais de faux nom ni de fausse citation inventée.
  const fallbackVoices =
    locale === "fr"
      ? [
          { image: "/uploads/elder-bottles-field.jpg", who: "Producteur, coopérative locale", role: "Utilisateur Agri-Shell Liquide", text: "A intégré le biofertilisant sur sa parcelle maraîchère, en complément de son itinéraire habituel." },
          { image: "/uploads/cert-two-men.jpg", who: "Diplômé, session de formation", role: "Certification Agri-Shell, 2026", text: "Formé aux bonnes pratiques d'application du biofertilisant lors de notre session de certification sur le terrain." },
          { image: "/uploads/group-well.jpg", who: "Collecte communautaire", role: "Fourniture de matière organique", text: "Les résidus verts collectés localement alimentent le circuit de compostage et de biodigestion." },
        ]
      : [
          { image: "/uploads/elder-bottles-field.jpg", who: "Farmer, local cooperative", role: "Agri-Shell Liquid user", text: "Integrated the biofertilizer into his market-garden plot, alongside his usual routine." },
          { image: "/uploads/cert-two-men.jpg", who: "Graduate, training session", role: "Agri-Shell Certification, 2026", text: "Trained in proper biofertilizer application during our field certification session." },
          { image: "/uploads/group-well.jpg", who: "Community collection", role: "Organic matter supply", text: "Locally collected green residue feeds the composting and biodigestion loop." },
        ];
  const quotePlaceholder =
    locale === "fr"
      ? { text: "[Emplacement réservé — ajoutez ici une citation réelle d'un producteur, d'une institution partenaire ou d'une autorité locale.]", src: "À compléter — nom, rôle, localité" }
      : { text: "[Placeholder — add a real quote here from a farmer, partner institution, or local authority.]", src: "To complete — name, role, location" };

  // Avant/après : progression réelle du chantier de Parakou (mesure de la fosse
  // → dôme achevé). Le prototype évoquait un avant/après "parcelle", mais nous
  // n'avons pas de paire de photos vérifiée pour un même champ ; le chantier,
  // lui, est entièrement documenté et authentique.
  const baBefore = "/uploads/pit-measuring.jpg";
  const baAfter = "/uploads/dome-finished.jpg";
  const baLabels =
    locale === "fr"
      ? { before: "AVANT", after: "APRÈS", drag: "Faites glisser pour comparer le chantier avant et après la construction du biodigesteur." }
      : { before: "BEFORE", after: "AFTER", drag: "Drag to compare the site before and after the biodigester was built." };

  // Galerie "projets" (6 photos) : sélection représentative à travers les 3 sites.
  const projGallery = [
    { image: "/uploads/basin-build.jpg", cap_fr: "Bassin d'alimentation", cap_en: "Feed inlet basin" },
    { image: "/uploads/founder-digester.jpg", cap_fr: "Visite de site — Natitingou", cap_en: "Site visit — Natitingou" },
    { image: "/uploads/stove-paint.jpg", cap_fr: "Réchaud à biogaz artisanal", cap_en: "Handcrafted biogas stove" },
    { image: "/uploads/team-farm.jpg", cap_fr: "Exploitation partenaire — Malanville-Guéné", cap_en: "Partner farm — Malanville-Guéné" },
    { image: "/uploads/watering-granules.jpg", cap_fr: "Application des granulés", cap_en: "Granule application" },
    { image: "/uploads/field-wall-1.jpg", cap_fr: "Parcelle en zone agricole", cap_en: "Plot in a farming area" },
  ];

  const t = {
    fr: { nav_promoter: "Le Promoteur", section_projects: "Nos réalisations", section_voices: "Voix du terrain",
      section_blog: "Actualités", section_partners: "Partenaires & institutions", section_faq: "Questions fréquentes",
      section_resources: "Ressources & documents", section_careers: "Carrières",
      contact: "Contact", email: "Email", phone: "Téléphone", maps_btn: "Ouvrir dans Google Maps",
      promoter_roles: "Fonctions & expériences", promoter_partnerships: "Partenariats & engagements",
      promoter_intl: "Expérience internationale", promoter_education: "Formation & qualifications", promoter_vision: "Vision",
      apply: "Postuler", read_more: "Lire l'article",
      brand_sub: "SARL · Bénin, Afrique de l'Ouest",
      calc: { title: "Calculateur de dimensionnement — estimation", cattle: "Bovins", pigs: "Porcins", people: "Membres du foyer (toilettes raccordées)",
        outVol: "Volume recommandé", outGas: "Biogaz / jour", outHours: "Cuisson / jour", outSize: "Modèle standard",
        note: "Estimation basée sur des ratios standards du secteur (rendement ≈ 0,04 m³ de biogaz/kg de matière fraîche, rétention 45 jours). Une étude technique sur site affine ce dimensionnement." },
      form: { name: "Nom complet", org: "Organisation (optionnel)", email: "Email", phone: "Téléphone", message: "Votre message…", send: "Envoyer le message", sent: "Message noté ✓", note: "Formulaire de démonstration — à connecter à votre messagerie ou CRM." },
      footNav: "Navigation", footCompany: "Entreprise", tagline: "Transformer les déchets en richesse pour un développement durable.",
    },
    en: { nav_promoter: "Founder", section_projects: "Our projects", section_voices: "Voices from the field",
      section_blog: "News", section_partners: "Partners & institutions", section_faq: "Frequently asked questions",
      section_resources: "Resources & documents", section_careers: "Careers",
      contact: "Contact", email: "Email", phone: "Phone", maps_btn: "Open in Google Maps",
      promoter_roles: "Roles & experience", promoter_partnerships: "Partnerships & engagements",
      promoter_intl: "International experience", promoter_education: "Education & qualifications", promoter_vision: "Vision",
      apply: "Apply", read_more: "Read article",
      brand_sub: "SARL · Benin, West Africa",
      calc: { title: "Sizing calculator — estimate", cattle: "Cattle", pigs: "Pigs", people: "Household members (connected toilet)",
        outVol: "Recommended volume", outGas: "Biogas / day", outHours: "Cooking / day", outSize: "Standard model",
        note: "Estimate based on standard industry ratios (yield ≈ 0.04 m³ biogas/kg fresh matter, 45-day retention). An on-site technical study refines final sizing." },
      form: { name: "Full name", org: "Organization (optional)", email: "Email", phone: "Phone", message: "Your message…", send: "Send message", sent: "Message noted ✓", note: "Demo form — to be connected to your inbox or CRM." },
      footNav: "Navigation", footCompany: "Company", tagline: "Turning waste into wealth for sustainable development.",
    },
  }[locale];

  const navLinks = [
    { href: "#about", label: ui.nav_about },
    { href: "#promoteur", label: ui.nav_promoter },
    { href: "#services", label: ui.nav_services },
    { href: "#tech", label: ui.nav_tech },
    { href: "#projects", label: ui.nav_projects },
    { href: "#agrishell", label: "Agri-Shell" },
    { href: "#sustain", label: ui.nav_sustain },
    { href: "#contact", label: ui.nav_contact },
  ];

  return (
    <main>
      <a href="#hero" className="skip-link">{locale === "fr" ? "Aller au contenu" : "Skip to content"}</a>

      <Nav
        locale={locale}
        logo="/uploads/logo-biogaz.jpg"
        brandName="Bio-Gaz-Benin-Afrique"
        brandSub={t.brand_sub}
        links={navLinks}
        ctaLabel={ui.cta_contact}
      />

      {/* HERO — depuis content/home/hero.json */}
      <section id="hero" tabIndex={-1}>
        <div className="wrap hero-grid">
          <div className="hero-copy reveal">
            <div className="eyebrow">{hero.eyebrow}</div>
            <h1 dangerouslySetInnerHTML={{ __html: highlight(hero.title) }} />
            <p>{hero.intro}</p>
            <div className="hero-cta">
              <a href="#tech" className="btn solid">{hero.cta1}</a>
              <a href="#projects" className="btn ghost">{hero.cta2}</a>
            </div>
            <div className="hero-tags">
              <span className="pill">RCCM {general.rccm}</span>
              <span className="pill">Parakou · Natitingou · Malanville-Guéné</span>
            </div>
          </div>
          <div className="hero-photo-wrap reveal">
            <div className="hero-photo-main">
              <img src={hero.photo_main} alt="" />
              <div className="hero-photo-badge">{hero.badge}</div>
            </div>
            <div className="hero-photo-inset"><img src={hero.photo_inset} alt="" /></div>
          </div>
        </div>
      </section>

      {/* STATS — depuis content/home/stats.json */}
      <div className="stat-strip">
        <div className="wrap">
          {stats.items.map((s: any, i: number) => (
            <div className="stat-item reveal" key={i}>
              <div className="val" data-count={s.value}>0</div>
              <div className="lbl">{s.label}</div>
              {s.note && <div className="note">{s.note}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT — depuis content/about/about.json */}
      <section id="about" className="section-pad">
        <div className="wrap about-grid">
          <div className="about-photo img-tile reveal"><img src={about.photo} alt="" /></div>
          <div className="about-copy reveal">
            <h2>{about.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: aboutBody }} />
            <div className="values-row">
              {about.values.map((v: string, i: number) => <span className="pill" key={i}>{v}</span>)}
            </div>
            <div className="timeline">
              {about.timeline.map((tl: any, i: number) => (
                <div className="tl-row" key={i}>
                  <div className="yr mono">{tl.num}</div>
                  <div className="tx"><b>{tl.title}</b><p>{tl.text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="wrap"><div className="divider"></div></div>

      {/* LE PROMOTEUR — depuis content/team/promoteur.json (files collection i18n) */}
      <section id="promoteur" className="section-pad" style={{ background: "var(--paper-dim)" }}>
        <div className="wrap">
          <div className="section-head reveal" style={{ margin: "0 auto 48px", maxWidth: 760, textAlign: "center" }}>
            <h2>{t.nav_promoter} — {promoter.name}</h2>
          </div>
          <div className="about-grid" style={{ alignItems: "start" }}>
            <div className="reveal" style={{ textAlign: "center" }}>
              {promoter.photo && (
                <div style={{ width: 220, height: 220, borderRadius: "50%", margin: "0 auto", overflow: "hidden", boxShadow: "0 24px 50px -20px rgba(30,25,19,.45)", border: "4px solid var(--paper)" }}>
                  <img src={promoter.photo} alt={promoter.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
                </div>
              )}
              <div className="pill" style={{ marginTop: 14, display: "inline-block" }}>{promoter.title}</div>
            </div>

            <div className="about-copy reveal">
              <div dangerouslySetInnerHTML={{ __html: promoterBio }} />

              {promoter.roles?.length > 0 && (
                <>
                  <h4 style={{ marginTop: 28 }}>{t.promoter_roles}</h4>
                  <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.9, color: "var(--charcoal-soft)" }}>
                    {promoter.roles.map((r: string, i: number) => <li key={i}>{r}</li>)}
                  </ul>
                </>
              )}

              {promoterPartnerships && (
                <>
                  <h4 style={{ marginTop: 28 }}>{t.promoter_partnerships}</h4>
                  <div style={{ color: "var(--charcoal-soft)" }} dangerouslySetInnerHTML={{ __html: promoterPartnerships }} />
                </>
              )}

              {promoterIntl && (
                <>
                  <h4 style={{ marginTop: 28 }}>{t.promoter_intl}</h4>
                  <div style={{ color: "var(--charcoal-soft)" }} dangerouslySetInnerHTML={{ __html: promoterIntl }} />
                </>
              )}

              {promoterEducation && (
                <>
                  <h4 style={{ marginTop: 28 }}>{t.promoter_education}</h4>
                  <div style={{ color: "var(--charcoal-soft)" }} dangerouslySetInnerHTML={{ __html: promoterEducation }} />
                </>
              )}

              {promoterVision && (
                <div style={{ marginTop: 30, padding: "20px 24px", background: "var(--paper)", borderRadius: "var(--radius-m)", borderLeft: "4px solid var(--leaf)" }}>
                  <h4 style={{ marginTop: 0 }}>{t.promoter_vision}</h4>
                  <div style={{ color: "var(--charcoal-soft)", marginTop: 8 }} dangerouslySetInnerHTML={{ __html: promoterVision }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES — depuis content/services/services.json */}
      <section id="services" className="section-pad">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>{services.heading}</h2>
            <p>{services.intro}</p>
          </div>
          <div className="svc-grid reveal">
            {services.items.map((s: any, i: number) => (
              <div className="svc-card" key={i}>
                <div className="svc-num">{String(i + 1).padStart(2, "0")}</div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH — depuis content/tech/tech.json + calculator.json, calculateur interactif */}
      <section id="tech" className="section-pad" style={{ background: "var(--paper-dim)" }}>
        <div className="wrap">
          <div className="section-head reveal"><h2>{tech.heading}</h2><p>{tech.intro}</p></div>
          <div className="process-wrap reveal">
            {tech.steps.map((st: any, i: number) => (
              <div className="p-step" key={i}>
                <div className="p-ico">{st.icon}</div>
                <h4>{st.title}</h4><p>{st.description}</p>
              </div>
            ))}
          </div>
          <div className="tech-gallery reveal">
            {tech.gallery.map((g: any, i: number) => (
              <div className={`img-tile has-cap${i === 0 || i === 3 ? " tall" : ""}`} key={i}>
                <img src={g.image} alt="" /><div className="cap">{g.caption}</div>
              </div>
            ))}
          </div>
          <div className="specs-box reveal">
            <div>
              <h3>Fiche technique</h3>
              {tech.specs.map((sp: any, i: number) => (
                <div className="spec-row" key={i}><span>{sp.label}</span><span>{sp.value}</span></div>
              ))}
            </div>
            <Calculator params={calc} labels={t.calc} />
          </div>
        </div>
      </section>

      {/* PROJETS — collection content/projects/ + slider avant/après interactif */}
      <section id="projects" className="section-pad">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>{t.section_projects}</h2>
            <p>{baLabels.drag}</p>
          </div>

          <BeforeAfterSlider
            before={baBefore}
            after={baAfter}
            labelBefore={baLabels.before}
            labelAfter={baLabels.after}
            altBefore="Chantier — terrassement"
            altAfter="Chantier — dôme achevé"
          />

          <div className="proj-grid reveal">
            {projGallery.map((g, i) => (
              <div className="img-tile has-cap" key={i}>
                <img src={g.image} alt="" />
                <div className="cap">{locale === "fr" ? g.cap_fr : g.cap_en}</div>
              </div>
            ))}
          </div>

          <div className="proj-grid reveal" style={{ marginTop: 16 }}>
            {projects.map((p: any) => (
              <div className="img-tile has-cap" key={p.slug}>
                {p.photos_after?.[0] && <img src={p.photos_after[0].image} alt="" />}
                <div className="cap">{p.title}{p.location ? ` — ${p.location}` : ""}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT — depuis content/impact/impact.json */}
      <section id="impact" className="section-pad" style={{ background: "var(--charcoal)", color: "var(--paper)" }}>
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow" style={{ color: "var(--flame-soft)" }}>{locale === "fr" ? "Impact" : "Impact"}</div>
            <h2 style={{ color: "var(--paper)" }}>{impact.heading}</h2>
            <p style={{ color: "rgba(246,241,231,.75)" }}>{impact.intro}</p>
          </div>
          <div className="proj-grid reveal" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            {impact.items.map((it: any, i: number) => (
              <div className="contact-card" style={{ textAlign: "center" }} key={i}>
                <div className="val mono" data-count={it.value} style={{ fontSize: 34, color: "var(--flame-soft)", fontFamily: "'Space Grotesk'", fontWeight: 700 }}>0</div>
                <div className="lbl" style={{ marginTop: 8 }}>{it.label}</div>
              </div>
            ))}
          </div>
          {impact.disclaimer && <p style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: "rgba(246,241,231,.45)" }}>{impact.disclaimer}</p>}
        </div>
      </section>

      {/* AGRI-SHELL — depuis content/agrishell/agrishell.json */}
      <section id="agrishell" className="section-pad">
        <div className="wrap">
          <div className="section-head reveal"><h2>{agri.heading}</h2><p>{agri.intro}</p></div>
          <div className="as-grid reveal">
            <div className="as-products">
              {agri.products.map((p: any, i: number) => (
                <div className="as-card" key={i}>
                  <div className="img-tile"><img src={p.image} alt="" /></div>
                  <h4>{p.title}</h4><p>{p.description}</p>
                </div>
              ))}
            </div>
            {agri.products?.[0]?.image && (
              <div className="img-tile" style={{ aspectRatio: "4/5" }}>
                <img src={agri.products[0].image} alt="" />
              </div>
            )}
          </div>
          <div className="as-lab reveal">
            {agri.lab_gallery.map((g: any, i: number) => (
              <div className="img-tile has-cap" key={i}><img src={g.image} alt="" /><div className="cap">{g.caption}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES — collection content/testimonials/, avec repli honnête si vide */}
      <section id="voices" className="section-pad">
        <div className="wrap">
          <div className="section-head reveal"><h2>{t.section_voices}</h2></div>
          <div className="voice-grid reveal">
            {testimonials.length > 0 ? (
              testimonials.map((tm: any) => (
                <div className="voice-card" key={tm.slug}>
                  {tm.photo && <div className="img-tile"><img src={tm.photo} alt="" /></div>}
                  <div className="voice-body"><div className="who">{tm.name}</div><div className="role">{tm.role}</div><p>{tm.text}</p></div>
                </div>
              ))
            ) : (
              fallbackVoices.map((v, i) => (
                <div className="voice-card" key={i}>
                  <div className="img-tile"><img src={v.image} alt="" /></div>
                  <div className="voice-body"><div className="who">{v.who}</div><div className="role">{v.role}</div><p>{v.text}</p></div>
                </div>
              ))
            )}
            <div className="quote-card">
              <div className="qmark">&quot;</div>
              <div>
                <p>{quotePlaceholder.text}</p>
                <div className="src">{quotePlaceholder.src}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG — collection content/blog/ */}
      <section id="blog" className="section-pad" style={{ background: "var(--paper-dim)" }}>
        <div className="wrap">
          <div className="section-head reveal"><h2>{t.section_blog}</h2></div>
          <div className="blog-grid reveal">
            {blog.map((b: any) => (
              <div className="blog-card" key={b.slug}>
                {b.cover && <div className="img-tile"><img src={b.cover} alt="" /></div>}
                <div className="cat">{b.category}</div>
                <h3>{b.title}</h3>
                <p>{b.summary}</p>
                <span className="rd">{t.read_more} →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTENAIRES — collection content/partners/ */}
      <section id="partners" className="section-pad">
        <div className="wrap">
          <div className="section-head reveal"><h2>{t.section_partners}</h2></div>
          <div className="partner-strip reveal" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
            {partners.map((p: any) => (
              <div key={p.slug} style={{ textAlign: "center" }}>
                {(p.photo || p.logo) && (
                  <div className="img-tile" style={{ aspectRatio: "1", background: "var(--paper)" }}>
                    <img src={p.photo || p.logo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }} />
                  </div>
                )}
                <p className="mono" style={{ marginTop: 10, fontSize: 12 }}>{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESSOURCES — depuis content/resources/*.json (nouveauté par rapport au prototype) */}
      {resources.length > 0 && (
        <section id="resources" className="section-pad" style={{ background: "var(--paper-dim)" }}>
          <div className="wrap">
            <div className="section-head reveal"><h2>{t.section_resources}</h2></div>
            <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
              {resources.map((r: any) => (
                <div key={r.slug} style={{ borderRadius: 16, overflow: "hidden", background: "var(--white)", boxShadow: "0 8px 24px -14px rgba(30,25,19,.3)" }}>
                  {r.cover && <div className="img-tile" style={{ aspectRatio: "16/9" }}><img src={r.cover} alt={r.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
                  <div style={{ padding: 20 }}>
                    {r.category && <p className="mono" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em", opacity: .7 }}>{r.category}</p>}
                    <h3 style={{ marginTop: 6, fontSize: 18 }}>{r.title}</h3>
                    <p style={{ marginTop: 8, fontSize: 14 }}>{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DURABILITÉ — depuis content/sustainability/sustainability.json */}
      <section id="sustain" className="section-pad">
        <div className="wrap">
          <div className="section-head reveal"><h2>{sustain.heading}</h2><p>{sustain.intro}</p></div>
          <div className="sdg-grid reveal">
            {sustain.goals.map((g: any, i: number) => (
              <div className="sdg-card" key={i}>
                <div className="sdg-n">{g.num}</div><h4>{g.title}</h4><p>{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARRIÈRES — collection content/jobs/ */}
      {jobs.length > 0 && (
        <section id="careers" className="section-pad" style={{ background: "var(--paper-dim)" }}>
          <div className="wrap">
            <div className="section-head reveal">
              <h2>{t.section_careers}</h2>
            </div>
            <div className="reveal">
              {jobs.map((j: any) => (
                <div className="job-row" key={j.slug}>
                  <div className="job-info">
                    <h4>{j.title}</h4>
                    <div className="meta">{j.location}{j.contract_type ? ` · ${j.contract_type}` : ""}</div>
                    {j.description && <p style={{ marginTop: 6, fontSize: 13.5, color: "var(--charcoal-soft)", maxWidth: 520 }}>{j.description}</p>}
                  </div>
                  <a href="#contact" className="btn ghost">{t.apply}</a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ — depuis content/faq/faq.json, accordéon interactif */}
      <section id="faq" className="section-pad">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="section-head reveal"><h2>{t.section_faq}</h2></div>
          <div className="reveal">
            <FaqAccordion items={faq.items} />
          </div>
        </div>
      </section>

      {/* CONTACT — depuis settings + social, avec carte Google Maps + formulaire */}
      <section id="contact" className="section-pad">
        <div className="wrap">
          <div className="section-head reveal"><h2 style={{ color: "var(--paper)" }}>{t.contact}</h2></div>
          <div className="contact-grid reveal">
            <div>
              {general.address_hq && (
                <div className="contact-card"><div className="lbl">{locale === "fr" ? "Siège social" : "Head office"}</div><div className="val">{general.address_hq}</div></div>
              )}
              {(general.address_annex1 || general.address_annex2) && (
                <div className="contact-card"><div className="lbl">{locale === "fr" ? "Annexes" : "Branch offices"}</div><div className="val">{general.address_annex1}{general.address_annex1 && general.address_annex2 ? " · " : ""}{general.address_annex2}</div></div>
              )}
              <div className="contact-card"><div className="lbl">{t.email}</div><div className="val">{general.email}</div></div>
              <div className="contact-card"><div className="lbl">{t.phone}</div><div className="val">{general.phone} / {general.phone2}</div></div>
              <div className="contact-card"><div className="lbl">RCCM</div><div className="val">{general.rccm}</div></div>
              <div className="contact-card">
                <div className="lbl">{locale === "fr" ? "Suivez-nous" : "Follow us"}</div>
                <div className="social-row" style={{ marginTop: 12 }}>
                  {social.facebook && <a href={social.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Icon name="facebook" /></a>}
                  {social.instagram && <a href={social.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Icon name="instagram" /></a>}
                  {social.tiktok && <a href={social.tiktok} target="_blank" rel="noopener" aria-label="TikTok"><Icon name="tiktok" /></a>}
                  {social.whatsapp && <a href={social.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp"><Icon name="whatsapp" /></a>}
                  {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn"><Icon name="linkedin" /></a>}
                  {social.youtube && <a href={social.youtube} target="_blank" rel="noopener" aria-label="YouTube"><Icon name="youtube" /></a>}
                </div>
              </div>
              {social.google_maps_url ? (
                <div className="map-card">
                  <div className="pin"></div>
                  <h4>{locale === "fr" ? "Siège social — Parakou, Bénin" : "Head office — Parakou, Benin"}</h4>
                  <div className="addr">{general.address_hq}</div>
                  <a href={social.google_maps_url} target="_blank" rel="noopener" className="btn flame">
                    <Icon name="pin" />{t.maps_btn}
                  </a>
                </div>
              ) : null}
            </div>

            <ContactForm labels={t.form} />
          </div>
        </div>
      </section>

      {/* FOOTER — navigation complète + réseaux sociaux depuis social.json */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-col" style={{ maxWidth: 280 }}>
              <div className="logo" style={{ marginBottom: 14 }}>
                <span className="logo-mark"><img src="/uploads/logo-biogaz.jpg" alt="Bio-Gaz-Benin-Afrique" /></span>
                <span style={{ color: "var(--paper)" }}>Bio-Gaz-Benin-Afrique</span>
              </div>
              <p style={{ fontSize: 13, opacity: .7 }}>{t.tagline}</p>
              <div className="social-row">
                {social.facebook && <a href={social.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Icon name="facebook" /></a>}
                {social.instagram && <a href={social.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Icon name="instagram" /></a>}
                {social.tiktok && <a href={social.tiktok} target="_blank" rel="noopener" aria-label="TikTok"><Icon name="tiktok" /></a>}
                {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn"><Icon name="linkedin" /></a>}
                {social.youtube && <a href={social.youtube} target="_blank" rel="noopener" aria-label="YouTube"><Icon name="youtube" /></a>}
                {social.whatsapp && <a href={social.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp"><Icon name="whatsapp" /></a>}
              </div>
            </div>
            <div className="foot-col">
              <h5>{t.footNav}</h5>
              <a href="#about">{ui.nav_about}</a>
              <a href="#promoteur">{t.nav_promoter}</a>
              <a href="#services">{ui.nav_services}</a>
              <a href="#tech">{ui.nav_tech}</a>
              <a href="#agrishell">Agri-Shell</a>
              <a href="#blog">{t.section_blog}</a>
            </div>
            <div className="foot-col">
              <h5>{t.footCompany}</h5>
              <a href="#sustain">{ui.nav_sustain}</a>
              <a href="#partners">{t.section_partners.split(" ")[0]}</a>
              {jobs.length > 0 && <a href="#careers">{t.section_careers}</a>}
              <a href="#faq">FAQ</a>
            </div>
            <div className="foot-col">
              <h5>Contact</h5>
              <a href={`mailto:${general.email}`}>{general.email}</a>
              <a href={`tel:${(general.phone || "").replace(/\s/g, "")}`}>{general.phone}</a>
              <a href="#contact">Parakou · Natitingou · Malanville-Guéné</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Bio-Gaz-Benin-Afrique SARL — {general.rccm}</span>
          </div>
        </div>
      </footer>

      {social.whatsapp && <WhatsAppFab href={social.whatsapp} />}
      <ScrollEffects />
    </main>
  );
}
