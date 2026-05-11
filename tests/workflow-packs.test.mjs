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
import {
  REQUIRED_FRONTIER_CAPABILITY_IDS,
  assertFrontierStackCoverage,
  frontierCapabilityIds,
} from '../packages/integrations/src/frontier-capabilities.mjs';
import { buildFrontierCapabilityArtifact } from '../packages/integrations/src/frontier-reference-adapters.mjs';

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

test('frontier capability registry covers sponsor tracks', () => {
  assert.equal(assertFrontierStackCoverage(), true);
});

test('workflow packs can declare registered frontier capabilities', async () => {
  const registered = new Set(frontierCapabilityIds());
  const used = new Set();
  for (const pack of await readdir('workflow-packs')) {
    const workflow = JSON.parse(await readFile(join('workflow-packs', pack, 'workflow.json'), 'utf8'));
    for (const capability of workflow.ecosystem?.frontierCapabilities || []) {
      assert.equal(registered.has(capability), true, `${workflow.id}:${capability}`);
      used.add(capability);
    }
  }
  for (const capability of REQUIRED_FRONTIER_CAPABILITY_IDS) {
    assert.equal(used.has(capability), true, `missing frontier workflow coverage:${capability}`);
  }
});

test('frontier artifact exposes public-safe sponsor integration boundary', async () => {
  const workflow = JSON.parse(await readFile('workflow-packs/distribution/workflow.json', 'utf8'));
  const step = workflow.steps.find((item) => item.frontierRuntime === true);
  const artifact = buildFrontierCapabilityArtifact({ workflow, step });
  assert.equal(artifact.type, 'frontier_capability_plan');
  assert.ok(artifact.data.capabilities.some((item) => item.id === 'torque-mcp-growth'));
  assert.equal(artifact.data.runtimeBoundary.credentials, 'not_in_public_repository');
  assert.equal(artifact.data.runtimeBoundary.liveSdk, 'not_bundled_in_reference_runtime');
});

test('frontier artifact exposes Jupiter developer platform boundary', async () => {
  const workflow = JSON.parse(await readFile('workflow-packs/launch-operations/workflow.json', 'utf8'));
  const step = workflow.steps.find((item) => item.frontierRuntime === true);
  const artifact = buildFrontierCapabilityArtifact({ workflow, step });
  assert.ok(artifact.data.capabilities.some((item) => item.id === 'jupiter-developer-platform'));
  assert.equal(artifact.data.capabilities.some((item) => item.reviewSignals.includes('quote and route surface')), true);
});

test('frontier artifact exposes Encrypt and Ika capital markets boundary', async () => {
  const workflow = JSON.parse(await readFile('workflow-packs/trust-operations/workflow.json', 'utf8'));
  const step = workflow.steps.find((item) => item.frontierRuntime === true);
  const artifact = buildFrontierCapabilityArtifact({ workflow, step });
  assert.ok(artifact.data.capabilities.some((item) => item.id === 'encrypt-encrypted-capital-markets'));
  assert.ok(artifact.data.capabilities.some((item) => item.id === 'ika-bridgeless-capital-markets'));
});

test('frontier artifact exposes Umbra privacy boundary', async () => {
  const workflow = JSON.parse(await readFile('workflow-packs/fair-sale/workflow.json', 'utf8'));
  const step = workflow.steps.find((item) => item.frontierRuntime === true);
  const artifact = buildFrontierCapabilityArtifact({ workflow, step });
  assert.ok(artifact.data.capabilities.some((item) => item.id === 'umbra-privacy-sdk'));
  assert.equal(artifact.data.capabilities.some((item) => item.reviewSignals.includes('privacy proof boundary')), true);
});

test('frontier artifact exposes Cloak privacy payment boundary', async () => {
  const workflow = JSON.parse(await readFile('workflow-packs/paid-endpoint/workflow.json', 'utf8'));
  const artifact = buildFrontierCapabilityArtifact({ workflow, step: workflow.steps[0] });
  assert.ok(artifact.data.capabilities.some((item) => item.id === 'cloak-privacy-payments'));
});

test('frontier artifact exposes SNS identity boundary', async () => {
  const workflow = JSON.parse(await readFile('workflow-packs/asset-pack/workflow.json', 'utf8'));
  const step = workflow.steps.find((item) => item.frontierRuntime === true);
  const artifact = buildFrontierCapabilityArtifact({ workflow, step });
  assert.ok(artifact.data.capabilities.some((item) => item.id === 'sns-identity-layer'));
});

test('frontier artifact exposes Jito and LI.FI launch boundaries', async () => {
  const workflow = JSON.parse(await readFile('workflow-packs/launch-operations/workflow.json', 'utf8'));
  const step = workflow.steps.find((item) => item.frontierRuntime === true);
  const artifact = buildFrontierCapabilityArtifact({ workflow, step });
  assert.ok(artifact.data.capabilities.some((item) => item.id === 'jito-infrastructure'));
  assert.ok(artifact.data.capabilities.some((item) => item.id === 'lifi-cross-chain-routing'));
});
