import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getDataLayer } from '../lib/data-layer.js';

export function registerMessageTools(server: McpServer) {
  server.tool(
    'jetpack_message_send',
    'Send a message to an agent or broadcast to all agents',
    {
      type: z.enum([
        'task.help_needed', 'task.handoff', 'task.claimed', 'task.completed',
        'task.failed', 'task.progress', 'file.lock_request', 'file.lock_granted',
        'file.lock_denied', 'coordination.sync', 'info.discovery',
        'agent.started', 'agent.stopped', 'system.shutdown', 'custom',
      ]).describe('Message type'),
      fromAgent: z.string().describe('Sender agent ID'),
      toAgent: z.string().optional().describe('Recipient agent ID (omit to broadcast)'),
      payload: z.record(z.unknown()).optional().describe('Message payload data'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const message = params.toAgent
        ? await dl.messages.send({
            type: params.type,
            fromAgent: params.fromAgent,
            toAgent: params.toAgent,
            payload: params.payload,
          })
        : await dl.messages.broadcast({
            type: params.type,
            fromAgent: params.fromAgent,
            payload: params.payload,
          });
      return { content: [{ type: 'text', text: JSON.stringify(message, null, 2) }] };
    }
  );

  server.tool(
    'jetpack_message_list',
    'Get messages for an agent',
    {
      agentId: z.string().describe('Agent ID to get messages for'),
      type: z.enum([
        'task.help_needed', 'task.handoff', 'task.claimed', 'task.completed',
        'task.failed', 'task.progress', 'file.lock_request', 'file.lock_granted',
        'file.lock_denied', 'coordination.sync', 'info.discovery',
        'agent.started', 'agent.stopped', 'system.shutdown', 'custom',
      ]).optional().describe('Filter by message type'),
      limit: z.number().optional().describe('Maximum number of messages to return'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const messages = await dl.messages.receive(params.agentId, {
        type: params.type,
        limit: params.limit,
      });
      return { content: [{ type: 'text', text: JSON.stringify(messages, null, 2) }] };
    }
  );
}
