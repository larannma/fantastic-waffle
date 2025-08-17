import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import importPlugin from "eslint-plugin-import"

export default defineConfig([
  {
    files: ["src/**/*.ts"],
    plugins: {
      js,
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
    },
    extends: ["js/recommended"],
    ignores: [
      './dist',
      './node_modules',
      './*/*.d.ts',
    ],
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      // General JS/TS rules
      "no-console": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
      "eol-last": ["error", "always"],

      // Formatting / style rules
      "quotes": ["error", "single", { avoidEscape: true }], // single quotes
      "semi": ["error", "always"], // no semicolons
      "comma-dangle": ["error", "only-multiline"], // trailing commas on multiline
      "max-len": ["warn", { code: 120 }], // max line length 80

      // Import rules
      "import/order": [
        "warn",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
          "alphabetize": { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
]);
