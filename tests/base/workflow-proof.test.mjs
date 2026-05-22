import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { buildBaseAgentWorkflow } from '../../src/workflow/base-agent-workflow.mjs';
import { runWorkflow } from '../../src/workflow/runner.mjs';
import { buildBaseProofTransaction } from '../../src/proof/base-proof-transaction.mjs';
import { exportProofHtml } from '../../src/proof/html-export.mjs';
import { verifyProof } from '../../src/proof/verifier.mjs';

const execFileAsync = promisify(execFile);

test('Base agent workflow emits buyer, seller, and proof artifacts', async () => {
  const workflow = buildBaseAgentWorkflow();
  const proof = await runWorkflow(workflow);
  assert.equal(verifyProof(proof), true);
  assert.deepEqual(proof.steps.map((step) => step.id), [
    'discover-paid-service',
    'pay-for-service',
    'create-paid-endpoint',
    'record-proof',
  ]);
  assert.ok(proof.artifacts.some((item) => item.type === 'x402_buyer_request'));
  assert.ok(proof.artifacts.some((item) => item.type === 'x402_seller_endpoint'));
  assert.ok(proof.artifacts.some((item) => item.type === 'base_proof_record'));
});

test('example proof stays verifiable for reviewers', async () => {
  const proof = JSON.parse(await readFile('examples/base/base-agent-fund-pack.proof.json', 'utf8'));
  assert.equal(verifyProof(proof), true);
  assert.equal(proof.ecosystem, 'base');
  assert.equal(proof.product, 'AABC Base Agent Fund Pack');
});

test('Base proof transaction rejects non-Base chain ids', () => {
  const tx = buildBaseProofTransaction({
    chainId: 8453,
    registryAddress: '0x0000000000000000000000000000000000000001',
    proofHash: '0x' + 'a'.repeat(64),
  });
  assert.equal(tx.network, 'base-mainnet');
  assert.equal(tx.data, '0x2263f290' + 'a'.repeat(64));
  assert.throws(() => buildBaseProofTransaction({
    chainId: 1,
    registryAddress: '0x0000000000000000000000000000000000000001',
    proofHash: '0x' + 'a'.repeat(64),
  }), /unsupported_base_chain/);
});

test('Base proof registry contract exposes recordProof event path', async () => {
  const source = await readFile('contracts/BaseWorkflowProofRegistry.sol', 'utf8');
  assert.match(source, /contract BaseWorkflowProofRegistry/);
  assert.match(source, /event ProofRecorded/);
  assert.match(source, /function recordProof\(bytes32 proofHash\)/);
  assert.match(source, /require\(proofHash != bytes32\(0\)/);
});

test('proof-tx command writes a reviewable transaction plan', async () => {
  await execFileAsync('node', [
    'cli/index.mjs',
    'proof-tx',
    '8453',
    '0x0000000000000000000000000000000000000001',
    '0x' + 'b'.repeat(64),
  ]);
  const tx = JSON.parse(await readFile('examples/base/base-proof-transaction.json', 'utf8'));
  assert.equal(tx.ecosystem, 'base');
  assert.equal(tx.network, 'base-mainnet');
  assert.equal(tx.data, '0x2263f290' + 'b'.repeat(64));
});

test('proof html export gives reviewers a static page', async () => {
  const proof = JSON.parse(await readFile('examples/base/base-agent-fund-pack.proof.json', 'utf8'));
  const html = exportProofHtml(proof);
  assert.match(html, /AABC Base Agent Fund Pack/);
  assert.match(html, /x402_buyer_request/);
  assert.match(html, /base_proof_record/);
});

test('Base mainnet deployment evidence is recorded', async () => {
  const deployment = JSON.parse(await readFile('examples/base/base-mainnet-deployment.json', 'utf8'));
  assert.equal(deployment.network, 'base-mainnet');
  assert.equal(deployment.chainId, 8453);
  assert.match(deployment.proofRegistry, /^0x[a-fA-F0-9]{40}$/);
  assert.match(deployment.proofRecordTransaction, /^0x[a-fA-F0-9]{64}$/);
  assert.match(deployment.explorer.proofRecord, /^https:\/\/basescan\.org\/tx\//);
});
