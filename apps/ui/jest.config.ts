import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  //   collectCoverage: true,
  //   coverageDirectory: "./src/tests/coverage",
};

export default config;
