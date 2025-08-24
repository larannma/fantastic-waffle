// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  {
    files: ["src/**/*.{ts,tsx}"], // include both ts and tsx just in case
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
    },
    extends: [
      js.configs.recommended, // correct way for @eslint/js
    ],
    ignores: [
      "dist",
      "node_modules",
      "**/*.d.ts",
    ],
    rules: {
      // ✅ TypeScript rules
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      // ✅ General JS/TS rules
      // "no-console": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
      "eol-last": ["error", "always"],

      // ✅ Formatting / style rules
      "quotes": ["error", "single", { avoidEscape: true }], // enforce single quotes
      "semi": ["error", "never"], // enforce no semicolons
      "comma-dangle": ["error", "only-multiline"], // trailing commas in multiline
      "max-len": ["warn", { code: 120 }], // allow up to 120 chars per line

      // ✅ Import rules
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
]);
