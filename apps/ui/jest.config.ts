import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: "jest-environment-jsdom",
  //   collectCoverage: true,
  //   coverageDirectory: "./src/tests/coverage",
};

export default config;
