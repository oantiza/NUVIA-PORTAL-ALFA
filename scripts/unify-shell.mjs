import { synchronizeSiteShell } from './site-shell.mjs';

console.warn('unify-shell.mjs se conserva como alias; la fuente común es _plantilla.html.');
await synchronizeSiteShell({ check: process.argv.includes('--check') });
