import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getDataLayer } from '../lib/data-layer.js';

export function registerAgentTools(server: McpServer) {
  server.tool(
    'jetpack_agent_list',
    'List registered agents in the Jetpack swarm',
    {
      status: z.enum(['idle', 'busy', 'error', 'offline', 'shutting_down']).optional().describe('Filter by agent status'),
      type: z.enum(['claude-code', 'codex', 'gemini', 'browser', 'custom']).optional().describe('Filter by agent type'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const agents = await dl.agents.list({
        status: params.status,
        type: params.type,
      });
      return { content: [{ type: 'text', text: JSON.stringify(agents, null, 2) }] };
    }
  );

  server.tool(
    'jetpack_agent_get',
    'Get details for a specific agent by ID',
    {
      id: z.string().describe('Agent ID'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const agent = await dl.agents.get(params.id);
      if (!agent) {
        return { content: [{ type: 'text', text: `Agent ${params.id} not found` }], isError: true };
      }
      return { content: [{ type: 'text', text: JSON.stringify(agent, null, 2) }] };
    }
  );
}
