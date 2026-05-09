export function assertRequiredArtifacts({ workflow, feed }) {
  const produced = new Set(feed.artifacts.map((artifact) => artifact.type));
  const required = new Set(workflow.steps.flatMap((step) => step.expectedArtifacts));
  const missing = [...required].filter((type) => !produced.has(type));
  if (missing.length) throw new Error(`missing_required_artifacts:${missing.join(',')}`);
  return true;
}
