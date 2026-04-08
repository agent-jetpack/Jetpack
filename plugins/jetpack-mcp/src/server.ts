import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTaskTools } from './tools/tasks.js';
import { registerAgentTools } from './tools/agents.js';
import { registerStatusTools } from './tools/status.js';
import { registerMessageTools } from './tools/messages.js';
import { registerQualityTools } from './tools/quality.js';
import { closeDataLayer } from './lib/data-layer.js';

const server = new McpServer({
  name: 'jetpack',
  version: '0.1.0',
});

// Register all tool groups
registerTaskTools(server);
registerAgentTools(server);
registerStatusTools(server);
registerMessageTools(server);
registerQualityTools(server);

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDataLayer();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDataLayer();
  process.exit(0);
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
