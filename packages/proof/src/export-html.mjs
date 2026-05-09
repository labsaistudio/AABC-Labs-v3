import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function exportProofHtml({ feed, events, outputPath }) {
  await mkdir(dirname(outputPath), { recursive: true });
  const steps = events
    .filter((event) => event.type === 'step')
    .map((event) => `<li><strong>${escapeHtml(event.stepKey)}</strong>: ${escapeHtml(event.status)}</li>`)
    .join('');
  const artifacts = feed.artifacts
    .map((artifact) => `<li>${escapeHtml(artifact.type)} - ${escapeHtml(artifact.title || artifact.path || artifact.id)}</li>`)
    .join('');
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>AABC Labs v3 Proof</title></head>
<body>
  <h1>AABC Labs v3 Proof</h1>
  <p>Run: ${escapeHtml(feed.runId)}</p>
  <p>Workflow: ${escapeHtml(feed.workflowId)}</p>
  <h2>Timeline</h2>
  <ol>${steps}</ol>
  <h2>Artifacts</h2>
  <ul>${artifacts}</ul>
</body>
</html>
`;
  await writeFile(outputPath, html);
  return outputPath;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
