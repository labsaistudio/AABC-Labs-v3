import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { runWorkflow } from '../../../packages/core/src/runner/workflow-runner.mjs';

export async function runCommand(args) {
  const workflowPath = args[0];
  const outIndex = args.indexOf('--out');
  const outDir = outIndex >= 0 ? args[outIndex + 1] : '.outcome/runs/latest';
  if (!workflowPath) throw new Error('usage: aabc-v3 run <workflow.json> --out <dir>');
  const workflowFile = resolve(workflowPath);
  const workflow = JSON.parse(await readFile(workflowFile, 'utf8'));
  workflow.sourcePackage.baseDir = dirname(workflowFile);
  const result = await runWorkflow({ workflow, outDir: resolve(outDir) });
  console.log(`run_id=${result.context.runId}`);
  console.log(`proof=${result.context.proofPath}`);
  console.log(`proof_html=${result.context.proofHtmlPath}`);
}
