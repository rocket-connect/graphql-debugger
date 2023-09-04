import fs from "fs";
import path from "path";

function updatePackageJsonVersion(filePath: string, version: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(content);
  json.version = version;

  const updatedContent = JSON.stringify(
    json,
    function (key, value) {
      if (key === "version" || String(value).includes("workspace:^")) {
        return version;
      }

      return value;
    },
    2,
  );

  fs.writeFileSync(filePath, updatedContent);
}

export function searchAndReplace(rootDir: string, version: string) {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    if (fullPath.includes("node_modules")) continue;

    if (entry.isDirectory()) {
      searchAndReplace(fullPath, version);
    } else if (entry.isFile() && entry.name === "package.json") {
      updatePackageJsonVersion(fullPath, version);
    }
  }
}

const version = process.env.VERSION;
const startPath = process.env.START_PATH;

if (!version) {
  console.error("Please set the VERSION environment variable.");
  process.exit(1);
}

if (!startPath) {
  console.error("Please set the START_PATH environment variable.");
  process.exit(1);
}

searchAndReplace(startPath, version);
