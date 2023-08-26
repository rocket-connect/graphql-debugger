const fs = require('fs');
const path = require('path');

// Update the version field and any field containing "@workspace" in package.json
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

// Recursively search for package.json files in a directory
function searchAndReplace(rootDir, version) {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  // Loop through each entry (could be a file or directory)
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    // Skip node_modules directory
    if (fullPath.includes('node_modules')) continue;

    if (entry.isDirectory()) {
      // Recursively search in this sub-directory
      searchAndReplace(fullPath, version);
    } else if (entry.isFile() && entry.name === 'package.json') {
      // Update the version in this package.json file
      updatePackageJsonVersion(fullPath, version);
    }
  }
}

// The version to set, from the environment variable
const version = process.env.VERSION;

if (!version) {
  console.error('Please set the VERSION environment variable.');
  process.exit(1);
}

// Starting directory, you can adjust as needed
const startDir = '.';

// Start the search-and-replace
searchAndReplace(startDir, version);
