const fs = require('fs');
const path = require('path');

function updatePackageJsonVersion(filePath, version) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);
  json.version = version;

  const updatedContent = JSON.stringify(
    json,
    function (key, value) {
      if (key === 'version' || String(value).includes('workspace:^')) {
        return version;
      }

      return value;
    },
    2
  );

  fs.writeFileSync(filePath, updatedContent);
}

function searchAndReplace(rootDir, version) {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    if (fullPath.includes('node_modules')) continue;

    if (entry.isDirectory()) {
      searchAndReplace(fullPath, version);
    } else if (entry.isFile() && entry.name === 'package.json') {
      updatePackageJsonVersion(fullPath, version);
    }
  }
}

const version = process.env.VERSION;

if (!version) {
  console.error('Please set the VERSION environment variable.');
  process.exit(1);
}

const startDir = '.';

searchAndReplace(startDir, version);
