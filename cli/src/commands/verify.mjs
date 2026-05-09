import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { verifyProofFeed } from '../../../packages/proof/src/verifier.mjs';

export async function verifyCommand(args) {
  const runDir = resolve(args[0] || '.outcome/runs/latest');
  const feed = JSON.parse(await readFile(join(runDir, 'proof.json'), 'utf8'));
  const result = verifyProofFeed(feed);
  if (!result.ok) throw new Error(`proof verification failed: ${result.errors.join(';')}`);
  console.log(`proof verified: ${feed.runId}`);
}
