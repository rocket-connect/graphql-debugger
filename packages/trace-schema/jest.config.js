module.exports = {
  modulePathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/node_modules/",
    "<rootDir>/build/",
  ],
  testTimeout: 15000,
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
};
