import { execSync } from "child_process";

const version = process.env.VERSION;
const startPath = process.env.START_PATH;

function releaseNewVersion() {
  const branch = execSync("git symbolic-ref --short HEAD").toString().trim();
  if (branch !== "main") {
    console.error(
      "Error: You must be on the main branch to release a new version.",
    );
    process.exit(1);
  }

  execSync("git pull");

  execSync(
    `VERSION=${version} IGNORE_WORKSPACE=true START_PATH=${startPath} node ./packages/utils/build/bump-versions.js`,
  );

  execSync("pnpm i");
  execSync("pnpm format");
  execSync("git add .");
  execSync(`git commit -m ${version}`);
}

if (!version) {
  console.error("Please set the VERSION environment variable.");
  process.exit(1);
}

if (!startPath) {
  console.error("Please set the START_PATH environment variable.");
  process.exit(1);
}

releaseNewVersion();
