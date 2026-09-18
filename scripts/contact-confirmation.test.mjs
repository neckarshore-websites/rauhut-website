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
  // Zeilenweise und auf Gleichheit, nicht per includes() auf den Gesamttext:
  // eine Teilstring-Pruefung auf eine URL waere schwaecher (der Treffer
  // duerfte irgendwo stehen, auch als Teil einer fremden Adresse). CodeQL
  // meldet genau das als js/incomplete-url-substring-sanitization — in
  // neckarshore-website #258 an derselben Stelle aufgeschlagen.
  for (const lang of ["de", "en"]) {
    const lines = buildConfirmationText(lang, "X", "Y").split("\n");
    const countExact = (url) => lines.filter((l) => l === url).length;
    assert.equal(countExact("https://rauhut.com"), 1);
    assert.equal(countExact("https://calendly.com/rauhut/20min"), 1);
  }
});
