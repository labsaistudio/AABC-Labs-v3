import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { validateWorkflow } from '../validation/contract-validator.mjs';
import { assertWorkflowComplete } from '../validation/completion-guard.mjs';
import { stepEvent } from '../contracts/step-contract.mjs';
import { appendEvent, readEvents } from './event-log.mjs';
import { createRunContext } from './run-context.mjs';
import { createProofLedger } from '../../../proof/src/proof-ledger.mjs';
import { exportProofHtml } from '../../../proof/src/export-html.mjs';
import { policyCheckedAdapter } from '../../../adapters/src/policy-checked-adapter.mjs';
import { writeSourcePackage } from '../../../adapters/src/filesystem-adapter.mjs';

export async function runWorkflow({ workflow, outDir, adapter = policyCheckedAdapter }) {
  validateWorkflow(workflow);
  const context = createRunContext({ workflow, outDir });
  const ledger = createProofLedger(context);
  await mkdir(outDir, { recursive: true });

  await appendEvent(context.eventsPath, {
    type: 'workflow_started',
    runId: context.runId,
    workflowId: workflow.id,
    timestamp: new Date().toISOString(),
  });

  for (const step of workflow.steps) {
    await appendEvent(context.eventsPath, stepEvent({
      runId: context.runId,
      workflowId: workflow.id,
      step,
      status: 'started',
    }));

    const result = await adapter({ step, workflow, context });
    for (const tx of result.tx ? [result.tx] : []) {
      const row = ledger.recordTx(tx);
      await appendEvent(context.eventsPath, {
        type: 'tx',
        runId: context.runId,
        workflowId: workflow.id,
        stepKey: step.key,
        data: row,
        timestamp: new Date().toISOString(),
      });
    }
    for (const artifact of result.artifacts || []) {
      const row = ledger.recordArtifact({ stepKey: step.key, ...artifact });
      await appendEvent(context.eventsPath, {
        type: 'artifact',
        runId: context.runId,
        workflowId: workflow.id,
        stepKey: step.key,
        data: row,
        timestamp: new Date().toISOString(),
      });
    }

    await appendEvent(context.eventsPath, stepEvent({
      runId: context.runId,
      workflowId: workflow.id,
      step,
      status: result.blocked ? 'blocked' : 'completed',
      data: result.blocked ? { reason: result.reason } : {},
    }));
  }

  const sourceFiles = await writeSourcePackage({ outDir, sourcePackage: workflow.sourcePackage });
  ledger.recordArtifact({
    type: 'source_package_manifest',
    title: 'Source package manifest',
    path: 'source-package',
    data: { files: sourceFiles.map((file) => file.replace(`${outDir}/`, '')) },
    public: true,
  });

  const feed = ledger.publicFeed();
  const events = await readEvents(context.eventsPath);
  assertWorkflowComplete({ workflow, feed, events });

  await mkdir(dirname(context.proofPath), { recursive: true });
  await writeFile(context.proofPath, JSON.stringify(feed, null, 2));
  await exportProofHtml({ feed, events, outputPath: context.proofHtmlPath });
  await appendEvent(context.eventsPath, {
    type: 'workflow_completed',
    runId: context.runId,
    workflowId: workflow.id,
    timestamp: new Date().toISOString(),
  });

  return { context, feed, events: await readEvents(context.eventsPath) };
}
