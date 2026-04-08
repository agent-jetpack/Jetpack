import { createLocalDataLayer, type DataLayer } from '@jetpack-agent/data';
import path from 'path';
import fs from 'fs';

let cachedDataLayer: DataLayer | null = null;

/**
 * Get or create a singleton DataLayer instance.
 * Resolves the .jetpack/swarm.db from JETPACK_WORK_DIR or cwd.
 */
export async function getDataLayer(): Promise<DataLayer> {
  if (cachedDataLayer) return cachedDataLayer;

  const workDir = path.resolve(process.env.JETPACK_WORK_DIR || process.cwd());
  const jetpackDir = path.join(workDir, '.jetpack');

  if (!fs.existsSync(jetpackDir)) {
    fs.mkdirSync(jetpackDir, { recursive: true });
  }

  const dbPath = path.join(jetpackDir, 'swarm.db');
  cachedDataLayer = await createLocalDataLayer(dbPath);
  return cachedDataLayer;
}

/**
 * Close the cached DataLayer connection.
 */
export async function closeDataLayer(): Promise<void> {
  if (cachedDataLayer) {
    await cachedDataLayer.close();
    cachedDataLayer = null;
  }
}
