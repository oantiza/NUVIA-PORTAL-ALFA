import { synchronizeSiteShell } from './site-shell.mjs';

await synchronizeSiteShell({ check: process.argv.includes('--check') });
