import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const port = Number(process.env.PORT || 4173);
const packNames = [
  'token-program',
  'launch-operations',
  'fair-sale',
  'trust-operations',
  'distribution',
  'market-monitor',
  'asset-pack',
  'paid-endpoint',
];

const server = createServer(async (req, res) => {
  if (req.url === '/api/workflows') {
    const workflows = await Promise.all(packNames.map(readWorkflow));
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(workflows.map(summary)));
    return;
  }
  res.setHeader('content-type', 'text/html');
  res.end(renderHtml());
});

async function readWorkflow(name) {
  return JSON.parse(await readFile(join('workflow-packs', name, 'workflow.json'), 'utf8'));
}

function summary(workflow) {
  return {
    id: workflow.id,
    title: workflow.title,
    summary: workflow.summary,
    steps: workflow.steps.length,
    files: workflow.sourcePackage.files.length,
    capabilities: workflow.ecosystem.capabilities,
  };
}

function renderHtml() {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>AABC Labs v3 Studio</title>
  <style>
    body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #0b1020; color: #eef2ff; }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 20px 48px; }
    header { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 24px; }
    h1 { margin: 0 0 8px; font-size: 34px; }
    p { color: #b6c2dc; line-height: 1.55; }
    .stats { display: flex; gap: 10px; flex-wrap: wrap; }
    .stat, .card { border: 1px solid #27324a; border-radius: 8px; background: #111827; }
    .stat { padding: 10px 12px; min-width: 96px; }
    .stat strong { display: block; font-size: 22px; color: #ffffff; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
    .card { padding: 16px; }
    .card h2 { margin: 0 0 8px; font-size: 18px; }
    .meta { display: flex; gap: 8px; margin: 12px 0; }
    .pill { border: 1px solid #334155; border-radius: 999px; padding: 4px 8px; color: #cbd5e1; font-size: 12px; }
    .caps { display: flex; flex-wrap: wrap; gap: 6px; }
    .cap { background: #172554; color: #bfdbfe; border-radius: 6px; padding: 4px 7px; font-size: 11px; }
    code { color: #7dd3fc; }
  </style>
</head>
<body>
  <main>
    <header>
      <section>
        <h1>AABC Labs v3 Studio</h1>
        <p>Proof-first Web3 workflows with policy gates, Solana capability plans, replay logs, and source packages.</p>
      </section>
      <section class="stats" id="stats"></section>
    </header>
    <section id="workflows" class="grid"></section>
  </main>
  <script>
    fetch('/api/workflows')
      .then((res) => res.json())
      .then((items) => {
        const caps = new Set(items.flatMap((item) => item.capabilities));
        document.getElementById('stats').innerHTML = [
          ['Workflows', items.length],
          ['Steps', items.reduce((sum, item) => sum + item.steps, 0)],
          ['Files', items.reduce((sum, item) => sum + item.files, 0)],
          ['Capabilities', caps.size],
        ].map(([label, value]) => '<div class="stat"><strong>' + value + '</strong>' + label + '</div>').join('');
        document.getElementById('workflows').innerHTML = items.map((item) =>
          '<article class="card"><h2>' + item.title + '</h2><p>' + item.summary + '</p>' +
          '<div class="meta"><span class="pill">' + item.steps + ' steps</span><span class="pill">' + item.files + ' files</span></div>' +
          '<div class="caps">' + item.capabilities.map((cap) => '<span class="cap">' + cap + '</span>').join('') + '</div></article>'
        ).join('');
      });
  </script>
</body>
</html>`;
}

server.listen(port, () => {
  console.log(`AABC Labs v3 Studio: http://localhost:${port}`);
});
