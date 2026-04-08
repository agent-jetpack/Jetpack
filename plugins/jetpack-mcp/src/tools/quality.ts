import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getDataLayer } from '../lib/data-layer.js';

export function registerQualityTools(server: McpServer) {
  server.tool(
    'jetpack_quality_snapshot',
    'Get the latest quality snapshot (build, typecheck, lint, test results)',
    {},
    async () => {
      const dl = await getDataLayer();
      const snapshot = await dl.quality.getLatestSnapshot();
      if (!snapshot) {
        return { content: [{ type: 'text', text: 'No quality snapshots recorded yet' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(snapshot, null, 2) }] };
    }
  );

  server.tool(
    'jetpack_quality_baseline',
    'Get the quality baseline used for regression detection',
    {},
    async () => {
      const dl = await getDataLayer();
      const baseline = await dl.quality.getBaseline();
      if (!baseline) {
        return { content: [{ type: 'text', text: 'No quality baseline set yet' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(baseline, null, 2) }] };
    }
  );

  server.tool(
    'jetpack_quality_regressions',
    'Check for quality regressions against the baseline',
    {
      snapshotId: z.string().optional().describe('Snapshot ID to check (uses latest if omitted)'),
    },
    async (params) => {
      const dl = await getDataLayer();

      let snapshot;
      if (params.snapshotId) {
        snapshot = await dl.quality.getSnapshot(params.snapshotId);
        if (!snapshot) {
          return { content: [{ type: 'text', text: `Snapshot ${params.snapshotId} not found` }], isError: true };
        }
      } else {
        snapshot = await dl.quality.getLatestSnapshot();
        if (!snapshot) {
          return { content: [{ type: 'text', text: 'No quality snapshots recorded yet' }] };
        }
      }

      const regressions = await dl.quality.detectRegressions(snapshot);
      return {
        content: [{
          type: 'text',
          text: regressions.length === 0
            ? 'No regressions detected'
            : JSON.stringify(regressions, null, 2),
        }],
      };
    }
  );

  server.tool(
    'jetpack_lease_check',
    'Check if a file is locked by an agent',
    {
      filePath: z.string().describe('File path to check'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const lease = await dl.leases.check(params.filePath);
      if (!lease) {
        return { content: [{ type: 'text', text: `${params.filePath} is not locked` }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(lease, null, 2) }] };
    }
  );

  server.tool(
    'jetpack_lease_list',
    'List file leases held by an agent',
    {
      agentId: z.string().describe('Agent ID'),
    },
    async (params) => {
      const dl = await getDataLayer();
      const leases = await dl.leases.getAgentLeases(params.agentId);
      return { content: [{ type: 'text', text: JSON.stringify(leases, null, 2) }] };
    }
  );
}
