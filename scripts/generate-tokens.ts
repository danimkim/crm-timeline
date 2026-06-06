import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { themes } from '../src/styles/tokens/themes';
import { generateCss } from '../src/styles/tokens/generate';

const CSS_PATH    = resolve(process.cwd(), 'src/app/globals.css');
const START_MARKER = '/* @tokens-start';
const END_MARKER   = '/* @tokens-end */';

const current   = readFileSync(CSS_PATH, 'utf8');
const generated = generateCss(themes);

const startIdx = current.indexOf(START_MARKER);
const endIdx   = current.indexOf(END_MARKER);

let updated: string;
if (startIdx !== -1 && endIdx !== -1) {
  updated =
    current.slice(0, startIdx) +
    generated +
    current.slice(endIdx + END_MARKER.length);
} else {
  throw new Error(
    'Token markers not found in globals.css.\n' +
    'Add "/* @tokens-start */" and "/* @tokens-end */" to globals.css first.',
  );
}

writeFileSync(CSS_PATH, updated, 'utf8');
console.log('Design tokens written to globals.css');
