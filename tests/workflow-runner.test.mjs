import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { runWorkflow } from '../packages/core/src/runner/workflow-runner.mjs';

test('workflow runner writes event log, proof feed, html proof, and source package', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aabc-v3-'));
  const workflow = JSON.parse(await readFile('workflow-packs/token-program/workflow.json', 'utf8'));
  workflow.sourcePackage.baseDir = resolve('workflow-packs/token-program');
  const result = await runWorkflow({ workflow, outDir: dir });
  assert.equal(result.feed.workflowId, 'token-program');
  assert.ok(result.feed.artifacts.some((artifact) => artifact.type === 'solana_capability_plan'));
  assert.ok(result.feed.artifacts.some((artifact) => artifact.type === 'source_package_manifest'));
  assert.ok((await readFile(join(dir, 'events.jsonl'), 'utf8')).includes('workflow_started'));
  assert.ok((await readFile(join(dir, 'proof.html'), 'utf8')).includes('AABC Labs v3 Proof'));
  await rm(dir, { recursive: true, force: true });
});

test('workflow runner emits session key mode proof for session wallet steps', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aabc-v3-session-'));
  const workflow = JSON.parse(await readFile('workflow-packs/market-monitor/workflow.json', 'utf8'));
  workflow.sourcePackage.baseDir = resolve('workflow-packs/market-monitor');
  const result = await runWorkflow({ workflow, outDir: dir });
  assert.ok(result.feed.artifacts.some((artifact) => artifact.type === 'policy_gate_decision'));
  assert.ok(result.feed.artifacts.some((artifact) => artifact.type === 'session_key_mode_contract'));
  assert.ok((await readFile(join(dir, 'source-package/monitor/session-key-policy.ts'), 'utf8')).includes('sessionKeyPolicy'));
  await rm(dir, { recursive: true, force: true });
});
