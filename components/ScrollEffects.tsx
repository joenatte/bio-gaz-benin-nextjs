"use client";

import { useEffect } from "react";

/**
 * Reproduit à l'identique les deux comportements du prototype HTML original :
 *  - reveal on scroll : les éléments `.reveal` reçoivent `.in` quand ils entrent
 *    dans le viewport (fade + translateY).
 *  - compteurs animés : les éléments `[data-count]` s'incrémentent de 0 jusqu'à
 *    leur valeur cible quand ils deviennent visibles.
 *
 * Composant "silencieux" (ne rend rien) : à monter une seule fois en bas de page.
 */
export default function ScrollEffects() {
  useEffect(() => {
    // ---------------- reveal on scroll ----------------
    const revealEls = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));

    // ---------------- animated counters ----------------
    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const target = parseInt(el.getAttribute("data-count") || "0", 10);
            let cur = 0;
            const step = Math.max(1, Math.round(target / 60));
            const t = setInterval(() => {
              cur += step;
              if (cur >= target) {
                cur = target;
                clearInterval(t);
              }
              el.textContent = String(cur);
            }, 22);
            cio.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cio.observe(c));

    return () => {
      io.disconnect();
      cio.disconnect();
    };
  }, []);

  return null;
}
