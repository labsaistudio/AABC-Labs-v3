import { assertRequiredArtifacts } from './artifact-guard.mjs';

export function assertWorkflowComplete({ workflow, feed, events }) {
  const completed = new Set(
    events
      .filter((event) => event.type === 'step' && event.status === 'completed')
      .map((event) => event.stepKey),
  );
  const missingSteps = workflow.steps
    .map((step) => step.key)
    .filter((key) => !completed.has(key));
  if (missingSteps.length) throw new Error(`missing_completed_steps:${missingSteps.join(',')}`);
  assertRequiredArtifacts({ workflow, feed });
  if (!workflow.sourcePackage?.files?.length) throw new Error('missing_source_package_manifest');
  return true;
}
