import fs from 'fs';
import path from 'path';
import { loaderGroups } from '../src/data/loaders.ts';

const dir = './registry/ui/loading';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const codeMap = {};

files.forEach(file => {
  const kebabName = file.replace('.tsx', '');
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Map by kebab-case filename (e.g. 'pulse-dots')
  codeMap[kebabName] = content;
  
  // Map by export function/const name (e.g. 'PulseDots')
  const matches = content.matchAll(/export\s+(?:const|function)\s+([A-Za-z0-9_]+)/g);
  for (const match of matches) {
    if (match[1]) {
      codeMap[match[1]] = content;
    }
  }
});

// Also map by loader.name from loaderGroups
for (const group of loaderGroups) {
  for (const loader of group.loaders) {
    const code = codeMap[loader.kebabName] || (loader.component && codeMap[loader.component.name]);
    if (code) {
      codeMap[loader.name] = code;
      codeMap[loader.kebabName] = code;
      if (loader.component && loader.component.name) {
        codeMap[loader.component.name] = code;
      }
    } else {
      console.warn('WARNING: Missing loader code for:', loader.name, loader.kebabName);
    }
  }
}

const fileContent = `// Automatically generated loader code maps
export const loadersCode: Record<string, string> = ${JSON.stringify(codeMap, null, 2)};
`;

fs.writeFileSync('./src/utils/loadersCode.ts', fileContent, 'utf8');
console.log(`Successfully generated src/utils/loadersCode.ts with ${Object.keys(codeMap).length} entries.`);
