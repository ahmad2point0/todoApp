/* eslint-disable prettier/prettier */
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier", "react-native"],
  rules: {
    "prettier/prettier": ["error", { "endOfLine": "auto" }],
    "react-native/no-unused-styles": "error",
  },
};
