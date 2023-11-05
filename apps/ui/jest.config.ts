import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.svg$": "jest-transformer-svg",
  },
  testEnvironment: "jest-environment-jsdom",
};

export default config;
