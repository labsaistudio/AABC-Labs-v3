import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateWorkflow } from '../packages/core/src/validation/contract-validator.mjs';
import {
  REQUIRED_SOLANA_CAPABILITY_IDS,
  assertSolanaStackCoverage,
  solanaCapabilityIds,
} from '../packages/integrations/src/solana-capabilities.mjs';
import { buildSolanaCapabilityArtifact } from '../packages/integrations/src/solana-reference-adapters.mjs';
import {
  REQUIRED_QVAC_CAPABILITY_IDS,
  assertQvacStackCoverage,
  qvacCapabilityIds,
} from '../packages/integrations/src/qvac-capabilities.mjs';
import { buildQvacRuntimeArtifact } from '../packages/integrations/src/qvac-reference-adapters.mjs';

test('all workflow packs are valid and declare source packages', async () => {
  const packs = await readdir('workflow-packs');
  assert.ok(packs.length >= 8);
  for (const pack of packs) {
    const workflow = JSON.parse(await readFile(join('workflow-packs', pack, 'workflow.json'), 'utf8'));
    assert.equal(validateWorkflow(workflow), true);
    assert.ok(workflow.sourcePackage.files.length > 0);
  }
});

test('solana capability registry covers the public stack', () => {
  assert.equal(assertSolanaStackCoverage(), true);
});

test('workflow packs reference registered solana capabilities', async () => {
  const registered = new Set(solanaCapabilityIds());
  const used = new Set();
  for (const pack of await readdir('workflow-packs')) {
    const workflow = JSON.parse(await readFile(join('workflow-packs', pack, 'workflow.json'), 'utf8'));
    assert.equal(workflow.ecosystem?.chain, 'solana');
    assert.ok(workflow.ecosystem.capabilities.length > 0);
    for (const capability of workflow.ecosystem.capabilities) {
      assert.equal(registered.has(capability), true, `${workflow.id}:${capability}`);
      used.add(capability);
    }
  }
  for (const capability of REQUIRED_SOLANA_CAPABILITY_IDS) {
    assert.equal(used.has(capability), true, `missing workflow coverage:${capability}`);
  }
});

test('solana capability artifact exposes reviewable protocol signals', async () => {
  const workflow = JSON.parse(await readFile('workflow-packs/paid-endpoint/workflow.json', 'utf8'));
  const artifact = buildSolanaCapabilityArtifact({ workflow, step: workflow.steps[0] });
  assert.equal(artifact.type, 'solana_capability_plan');
  assert.ok(artifact.data.capabilities.some((item) => item.id === 'x402-solana-usdc'));
  assert.ok(artifact.data.capabilities.every((item) => item.broadcasting === 'not_enabled_in_reference_runtime'));
});

test('solana capability artifact rejects unknown capability ids', () => {
  assert.throws(() => buildSolanaCapabilityArtifact({
    workflow: {
      ecosystem: { chain: 'solana', capabilities: ['unknown-capability'] },
    },
    step: { key: 'bad-step', action: 'read_state' },
  }), /unknown_solana_capability/);
});

test('qvac capability registry covers the local ai runtime stack', () => {
  assert.equal(assertQvacStackCoverage(), true);
});

test('workflow packs can declare registered qvac capabilities', async () => {
  const registered = new Set(qvacCapabilityIds());
  const used = new Set();
  for (const pack of await readdir('workflow-packs')) {
    const workflow = JSON.parse(await readFile(join('workflow-packs', pack, 'workflow.json'), 'utf8'));
    for (const capability of workflow.ecosystem?.qvacCapabilities || []) {
      assert.equal(registered.has(capability), true, `${workflow.id}:${capability}`);
      used.add(capability);
    }
  }
  for (const capability of REQUIRED_QVAC_CAPABILITY_IDS) {
    assert.equal(used.has(capability), true, `missing qvac workflow coverage:${capability}`);
  }
});

test('qvac runtime artifact exposes public-safe local inference boundary', async () => {
  const workflow = JSON.parse(await readFile('workflow-packs/paid-endpoint/workflow.json', 'utf8'));
  const artifact = buildQvacRuntimeArtifact({ workflow, step: workflow.steps[0] });
  assert.equal(artifact.type, 'qvac_runtime_plan');
  assert.ok(artifact.data.capabilities.some((item) => item.id === 'qvac-openai-compatible-http'));
  assert.equal(artifact.data.runtimeBoundary.modelWeights, 'not_in_public_repository');
  assert.equal(artifact.data.runtimeBoundary.remoteProviderKey, 'not_required_for_local_runtime');
});
