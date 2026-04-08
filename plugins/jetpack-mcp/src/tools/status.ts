import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getDataLayer } from '../lib/data-layer.js';

export function registerStatusTools(server: McpServer) {
  server.tool(
    'jetpack_swarm_status',
    'Get full Jetpack swarm status including task counts, agent states, and quality metrics',
    {},
    async () => {
      const dl = await getDataLayer();
      const status = await dl.getSwarmStatus();
      return { content: [{ type: 'text', text: JSON.stringify(status, null, 2) }] };
    }
  );
}
