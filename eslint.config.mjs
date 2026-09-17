import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Design prototypes and brand/reference assets — not application source.
    // These .dc.html screens + their runtime are the visual source of truth,
    // not linted code. See AGENTS.md.
    "**/support.js",
    "**/*.dc.html",
    "scraps/**",
    "Reference/**",
    "references/**",
    "uploads/**",
    "assets/**",
    "docs/**",
  ]),
]);

export default eslintConfig;
