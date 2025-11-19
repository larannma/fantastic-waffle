/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  ignoreFiles: [
    'src/styles/normalize.scss'
  ],
  rules: {
    "selector-class-pattern": null
  }
};
