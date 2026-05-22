export const baseOnboarding = {
  ecosystem: 'base',
  network: 'base-mainnet',
  walletSurface: 'base-account',
  gasSurface: 'base-paymaster',
  allowedCalls: ['recordProof(bytes32)'],
};

export function buildSponsoredProofIntent(proofHash: string) {
  if (!/^0x[a-fA-F0-9]{64}$/.test(proofHash)) {
    throw new Error('invalid_proof_hash');
  }
  return {
    ...baseOnboarding,
    method: 'recordProof(bytes32)',
    args: [proofHash],
    reviewRequired: true,
  };
}
