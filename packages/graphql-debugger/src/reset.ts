#!/usr/bin/env node
import path from "path";

const { execSync } = require("child_process");

console.log("Resetting database");

try {
  execSync(
    `cd ${path.join(
      __dirname,
      "../../data-access",
    )} && npx prisma migrate reset --force`,
    {
      stdio: "inherit",
      shell: true,
    },
  );
  console.log("Database reset");
} catch (error) {
  console.error("Database reset failed:", error);
}
