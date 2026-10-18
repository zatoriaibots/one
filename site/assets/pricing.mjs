/** Preise aus dem öffentlichen Tarifkatalog von zatoriai.com, in Cent. */

export const STEUERHINWEIS =
  "Alle Preise verstehen sich in Euro als Endpreise. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und ausgewiesen.";

export const B2B_HINWEIS =
  "Unsere Tarife richten sich ausschließlich an Unternehmer im Sinne des § 14 BGB (kein Verbraucherangebot).";

export const JAHRES_BADGE = "bis zu 23 % günstiger bei Jahreszahlung";

export const TARIFE = [
  {
    id: "free",
    name: "Free",
    monatCents: 0,
    jahrMonatCents: 0,
    mindestlaufzeitMonate: null,
    mindestNutzer: 1,
  },
  {
    id: "basic",
    name: "Basic",
    monatCents: 1295,
    jahrMonatCents: 995,
    mindestlaufzeitMonate: null,
    jahresMindestlaufzeitMonate: 12,
    mindestNutzer: 1,
  },
  {
    id: "pro",
    name: "Pro",
    monatCents: 2900,
    jahrMonatCents: 2300,
    mindestlaufzeitMonate: null,
    jahresMindestlaufzeitMonate: 12,
    mindestNutzer: 1,
  },
  {
    id: "business",
    name: "Business",
    monatCents: 5900,
    jahrMonatCents: 4700,
    mindestlaufzeitMonate: 12,
    jahresMindestlaufzeitMonate: 12,
    mindestNutzer: 10,
  },
];

export function formatEuro(cents, immerCent = false) {
  const euros = Math.trunc(cents / 100);
  const rest = Math.abs(cents % 100);
  const grouped = String(euros).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (!immerCent && rest === 0) return `${grouped} €`;
  return `${grouped},${String(rest).padStart(2, "0")} €`;
}

export function jahresVorausCents(tarif) {
  return tarif.jahrMonatCents * 12;
}

/** Satz für den Jährlich-Toggle. Betrag = Monatsäquivalent × 12, aus den Katalog-Cents. */
export function jahresSatz(tarif) {
  return `einmalig ${formatEuro(jahresVorausCents(tarif), true)} pro Nutzer im Voraus für 12 Monate, Mindestlaufzeit 12 Monate`;
}

export function ersparnisProzent(tarif) {
  if (tarif.monatCents <= 0) return 0;
  return ((tarif.monatCents - tarif.jahrMonatCents) / tarif.monatCents) * 100;
}
