#!/usr/bin/env node
const fs = require('fs');

const files = ['app.js', 'calc.js'];
const errors = [];

files.forEach((file) => {
  const src = fs.readFileSync(file, 'utf8');

  if (!src.endsWith('\n')) {
    errors.push(`${file} must end with a trailing newline.`);
  }

  const lines = src.split('\n');
  lines.forEach((line, index) => {
    if (/\t/.test(line)) {
      errors.push(`${file} line ${index + 1}: tabs are not allowed; use spaces.`);
    }
    if (/\s+$/.test(line)) {
      errors.push(`${file} line ${index + 1}: trailing whitespace found.`);
    }
  });

  if (/console\.log\(/.test(src)) {
    errors.push(`${file}: console.log statements are not allowed in production JS.`);
  }
});

if (errors.length > 0) {
  console.error('Lint failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Lint passed for ${files.join(', ')}`);
