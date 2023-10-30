#!/usr/bin/env node
import { BACKEND_PORT } from "@graphql-debugger/backend";

import axios from "axios";
import { SpawnOptionsWithoutStdio, spawn } from "child_process";
import path from "path";

const { name, version } = require("../package.json");

const COLLECTOR_PATH = process.env.COLLECTOR_PATH
  ? path.join(__dirname, process.env.COLLECTOR_PATH)
  : path.join(
      __dirname,
      "../",
      "../",
      "@graphql-debugger",
      "backend",
      "build",
      "main.js",
    );

const BACKEND_PATH = process.env.BACKEND_PATH
  ? path.join(__dirname, process.env.BACKEND_PATH)
  : path.join(
      __dirname,
      "../",
      "../",
      "@graphql-debugger",
      "collector-proxy",
      "build",
      "main.js",
    );
const childPids: number[] = []; // <-- Create a list to hold the child process PIDs.

function createChildProcess(
  file: string,
  options?: SpawnOptionsWithoutStdio,
): Promise<void> {
  const child = spawn("node", [file], options);

  childPids.push(child.pid as number);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  return new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`${file} process exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function main() {
  try {
    const childProcesses = [
      createChildProcess(COLLECTOR_PATH, {
        env: {
          ...process.env,
        },
      }),
      createChildProcess(BACKEND_PATH, {
        env: {
          ...process.env,
          TRACE_PRISMA: undefined,
        },
      }),
    ];

    let versionWarning: string[] = [];
    try {
      const response = await axios.get(`https://registry.npmjs.org/${name}`);
      const latestVersion = response.data["dist-tags"].latest;

      if (latestVersion !== version) {
        versionWarning = [
          `\x1b[33mGraphQL Debugger '${name}@${latestVersion}' is available.`,
          "Consider updating for the latest features and fixes.",
          "\x1b[0m",
        ];
      }
    } catch (e) {
      console.error(e);
    }

    const coreMessages = [
      "Thank you for downloading GraphQL Debugger!",
      "Visit https://www.graphql-debugger.com for more info.",
      `Debugger Online, visit http://localhost:${BACKEND_PORT} to get started.`,
    ];

    let messagesToDisplay = ["\x1b[32m", ...coreMessages, "\x1b[0m"];

    if (versionWarning.length) {
      messagesToDisplay = [...messagesToDisplay, ...versionWarning];
    }

    console.log(messagesToDisplay.map((message) => `\n\n${message}`).join(""));

    await Promise.all(childProcesses);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => {
    // Forever.
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function cleanupAndExit(signal: NodeJS.Signals) {
  for (const pid of childPids) {
    try {
      process.kill(pid, signal);
    } catch (err) {
      // Ignore errors.
    }
  }
  process.exit(signal === "SIGTERM" ? 0 : 1);
}

process.on("exit", () => cleanupAndExit("SIGTERM"));
process.on("SIGINT", () => cleanupAndExit("SIGINT"));
process.on("SIGTERM", () => cleanupAndExit("SIGTERM"));
