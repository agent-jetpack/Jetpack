// Shim that loads better-sqlite3 via createRequire so it resolves from the
// plugin data directory (where the SessionStart hook installs it), not from
// the bundle's location.
import { createRequire } from 'module';

const require = createRequire(process.cwd() + '/package.json');
const Database = require('better-sqlite3');

export default Database;
