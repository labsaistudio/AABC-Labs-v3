import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { BASE_CAPABILITIES, assertBaseOnlyCoverage } from '../../src/base/capabilities.mjs';
import { buildBaseFundRoadmap } from '../../src/base/funding-roadmap.mjs';
import { BASE_NETWORKS, getBaseNetwork } from '../../src/base/network-config.mjs';
import { buildBaseOnboardingPlan } from '../../src/base/onboarding-plan.mjs';
import { buildReadinessReport } from '../../src/base/readiness-report.mjs';
import { buildBaseSubmissionPack } from '../../src/base/submission-pack.mjs';
import { buildX402ResourcePlan } from '../../src/x402/resource-plan.mjs';

test('Base capability registry covers only Base ecosystem primitives', () => {
  assert.equal(assertBaseOnlyCoverage(), true);
  assert.equal(BASE_CAPABILITIES.every((item) => item.ecosystem === 'base'), true);
  assert.ok(BASE_CAPABILITIES.some((item) => item.id === 'x402-seller-endpoint'));
  assert.ok(BASE_CAPABILITIES.some((item) => item.id === 'agentic-wallet-x402-buyer'));
  assert.ok(BASE_CAPABILITIES.some((item) => item.id === 'base-paymaster'));
});

test('Base network config declares mainnet and Sepolia targets', () => {
  assert.equal(BASE_NETWORKS.mainnet.chainId, 8453);
  assert.equal(BASE_NETWORKS.sepolia.chainId, 84532);
  assert.equal(getBaseNetwork(84532).rpcUrl, 'https://sepolia.base.org');
  assert.throws(() => getBaseNetwork(1), /unsupported_base_chain/);
});

test('x402 resource plan follows official Base facilitator surfaces', () => {
  const plan = buildX402ResourcePlan();
  assert.equal(plan.networks.testnet, 'eip155:84532');
  assert.equal(plan.networks.mainnet, 'eip155:8453');
  assert.ok(plan.officialPackages.includes('@x402/express'));
  assert.ok(plan.officialPackages.includes('@x402/next'));
  assert.ok(plan.officialPackages.includes('x402-express'));
  assert.ok(plan.agenticWalletCommands.includes('npx skills add coinbase/agentic-wallet-skills'));
  assert.equal(plan.facilitators.publicTestnet, 'https://www.x402.org/facilitator');
  assert.equal(plan.facilitators.hostedMainnet, 'https://api.cdp.coinbase.com/platform/v2/x402');
});

test('funding roadmap maps product evidence to Base funding paths', () => {
  const roadmap = buildBaseFundRoadmap();
  assert.deepEqual(roadmap.paths.map((item) => item.id), [
    'weekly-rewards',
    'builder-grants',
    'op-retro-funding',
    'base-batches',
  ]);
  assert.ok(roadmap.requiredEvidence.includes('Base mainnet proof transaction'));
  assert.ok(roadmap.requiredEvidence.includes('x402 paid endpoint demo'));
});

test('submission pack requires reviewable Base evidence links', () => {
  const pack = buildBaseSubmissionPack({
    repositoryUrl: 'https://github.com/labsaistudio/AABC-Labs-v3',
    demoUrl: 'https://app.aabc.app/base-live-demo',
    x402EndpointUrl: 'https://app.aabc.app/api/base-agent-report',
    proofUrl: 'https://app.aabc.app/proof/base-live-run',
    explorerUrl: 'https://sepolia.basescan.org/tx/0x1111111111111111111111111111111111111111111111111111111111111111',
  });
  assert.equal(pack.ecosystem, 'base');
  assert.equal(pack.evidence.length, 5);
  assert.ok(pack.readinessChecks.every((item) => item.status === 'ready'));
});

test('submission pack marks placeholder evidence honestly', () => {
  const pack = buildBaseSubmissionPack({
    repositoryUrl: 'https://github.com/labsaistudio/AABC-Labs-v3',
    demoUrl: 'https://app.aabc.app/base-demo',
    x402EndpointUrl: 'https://app.aabc.app/api/agent-report',
    proofUrl: 'https://app.aabc.app/proof/base-agent-fund-pack',
    explorerUrl: 'https://sepolia.basescan.org/tx/0x0000000000000000000000000000000000000000000000000000000000000000',
  });
  const report = buildReadinessReport(pack);
  assert.equal(report.canSubmit, false);
  assert.deepEqual(report.nextRequiredEvidence, ['demo', 'x402_endpoint', 'proof', 'explorer']);
});

test('readiness command writes missing evidence report', async () => {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  await promisify(execFile)('node', ['cli/index.mjs', 'submission']);
  await promisify(execFile)('node', ['cli/index.mjs', 'readiness']);
  const report = JSON.parse(await readFile('examples/base/base-readiness-report.json', 'utf8'));
  assert.equal(report.canSubmit, false);
  assert.equal(report.placeholderCount, 1);
  assert.deepEqual(report.nextRequiredEvidence, ['demo']);
});

test('Base onboarding plan includes Account and Paymaster surfaces', () => {
  const plan = buildBaseOnboardingPlan();
  assert.equal(plan.ecosystem, 'base');
  assert.ok(plan.surfaces.some((item) => item.id === 'base-account'));
  assert.ok(plan.surfaces.some((item) => item.id === 'base-paymaster'));
  assert.equal(plan.sponsorshipPolicy.spendLimitUsd, 25);
});

test('x402 scaffold exposes agent-readable service discovery', async () => {
  const skill = await readFile('scaffolds/x402-express/.well-known/SKILL.md', 'utf8');
  assert.match(skill, /# AABC Base Agent Report/);
  assert.match(skill, /\/api\/base-agent-report/);
  assert.match(skill, /eip155:8453/);
  assert.match(skill, /\$0\.01/);
});

test('x402 buyer scaffold uses official client packages', async () => {
  const source = await readFile('scaffolds/x402-buyer/client.ts', 'utf8');
  assert.match(source, /@x402\/fetch/);
  assert.match(source, /@x402\/evm/);
  assert.match(source, /wrapFetchWithPayment/);
  assert.match(source, /selectSafeBaseRequirement/);
  assert.match(source, /expectedPayTo/);
  assert.match(source, /maxAmountAtomic/);
  assert.match(source, /eip155:8453/);
});

test('Paymaster scaffold keeps sponsorship policy reviewable', async () => {
  const policy = JSON.parse(await readFile('scaffolds/base-account-paymaster/policy.json', 'utf8'));
  assert.equal(policy.ecosystem, 'base');
  assert.equal(policy.network, 'base-mainnet');
  assert.equal(policy.sponsoredCalls.includes('recordProof(bytes32)'), true);
  assert.equal(policy.spendLimitUsd, 25);
});

test('Base public module text stays Base-only', async () => {
  const files = await collectBaseModuleFiles();
  const scanned = publicSourceFiles(files);
  const blocked = ['sol' + 'ana', 'b' + 'sc', 'bn' + 'b', 'we' + 'b3', 'cry' + 'pto'];
  const forbidden = new RegExp(`\\b(${blocked.join('|')})\\b`, 'i');
  for (const file of scanned) {
    const text = await readFile(file, 'utf8');
    assert.equal(forbidden.test(text), false, `${file} contains forbidden non-Base wording`);
  }
});

test('Base public module text stays English-only', async () => {
  const files = await collectBaseModuleFiles();
  const scanned = publicSourceFiles(files);
  for (const file of scanned) {
    const text = await readFile(file, 'utf8');
    assert.equal(/[\u4e00-\u9fff]/.test(text), false, `${file} contains non-English public text`);
  }
});

test('Base public module does not mention the previous non-CDP facilitator', async () => {
  const files = await collectBaseModuleFiles();
  const scanned = publicSourceFiles(files);
  const previousName = `${'Pay'}${'AI'}`;
  const previousUrl = `${'facilitator'}\\.${'pa'}${'yai'}\\.${'network'}`;
  const previousFacilitator = new RegExp(`${previousName}|${previousUrl}`, 'i');
  for (const file of scanned) {
    const text = await readFile(file, 'utf8');
    assert.equal(previousFacilitator.test(text), false, `${file} mentions the previous facilitator`);
  }
});

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(path));
    if (entry.isFile()) files.push(path);
  }
  return files;
}

async function collectBaseModuleFiles() {
  const roots = [
    'apps/demo',
    'cli/index.mjs',
    'contracts',
    'docs/base',
    'examples/base',
    'scaffolds',
    'scripts',
    'src/base',
    'src/deploy',
    'src/proof',
    'src/workflow',
    'src/x402',
    'tests/base',
  ];
  const files = [];
  for (const root of roots) {
    if (root.includes('.')) files.push(root);
    else files.push(...await collectFiles(root));
  }
  return files;
}

function publicSourceFiles(files) {
  return files.filter((file) => (
    !file.startsWith('.git/')
    && !file.startsWith('node_modules/')
    && file !== 'package-lock.json'
  ));
}
