import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getDataLayer } from '../lib/data-layer.js';

export function registerTaskTools(server: McpServer) {
  server.tool(
    'jetpack_task_create',
    'Create a new task in the Jetpack swarm',
    {
      title: z.string().describe('Task title'),
      description: z.string().optional().describe('Detailed task description'),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('Task priority'),
      requiredSkills: z.array(z.string()).optional().describe('Skills required to complete the task'),
      type: z.enum(['code', 'test', 'browser_test', 'documentation', 'review', 'custom']).optional().describe('Task type'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const task = await dl.tasks.create({
        title: params.title,
        description: params.description,
        priority: params.priority,
        requiredSkills: params.requiredSkills,
        type: params.type,
      });
      return { content: [{ type: 'text', text: JSON.stringify(task, null, 2) }] };
    }
  );

  server.tool(
    'jetpack_task_list',
    'List tasks in the Jetpack swarm with optional filtering',
    {
      status: z.enum(['pending', 'ready', 'claimed', 'in_progress', 'completed', 'failed', 'pending_retry', 'blocked']).optional().describe('Filter by status'),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('Filter by priority'),
      limit: z.number().optional().describe('Maximum number of tasks to return'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const tasks = await dl.tasks.list({
        status: params.status,
        priority: params.priority,
        limit: params.limit,
      });
      return { content: [{ type: 'text', text: JSON.stringify(tasks, null, 2) }] };
    }
  );

  server.tool(
    'jetpack_task_get',
    'Get a specific task by ID',
    {
      id: z.string().describe('Task ID (e.g., task-XXXX)'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const task = await dl.tasks.get(params.id);
      if (!task) {
        return { content: [{ type: 'text', text: `Task ${params.id} not found` }], isError: true };
      }
      return { content: [{ type: 'text', text: JSON.stringify(task, null, 2) }] };
    }
  );

  server.tool(
    'jetpack_task_update',
    'Update a task in the Jetpack swarm',
    {
      id: z.string().describe('Task ID'),
      title: z.string().optional().describe('New title'),
      description: z.string().optional().describe('New description'),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('New priority'),
      status: z.enum(['pending', 'ready', 'claimed', 'in_progress', 'completed', 'failed', 'pending_retry', 'blocked']).optional().describe('New status'),
      requiredSkills: z.array(z.string()).optional().describe('New required skills'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const { id, ...updates } = params;
      const task = await dl.tasks.update(id, updates);
      if (!task) {
        return { content: [{ type: 'text', text: `Task ${id} not found` }], isError: true };
      }
      return { content: [{ type: 'text', text: JSON.stringify(task, null, 2) }] };
    }
  );

  server.tool(
    'jetpack_task_complete',
    'Mark a task as completed with a result summary',
    {
      id: z.string().describe('Task ID'),
      summary: z.string().describe('Summary of what was accomplished'),
      filesCreated: z.array(z.string()).optional().describe('Files that were created'),
      filesModified: z.array(z.string()).optional().describe('Files that were modified'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const task = await dl.tasks.complete(params.id, {
        summary: params.summary,
        filesCreated: params.filesCreated ?? [],
        filesModified: params.filesModified ?? [],
        filesDeleted: [],
      });
      if (!task) {
        return { content: [{ type: 'text', text: `Task ${params.id} not found` }], isError: true };
      }
      return { content: [{ type: 'text', text: JSON.stringify(task, null, 2) }] };
    }
  );

  server.tool(
    'jetpack_task_fail',
    'Mark a task as failed with a reason',
    {
      id: z.string().describe('Task ID'),
      message: z.string().describe('Failure message explaining what went wrong'),
      recoverable: z.boolean().optional().describe('Whether the task can be retried'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const task = await dl.tasks.fail(params.id, {
        type: 'task_error',
        message: params.message,
        recoverable: params.recoverable ?? true,
      });
      if (!task) {
        return { content: [{ type: 'text', text: `Task ${params.id} not found` }], isError: true };
      }
      return { content: [{ type: 'text', text: JSON.stringify(task, null, 2) }] };
    }
  );
}
