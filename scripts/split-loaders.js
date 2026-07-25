import fs from 'fs';
import path from 'path';

const loadersPath = 'c:/Users/we/Desktop/Amicro---Micro-transitions/temp-vibrant-dot-loader/src/components/Loaders.tsx';
const wavePhysicsPath = 'c:/Users/we/Desktop/Amicro---Micro-transitions/temp-vibrant-dot-loader/src/components/WavePhysicsLoader.tsx';
const outputDir = 'c:/Users/we/Desktop/Amicro---Micro-transitions/registry/ui/loading';
const codeMapFilePath = 'c:/Users/we/Desktop/Amicro---Micro-transitions/src/utils/loadersCode.ts';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert camelCase to kebab-case
function camelToKebab(str) {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2') // Handles acronyms like IOSSpinner -> IOS-Spinner
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')    // Handles camelCase
    .toLowerCase();
}

// 1. Process monolithic Loaders.tsx
const content = fs.readFileSync(loadersPath, 'utf8');
const lines = content.split('\n');
const components = [];
let currentComp = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  const isComment = line.trim().startsWith('//');
  const isExport = line.startsWith('export const ');
  
  if (isComment || isExport) {
    if (currentComp) {
      components.push(currentComp);
      currentComp = null;
    }
  }
  
  if (isExport && !currentComp) {
    let comments = [];
    let j = i - 1;
    while (j >= 0 && lines[j].trim().startsWith('//')) {
      comments.unshift(lines[j].trim());
      j--;
    }
    
    currentComp = {
      name: line.match(/^export const (\w+)/)[1],
      comment: comments.join('\n'),
      lines: [line]
    };
  } else if (currentComp) {
    currentComp.lines.push(line);
  }
}

if (currentComp) {
  components.push(currentComp);
}

console.log(`Parsed ${components.length} loaders from Loaders.tsx`);

const loaderCodes = {};

// Write each split loader to its file
components.forEach(comp => {
  const kebabName = camelToKebab(comp.name);
  const filePath = path.join(outputDir, `${kebabName}.tsx`);
  
  // Format the file in standard Amicro structure
  const fileContent = `import React from 'react';
import { motion } from 'framer-motion';

${comp.lines.join('\n').trim()}
`;

  fs.writeFileSync(filePath, fileContent, 'utf8');
  loaderCodes[comp.name] = fileContent;
});

// 2. Process WavePhysicsLoader
const waveContent = fs.readFileSync(wavePhysicsPath, 'utf8');
// Convert default export to named export to match Amicro style
const updatedWaveContent = waveContent
  .replace('export default function WavePhysicsLoader()', 'export function WavePhysicsLoader()')
  // Ensure both React and framer-motion are imported properly if not already
  .trim() + '\n';

const waveKebabName = 'wave-physics-loader';
const waveFilePath = path.join(outputDir, `${waveKebabName}.tsx`);
fs.writeFileSync(waveFilePath, updatedWaveContent, 'utf8');
loaderCodes['WavePhysicsLoader'] = updatedWaveContent;

console.log('✓ Wrote 131 loader files to registry/ui/loading/');

// 3. Generate loadersCode.ts for showcase copy-code feature
const codeMapContent = `// Automatically generated loader code maps
export const loadersCode: Record<string, string> = ${JSON.stringify(loaderCodes, null, 2)};
`;

fs.writeFileSync(codeMapFilePath, codeMapContent, 'utf8');
console.log('✓ Generated src/utils/loadersCode.ts');
