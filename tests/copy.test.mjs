import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";
import {
  TARIFE,
  STEUERHINWEIS,
  B2B_HINWEIS,
  JAHRES_BADGE,
  jahresSatz,
  jahresVorausCents,
  ersparnisProzent,
} from "../site/assets/pricing.mjs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const preise = read("../site/preise/index.html");
const agb = read("../site/agb/index.html");
const register = read("../site/register/index.html");
const pages = [preise, agb, register, read("../site/index.html"), read("../site/datenschutz/index.html")].join("\n");

test("AGB § 5 Abs. 2 ist der Kleinunternehmer-Satz", () => {
  assert.match(agb, /§ 5 Preise und Zahlung/);
  assert.match(agb, new RegExp(STEUERHINWEIS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(agb, /inklusive der gesetzlichen Mehrwertsteuer/);
});

test("Preise nennen B2B, Jahreszahlung und den Steuerhinweis bei Projektpreisen", () => {
  assert.match(preise, new RegExp(B2B_HINWEIS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(preise, new RegExp(JAHRES_BADGE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(preise, /pro Nutzer \/ Monat/);
  assert.match(preise, /ab 3\.900 € pro Projekt/);
  assert.match(preise, /ab 1\.800 € pro Schulung/);
  assert.match(preise, new RegExp(STEUERHINWEIS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(preise, /Es gelten unsere <a href="\/agb\/">AGB<\/a> und die <a href="\/datenschutz\/">Datenschutzerklärung<\/a>/);
  assert.doesNotMatch(preise, /20%\s*Rabatt|20 % Rabatt/);
  assert.doesNotMatch(preise, /bis 80 % Zuschuss/);
  assert.doesNotMatch(preise, /Rechtlich saubere Programme|kein Vermittler/);
  assert.match(preise, /je nach Programm Zuschüsse möglich \(Bewilligung durch die Behörde, keine Zusage\)/);
});

test("Jahresbetrag Basic ist 9,95 € × 12 = 119,40 €", () => {
  const basic = TARIFE.find((tarif) => tarif.id === "basic");
  assert.equal(jahresVorausCents(basic), 11940);
  assert.equal(
    jahresSatz(basic),
    "einmalig 119,40 € pro Nutzer im Voraus für 12 Monate, Mindestlaufzeit 12 Monate",
  );
  assert.match(preise, /einmalig 119,40 € pro Nutzer im Voraus für 12 Monate, Mindestlaufzeit 12 Monate/);
  assert.equal(jahresVorausCents(TARIFE.find((tarif) => tarif.id === "pro")), 27600);
  assert.equal(jahresVorausCents(TARIFE.find((tarif) => tarif.id === "business")), 56400);
  const max = Math.max(...TARIFE.map(ersparnisProzent));
  assert.ok(max > 23 && max < 23.2);
});

test("Business-Mindestlaufzeit und Team-Funktionen sind nicht als Leistung versprochen", () => {
  assert.match(preise, /ab 10 Nutzer, 12 Monate Mindestlaufzeit/);
  assert.match(preise, /in Planung, nicht Vertragsbestandteil/);
  assert.match(preise, /nicht enthalten/);
  assert.match(preise, /DATEV-Export/);
  assert.match(preise, /SSO \/ SAML/);
  assert.match(preise, /API-Zugang/);
  assert.doesNotMatch(preise, /Folgt: Team-Funktionen/);
});

test("AGB-Tarifnamen, Mindestlaufzeit und keine Zustimmungsfiktion", () => {
  assert.match(agb, /Free, Basic, Pro, Business, Enterprise/);
  assert.doesNotMatch(agb, /Starter, Growth, Enterprise/);
  assert.match(agb, /Für die Tarife Business und Enterprise beträgt die Mindestlaufzeit 12 Monate/);
  assert.match(agb, /99,5 %/);
  assert.doesNotMatch(agb, /gelten als genehmigt/);
  assert.match(agb, /nicht durch Schweigen als genehmigt/);
});

test("Registrierung hat eine Pflicht-Checkbox, /widerruf wird nicht verlinkt", () => {
  assert.match(register, /type="checkbox"/);
  assert.match(register, /required/);
  assert.match(register, /Unternehmer im Sinne des § 14 BGB/);
  assert.equal(existsSync(new URL("../site/widerruf/index.html", import.meta.url)), false);
  assert.doesNotMatch(pages, /href="[^"]*\/widerruf/);
});
