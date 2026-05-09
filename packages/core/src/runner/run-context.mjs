import { join } from 'node:path';

export function createRunContext({ workflow, outDir }) {
  const runId = `${workflow.id}-${Date.now()}`;
  return {
    runId,
    workflowId: workflow.id,
    outDir,
    eventsPath: join(outDir, 'events.jsonl'),
    proofPath: join(outDir, 'proof.json'),
    proofHtmlPath: join(outDir, 'proof.html'),
  };
}
