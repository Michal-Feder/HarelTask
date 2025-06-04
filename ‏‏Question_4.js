const fs = require('fs').promises;
const path = require('path');

/**
 * @param {string} folderPath - Path to the directory.
 * @param {Dirent} file - File entry from readdir.
 * @returns {Promise<{name: string, size: number} | null>}
 */
async function getFileInfo(folderPath, file) {
  if (!file.isFile()) return null;

  const fullPath = path.join(folderPath, file.name);
  try {
    const stats = await fs.stat(fullPath);
    return { name: file.name, size: stats.size };
  } catch (err) {
    console.warn(
      `Warning: Failed to read info for "${file.name}": ${err.message}`
    );
    return null;
  }
}

/**
 * @param {string} folderPath - Path to the directory.
 * @returns {Promise<string[]>} - Sorted list of file names.
 */
async function getSortedFilesBySize(folderPath) {
  try {
    const dirents = await fs.readdir(folderPath, { withFileTypes: true });

    const fileStats = await Promise.all(
      dirents.map((file) => getFileInfo(folderPath, file))
    );

    const validFiles = fileStats.filter(Boolean);

    validFiles.sort((a, b) => a.size - b.size || a.name.localeCompare(b.name));

    return validFiles;
  } catch (err) {
    console.error(`Error reading directory "${folderPath}": ${err.message}`);
    throw err;
  }
}

getSortedFilesBySize('./')
  .then((sortedFiles) => {
    console.log('📄 Files sorted by size:');
    console.table(sortedFiles);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
  });
