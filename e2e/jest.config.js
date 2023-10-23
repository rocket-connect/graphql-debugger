module.exports = {
  modulePathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/node_modules/",
    "<rootDir>/build/",
  ],
  testTimeout: 150000,
  setupFilesAfterEnv: ["<rootDir>/tests/utils/setup.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
};
