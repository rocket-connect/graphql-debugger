const { compilerOptions } = require("./tsconfig.json");
const { pathsToModuleNameMapper } = require("ts-jest");

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  modulePathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/node_modules/",
    "<rootDir>/build/",
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  transform: {
    "\\.ts$": ["ts-jest"],
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: __dirname,
  }),
};
