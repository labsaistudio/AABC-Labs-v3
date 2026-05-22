import { readFile, writeFile } from 'node:fs/promises';
import {
  createPublicClient,
  createWalletClient,
  http,
  keccak256,
  toBytes,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { compileProofRegistry } from '../src/deploy/compile-proof-registry.mjs';

const deployerSigner = requiredEnv('DEPLOYER_SIGNER_HEX');
const rpcUrl = requiredEnv('BASE_MAINNET_RPC_URL');
const source = await readFile('contracts/BaseWorkflowProofRegistry.sol', 'utf8');
const proof = JSON.parse(await readFile('examples/base/base-agent-fund-pack.proof.json', 'utf8'));
const compiled = compileProofRegistry(source);
const account = privateKeyToAccount(normalizePrivateKey(deployerSigner));
const publicClient = createPublicClient({ chain: base, transport: http(rpcUrl) });
const walletClient = createWalletClient({ account, chain: base, transport: http(rpcUrl) });

const deployHash = await walletClient.deployContract({
  abi: compiled.abi,
  bytecode: compiled.bytecode,
  args: [account.address],
});
const deployReceipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });
if (deployReceipt.status !== 'success') throw new Error('proof_registry_deploy_failed');

const proofHash = keccak256(toBytes(JSON.stringify(proof)));
const recordHash = await walletClient.writeContract({
  address: deployReceipt.contractAddress,
  abi: compiled.abi,
  functionName: 'recordProof',
  args: [proofHash],
});
const recordReceipt = await publicClient.waitForTransactionReceipt({ hash: recordHash });
if (recordReceipt.status !== 'success') throw new Error('proof_record_failed');

const deployment = {
  ecosystem: 'base',
  network: 'base-mainnet',
  chainId: base.id,
  deployer: account.address,
  proofRegistry: deployReceipt.contractAddress,
  proofHash,
  deploymentTransaction: deployHash,
  proofRecordTransaction: recordHash,
  explorer: {
    registry: `https://basescan.org/address/${deployReceipt.contractAddress}`,
    deployment: `https://basescan.org/tx/${deployHash}`,
    proofRecord: `https://basescan.org/tx/${recordHash}`,
  },
};

await writeFile('examples/base/base-mainnet-deployment.json', JSON.stringify(deployment, null, 2));
console.log(JSON.stringify(deployment, null, 2));

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`missing_required_env:${name}`);
  return value;
}

function normalizePrivateKey(value) {
  return value.startsWith('0x') ? value : `0x${value}`;
}
