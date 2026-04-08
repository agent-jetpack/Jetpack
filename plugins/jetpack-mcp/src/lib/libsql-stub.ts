// Stub for @libsql/client — the MCP server only uses SQLite (better-sqlite3),
// not Turso. This stub prevents the native @libsql bindings from being required.
export function createClient() {
  throw new Error('Turso client not available in MCP plugin — use SQLite mode');
}
