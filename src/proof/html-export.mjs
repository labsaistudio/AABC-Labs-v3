export function exportProofHtml(proof) {
  const artifactRows = proof.artifacts.map((item) => `
    <tr>
      <td>${escapeHtml(item.type)}</td>
      <td>${escapeHtml(item.title)}</td>
      <td>${escapeHtml(JSON.stringify(item.data))}</td>
    </tr>`).join('');
  const stepRows = proof.steps.map((item) => `
    <tr>
      <td>${escapeHtml(item.id)}</td>
      <td>${escapeHtml(item.intent)}</td>
      <td>${escapeHtml(item.status)}</td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(proof.product)} Proof</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; margin: 40px; color: #111827; }
    table { border-collapse: collapse; width: 100%; margin: 18px 0 28px; }
    th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; vertical-align: top; }
    th { background: #f3f4f6; }
    code { background: #f3f4f6; padding: 2px 5px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(proof.product)}</h1>
  <p>Base workflow proof generated for reviewer inspection.</p>
  <p><strong>Network:</strong> <code>${escapeHtml(proof.network)}</code></p>
  <h2>Steps</h2>
  <table><thead><tr><th>ID</th><th>Intent</th><th>Status</th></tr></thead><tbody>${stepRows}</tbody></table>
  <h2>Artifacts</h2>
  <table><thead><tr><th>Type</th><th>Title</th><th>Data</th></tr></thead><tbody>${artifactRows}</tbody></table>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
