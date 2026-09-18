import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONFIRMATION_SUBJECT,
  buildConfirmationText,
} from "../src/lib/contact-confirmation.ts";

// Die Eingangsbestaetigung geht an Fremde. Was sie enthalten MUSS, ist damit
// keine Geschmacksfrage: Name, Nachricht im Wortlaut, der Hinweis auf den
// automatischen Versand — und die Sprache, in der geschrieben wurde.

test("deutsch: Name, Wortlaut, Automatik-Hinweis", () => {
  const message = "Ich suche Unterstuetzung in einem Releaseprojekt.";
  const text = buildConfirmationText("de", "Frau Keller", message);
  assert.ok(text.includes("Hallo Frau Keller,"));
  assert.ok(text.includes(message));
  assert.ok(text.includes("automatisch versendet"));
});

test("englisch: dieselben Pflichtteile, englischer Wortlaut", () => {
  const message = "We are looking for release management support.";
  const text = buildConfirmationText("en", "Ms Keller", message);
  assert.ok(text.includes("Hello Ms Keller,"));
  assert.ok(text.includes(message));
  assert.ok(text.includes("sent automatically"));
});

test("die Sprachen sind wirklich verschieden", () => {
  const de = buildConfirmationText("de", "X", "Y");
  const en = buildConfirmationText("en", "X", "Y");
  assert.notEqual(de, en);
  assert.ok(!en.includes("Viele Gruesse"));
  assert.ok(!de.includes("Best regards"));
});

test("beide Betreffzeilen nennen den Empfaenger der Anfrage", () => {
  assert.ok(CONFIRMATION_SUBJECT.de.includes("German Rauhut"));
  assert.ok(CONFIRMATION_SUBJECT.en.includes("German Rauhut"));
});

test("beide Sprachen tragen einen Weg zurueck", () => {
  for (const lang of ["de", "en"]) {
    const text = buildConfirmationText(lang, "X", "Y");
    assert.ok(text.includes("https://rauhut.com"));
    assert.ok(text.includes("calendly.com/rauhut/20min"));
  }
});
