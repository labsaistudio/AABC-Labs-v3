import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { readEvents } from '../../../packages/core/src/runner/event-log.mjs';
import { exportProofHtml } from '../../../packages/proof/src/export-html.mjs';

export async function exportProofCommand(args) {
  const runDir = resolve(args[0] || '.outcome/runs/latest');
  const feed = JSON.parse(await readFile(join(runDir, 'proof.json'), 'utf8'));
  const events = await readEvents(join(runDir, 'events.jsonl'));
  const outputPath = join(runDir, 'proof.html');
  await exportProofHtml({ feed, events, outputPath });
  console.log(`proof html exported: ${outputPath}`);
}
