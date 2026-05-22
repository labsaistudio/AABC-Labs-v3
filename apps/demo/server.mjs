import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const ROUTES = Object.freeze({
  '/': { file: 'examples/base/base-agent-fund-pack.proof.html', type: 'text/html; charset=utf-8' },
  '/proof': { file: 'examples/base/base-agent-fund-pack.proof.html', type: 'text/html; charset=utf-8' },
  '/submission': { file: 'examples/base/base-submission-pack.json', type: 'application/json; charset=utf-8' },
  '/readiness': { file: 'examples/base/base-readiness-report.json', type: 'application/json; charset=utf-8' },
  '/.well-known/SKILL.md': {
    file: 'scaffolds/x402-express/.well-known/SKILL.md',
    type: 'text/markdown; charset=utf-8',
  },
});

export function createDemoServer() {
  return createServer(async (request, response) => {
    const route = ROUTES[new URL(request.url, 'http://localhost').pathname];
    if (!route) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('not found');
      return;
    }
    const body = await readFile(route.file);
    response.writeHead(200, { 'content-type': route.type });
    response.end(body);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 4174);
  createDemoServer().listen(port, () => {
    console.log(`AABC Base demo server listening on http://localhost:${port}`);
  });
}
