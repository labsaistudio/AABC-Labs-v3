import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function exportProofHtml({ feed, events, outputPath }) {
  await mkdir(dirname(outputPath), { recursive: true });
  const steps = events
    .filter((event) => event.type === 'step')
    .map((event) => `<li><strong>${escapeHtml(event.stepKey)}</strong>: ${escapeHtml(event.status)}</li>`)
    .join('');
  const artifacts = feed.artifacts
    .map((artifact) => `<li><span>${escapeHtml(artifact.type)}</span>${escapeHtml(artifact.title || artifact.path || artifact.id)}</li>`)
    .join('');
  const txRecords = feed.txRecords
    .map((tx) => `<li><span>${escapeHtml(tx.operationType)}</span>${escapeHtml(tx.status)} on ${escapeHtml(tx.chain)} ${escapeHtml(tx.network)}</li>`)
    .join('');
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>AABC Labs v3 Proof</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; margin: 32px; color: #111827; }
    h1 { margin-bottom: 4px; }
    section { margin-top: 24px; }
    li { margin: 8px 0; }
    span { display: inline-block; min-width: 180px; color: #334155; font-family: ui-monospace, monospace; }
  </style>
</head>
<body>
  <h1>AABC Labs v3 Proof</h1>
  <p>Run: ${escapeHtml(feed.runId)}</p>
  <p>Workflow: ${escapeHtml(feed.workflowId)}</p>
  <section><h2>Timeline</h2><ol>${steps}</ol></section>
  <section><h2>Transactions</h2><ul>${txRecords}</ul></section>
  <section><h2>Artifacts</h2><ul>${artifacts}</ul></section>
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
