// eslint.config.js
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // {
  //   languageOptions: {
  //     globals: {
  //       ...globals.browser,
  //     },
  //   },
  // },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      semi: ["error", "always"],
      // quotes: ["error", "double"],
      // indent: ["error", 2],
      // "linebreak-style": ["error", "windows"],
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off",
      "no-trailing-spaces": "error",
      // "comma-dangle": ["error", "never"],
      "arrow-spacing": ["error", { before: true, after: true }],
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
      noInlineConfig: false,
    },
  },
]);
