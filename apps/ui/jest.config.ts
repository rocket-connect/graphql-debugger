import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.svg$": "jest-transformer-svg",
  },
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["./setup.ts"],
};

export default config;
