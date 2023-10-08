import { spawn } from "child_process";
import path from "path";

function createChildProcess(file: string): Promise<void> {
  const child = spawn("node", [file]);

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
      createChildProcess(
        path.join(
          __dirname,
          "node_modules",
          "@graphql-debugger",
          "backend",
          "build",
          "main.js",
        ),
      ),
      createChildProcess(
        path.join(
          __dirname,
          "node_modules",
          "@graphql-debugger",
          "collector-proxy",
          "build",
          "main.js",
        ),
      ),
    ];

    await Promise.all(childProcesses);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("All child processes completed successfully.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

process.on("exit", () => {
  process.kill(-process.pid, "SIGTERM");
});
process.on("SIGINT", () => {
  process.kill(-process.pid, "SIGINT");
  process.exit();
});
process.on("SIGTERM", () => {
  process.kill(-process.pid, "SIGTERM");
  process.exit();
});
