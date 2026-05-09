import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const port = Number(process.env.PORT || 4173);

const server = createServer(async (req, res) => {
  if (req.url === '/api/workflows') {
    const workflows = await Promise.all([
      'token-program',
      'launch-operations',
      'fair-sale',
      'trust-operations',
      'distribution',
      'market-monitor',
      'asset-pack',
      'paid-endpoint',
    ].map(async (name) => JSON.parse(
      await readFile(join('workflow-packs', name, 'workflow.json'), 'utf8'),
    )));
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(workflows));
    return;
  }
  res.setHeader('content-type', 'text/html');
  res.end(`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>AABC Labs v3 Studio</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; margin: 40px; background: #0b0f17; color: #eef2ff; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .card { border: 1px solid #283349; border-radius: 10px; padding: 18px; background: #111827; }
    code { color: #7dd3fc; }
  </style>
</head>
<body>
  <h1>AABC Labs v3 Studio</h1>
  <p>Run <code>npm run demo</code>, then inspect the generated proof under <code>.outcome/runs/token-program</code>.</p>
  <div id="workflows" class="grid"></div>
  <script>
    fetch('/api/workflows')
      .then((res) => res.json())
      .then((items) => {
        document.getElementById('workflows').innerHTML = items.map((item) =>
          '<section class="card"><h2>' + item.title + '</h2><p>' + item.summary + '</p><p>Steps: ' + item.steps.length + '</p><p>Solana: ' + item.ecosystem.capabilities.join(', ') + '</p></section>'
        ).join('');
      });
  </script>
</body>
</html>`);
});

server.listen(port, () => {
  console.log(`AABC Labs v3 Studio: http://localhost:${port}`);
});
