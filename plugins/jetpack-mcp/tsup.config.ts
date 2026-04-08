import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  target: 'node20',
  noExternal: [
    '@jetpack-agent/data',
    '@modelcontextprotocol/sdk',
    'zod',
    'nanoid',
  ],
  splitting: false,
  clean: true,
  esbuildOptions(options) {
    options.alias = {
      // Resolve better-sqlite3 via createRequire from cwd (CLAUDE_PLUGIN_DATA)
      'better-sqlite3': './src/lib/better-sqlite3-shim.ts',
      // Stub out Turso — MCP plugin only uses SQLite
      '@libsql/client': './src/lib/libsql-stub.ts',
    };
  },
});
