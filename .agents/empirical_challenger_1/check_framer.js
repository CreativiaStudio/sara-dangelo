const fs = require('fs');
const path = require('path');

function checkFramerMotion(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      checkFramerMotion(fullPath);
    } else if (file.isFile() && fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('framer-motion') || content.includes('framerMotion')) {
        console.log(`Found framer-motion reference in ${fullPath}`);
        return;
      }
    }
  }
}

try {
  checkFramerMotion('./.next');
  console.log('Search complete.');
} catch (e) {
  console.error(e);
}
