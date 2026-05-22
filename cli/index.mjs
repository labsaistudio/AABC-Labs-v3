#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { buildBaseAgentWorkflow } from '../src/workflow/base-agent-workflow.mjs';
import { runWorkflow } from '../src/workflow/runner.mjs';
import { verifyProof } from '../src/proof/verifier.mjs';
import { buildBaseSubmissionPack } from '../src/base/submission-pack.mjs';
import { buildReadinessReport } from '../src/base/readiness-report.mjs';
import { buildBaseProofTransaction } from '../src/proof/base-proof-transaction.mjs';
import { exportProofHtml } from '../src/proof/html-export.mjs';
import {
  BASE_AGENT_REPORT_ENDPOINT,
  assertSufficientBaseUsdc,
  buildPrivateKeySigner,
  fetchPaymentRequired,
  payBaseAgentReport,
  requiredAtomicAmount,
  selectBasePaymentRequirement,
} from '../src/x402/agent-payer.mjs';

const command = process.argv[2];
const arg = process.argv[3];

if (command === 'demo') {
  const proof = await runWorkflow(buildBaseAgentWorkflow());
  await writeFile('examples/base/base-agent-fund-pack.proof.json', JSON.stringify(proof, null, 2));
  await writeFile('examples/base/base-agent-fund-pack.proof.html', exportProofHtml(proof));
  console.log('wrote examples/base/base-agent-fund-pack.proof.json');
  console.log('wrote examples/base/base-agent-fund-pack.proof.html');
} else if (command === 'verify') {
  const proof = JSON.parse(await readFile(arg, 'utf8'));
  verifyProof(proof);
  console.log('proof verified');
} else if (command === 'submission') {
  const pack = buildBaseSubmissionPack({
    repositoryUrl: 'https://github.com/labsaistudio/AABC-Labs-v3',
    demoUrl: 'https://app.aabc.app/base-demo',
    x402EndpointUrl: 'https://app.aabc.app/api/base-agent-report',
    proofUrl: 'https://app.aabc.app/base-fund',
    explorerUrl: 'https://basescan.org/tx/0x5a5d5c145982574d98d9cb98bf407bb6e0dab501b626d917ff2eabf7a89b4321',
  });
  await writeFile('examples/base/base-submission-pack.json', JSON.stringify(pack, null, 2));
  console.log('wrote examples/base/base-submission-pack.json');
} else if (command === 'readiness') {
  const pack = JSON.parse(await readFile('examples/base/base-submission-pack.json', 'utf8'));
  const report = buildReadinessReport(pack);
  await writeFile('examples/base/base-readiness-report.json', JSON.stringify(report, null, 2));
  console.log('wrote examples/base/base-readiness-report.json');
} else if (command === 'proof-tx') {
  const [chainId, registryAddress, proofHash] = process.argv.slice(3);
  if (!chainId || !registryAddress || !proofHash) {
    throw new Error('usage: aabc-base proof-tx <chainId> <registryAddress> <proofHash>');
  }
  const tx = buildBaseProofTransaction({
    chainId: Number(chainId),
    registryAddress,
    proofHash,
  });
  await writeFile('examples/base/base-proof-transaction.json', JSON.stringify(tx, null, 2));
  console.log('wrote examples/base/base-proof-transaction.json');
} else if (command === 'scan') {
  console.log('Base module scan is enforced by npm test');
} else if (command === 'pay-report') {
  const endpoint = arg ?? BASE_AGENT_REPORT_ENDPOINT;
  const signer = buildPrivateKeySigner(requiredEnv('BASE_AGENT_PAYER_SIGNER_HEX'));
  const paymentRequired = await fetchPaymentRequired({ endpoint });
  const requirement = selectBasePaymentRequirement(paymentRequired);
  const requiredAtomic = requiredAtomicAmount(requirement);
  const balance = await assertSufficientBaseUsdc({
    address: signer.address,
    rpcUrl: requiredEnv('BASE_MAINNET_RPC_URL'),
    requiredAtomic,
  });
  const result = await payBaseAgentReport({ signer, endpoint, paymentRequired });
  await writeFile('examples/base/base-agent-payment-result.json', JSON.stringify({
    ...result,
    requiredAtomic: requiredAtomic.toString(),
    balanceBeforeAtomic: balance.toString(),
  }, null, 2));
  console.log('wrote examples/base/base-agent-payment-result.json');
} else {
  console.log('Commands: demo, verify, submission, readiness, proof-tx, pay-report, scan');
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name}_required`);
  return value;
}
