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

test('workflow runner emits qvac runtime proof for paid endpoint workflow', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aabc-v3-qvac-'));
  const workflow = JSON.parse(await readFile('workflow-packs/paid-endpoint/workflow.json', 'utf8'));
  workflow.sourcePackage.baseDir = resolve('workflow-packs/paid-endpoint');
  const result = await runWorkflow({ workflow, outDir: dir });
  assert.ok(result.feed.artifacts.some((artifact) => artifact.type === 'qvac_runtime_plan'));
  assert.ok((await readFile(join(dir, 'source-package/endpoint/qvac-runtime-policy.ts'), 'utf8')).includes('qvacRuntimePolicy'));
  await rm(dir, { recursive: true, force: true });
});

test('workflow runner emits frontier proof for Torque MCP distribution workflow', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aabc-v3-torque-'));
  const workflow = JSON.parse(await readFile('workflow-packs/distribution/workflow.json', 'utf8'));
  workflow.sourcePackage.baseDir = resolve('workflow-packs/distribution');
  const result = await runWorkflow({ workflow, outDir: dir });
  assert.ok(result.feed.artifacts.some((artifact) => artifact.type === 'frontier_capability_plan'));
  assert.ok((await readFile(join(dir, 'source-package/distribution/torque-mcp-policy.ts'), 'utf8')).includes('torqueMcpPolicy'));
  await rm(dir, { recursive: true, force: true });
});

test('workflow runner emits frontier proof for RPC infrastructure monitor workflow', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aabc-v3-rpc-'));
  const workflow = JSON.parse(await readFile('workflow-packs/market-monitor/workflow.json', 'utf8'));
  workflow.sourcePackage.baseDir = resolve('workflow-packs/market-monitor');
  const result = await runWorkflow({ workflow, outDir: dir });
  assert.ok(result.feed.artifacts.some((artifact) => artifact.type === 'frontier_capability_plan'));
  assert.ok((await readFile(join(dir, 'source-package/monitor/rpc-infrastructure-policy.ts'), 'utf8')).includes('rpcInfrastructurePolicy'));
  await rm(dir, { recursive: true, force: true });
});

test('workflow runner emits frontier proof for Palm USD endpoint workflow', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aabc-v3-palm-'));
  const workflow = JSON.parse(await readFile('workflow-packs/paid-endpoint/workflow.json', 'utf8'));
  workflow.sourcePackage.baseDir = resolve('workflow-packs/paid-endpoint');
  const result = await runWorkflow({ workflow, outDir: dir });
  assert.ok(result.feed.artifacts.some((artifact) => artifact.type === 'frontier_capability_plan'));
  assert.ok((await readFile(join(dir, 'source-package/endpoint/palm-usd-settlement.ts'), 'utf8')).includes('palmUsdSettlementPolicy'));
  await rm(dir, { recursive: true, force: true });
});

test('workflow runner emits frontier proof for Jupiter developer platform workflow', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aabc-v3-jupiter-'));
  const workflow = JSON.parse(await readFile('workflow-packs/launch-operations/workflow.json', 'utf8'));
  workflow.sourcePackage.baseDir = resolve('workflow-packs/launch-operations');
  const result = await runWorkflow({ workflow, outDir: dir });
  assert.ok(result.feed.artifacts.some((artifact) => artifact.type === 'frontier_capability_plan'));
  assert.ok((await readFile(join(dir, 'source-package/ops/jupiter-developer-platform-policy.ts'), 'utf8')).includes('jupiterDeveloperPlatformPolicy'));
  await rm(dir, { recursive: true, force: true });
});

test('workflow runner emits frontier proof for Encrypt and Ika trust workflow', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aabc-v3-encrypt-ika-'));
  const workflow = JSON.parse(await readFile('workflow-packs/trust-operations/workflow.json', 'utf8'));
  workflow.sourcePackage.baseDir = resolve('workflow-packs/trust-operations');
  const result = await runWorkflow({ workflow, outDir: dir });
  assert.ok(result.feed.artifacts.some((artifact) => artifact.type === 'frontier_capability_plan'));
  assert.ok((await readFile(join(dir, 'source-package/trust/encrypt-ika-policy.ts'), 'utf8')).includes('encryptIkaPolicy'));
  await rm(dir, { recursive: true, force: true });
});

test('workflow runner emits frontier proof for Umbra fair sale workflow', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aabc-v3-umbra-'));
  const workflow = JSON.parse(await readFile('workflow-packs/fair-sale/workflow.json', 'utf8'));
  workflow.sourcePackage.baseDir = resolve('workflow-packs/fair-sale');
  const result = await runWorkflow({ workflow, outDir: dir });
  assert.ok(result.feed.artifacts.some((artifact) => artifact.type === 'frontier_capability_plan'));
  assert.ok((await readFile(join(dir, 'source-package/sale/umbra-privacy-policy.ts'), 'utf8')).includes('umbraPrivacyPolicy'));
  await rm(dir, { recursive: true, force: true });
});
