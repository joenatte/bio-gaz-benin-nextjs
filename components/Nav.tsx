"use client";

import { useEffect, useState } from "react";
import type { Locale } from "../lib/i18n";

type NavLink = { href: string; label: string };

export default function Nav({
  locale,
  logo,
  brandName,
  brandSub,
  links,
  ctaLabel,
}: {
  locale: Locale;
  logo: string;
  brandName: string;
  brandSub: string;
  links: NavLink[];
  ctaLabel: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav id="nav" className={scrolled ? "scrolled" : ""}>
      <div className="wrap nav-row">
        <a href={`/${locale}#hero`} className="logo">
          <span className="logo-mark">
            <img src={logo} alt="Bio-Gaz-Benin-Afrique" />
          </span>
          <span>
            {brandName}
            <small>{brandSub}</small>
          </span>
        </a>

        <div className={`nav-links${open ? " open" : ""}`} id="navLinks">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="nav-right">
          <div className="lang-toggle">
            <a href="/fr" className={locale === "fr" ? "active" : ""}>FR</a>
            <a href="/en" className={locale === "en" ? "active" : ""}>EN</a>
          </div>
          <a href="#contact" className="btn solid" style={{ padding: "11px 20px", fontSize: 13 }}>
            {ctaLabel}
          </a>
          <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
