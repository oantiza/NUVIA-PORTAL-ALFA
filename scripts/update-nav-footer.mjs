import { synchronizeSiteShell } from './site-shell.mjs';

const options = process.argv.slice(2);
const unknown = options.filter(option => !['--check', '--dry-run'].includes(option));
if (unknown.length) throw new Error(`Opciones de cáscara desconocidas: ${unknown.join(', ')}`);
await synchronizeSiteShell({ check: options.includes('--check'), dryRun: options.includes('--dry-run') });
