import { getBaseNetwork } from '../base/network-config.mjs';

const RECORD_PROOF_SELECTOR = '0x2263f290';

export function buildBaseProofTransaction({ chainId, registryAddress, proofHash }) {
  const network = getBaseNetwork(chainId);
  assertAddress(registryAddress, 'registryAddress');
  assertHash(proofHash, 'proofHash');
  return {
    ecosystem: 'base',
    network: network.name,
    chainId,
    to: registryAddress,
    method: 'recordProof(bytes32)',
    data: `${RECORD_PROOF_SELECTOR}${proofHash.slice(2)}`,
    args: [proofHash],
    explorerBaseUrl: network.explorerBaseUrl,
    status: 'prepared_for_review',
  };
}

function assertAddress(value, field) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(value || '')) throw new Error(`invalid_address:${field}`);
}

function assertHash(value, field) {
  if (!/^0x[a-fA-F0-9]{64}$/.test(value || '')) throw new Error(`invalid_hash:${field}`);
}
