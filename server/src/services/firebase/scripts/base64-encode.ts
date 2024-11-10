import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { copyToClipboard } from './get-firebase-access-token';

const secret = readFileSync(join(__dirname, '/secret.json'), {
  encoding: 'utf-8',
});

const base64EncodedString = Buffer.from(secret).toString('base64');
console.log('generated base64:', base64EncodedString);

const decodedString = Buffer.from(base64EncodedString, 'base64').toString(
  'ascii',
);
console.log('decoded:', decodedString);

copyToClipboard(base64EncodedString);
