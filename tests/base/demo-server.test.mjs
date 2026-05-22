import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoServer } from '../../apps/demo/server.mjs';

test('demo server exposes proof, submission, readiness, and skill routes', async () => {
  const server = createDemoServer();
  await new Promise((resolve) => server.listen(0, resolve));
  try {
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;
    const proof = await fetch(`${baseUrl}/proof`);
    assert.equal(proof.status, 200);
    assert.match(await proof.text(), /AABC Base Agent Fund Pack/);

    const submission = await fetch(`${baseUrl}/submission`);
    assert.equal(submission.status, 200);
    assert.equal((await submission.json()).ecosystem, 'base');

    const readiness = await fetch(`${baseUrl}/readiness`);
    assert.equal(readiness.status, 200);
    assert.equal((await readiness.json()).canSubmit, false);

    const skill = await fetch(`${baseUrl}/.well-known/SKILL.md`);
    assert.equal(skill.status, 200);
    assert.match(await skill.text(), /eip155:8453/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
