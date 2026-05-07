const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx')).map(f => path.join(srcDir, f));
files.push(path.join(__dirname, 'tweaks-panel.jsx'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes("import React")) {
    content = "import React from 'react';\n" + content;
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Added import to ${file}`);
  }
}
