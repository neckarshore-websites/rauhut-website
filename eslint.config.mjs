import { createRequire } from "node:module";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";


// eslint-plugin-react (von eslint-config-next mitgebracht) erkennt die React-Version
// ueber eine ESLint-9-API, die ESLint 10 entfernt hat — der Lauf bricht dann vor der
// ersten Datei ab. Die Version zu nennen ueberspringt diesen Pfad. Aus package.json
// abgeleitet statt hingeschrieben, damit ein React-Sprung sie nicht still veralten laesst.
const reactVersion = createRequire(import.meta.url)("./package.json").dependencies.react;

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Muss NACH den Voreinstellungen stehen: spaetere Objekte gewinnen bei `settings`.
  { settings: { react: { version: reactVersion } } },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
