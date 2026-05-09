export const tokenAuthorityPlan = {
  chain: 'solana',
  tokenStandard: 'spl-token',
  mintAuthority: 'session-wallet',
  freezeAuthority: 'revoked-after-review',
  metadataAuthority: 'multisig-review',
};

export function buildMintReview() {
  return {
    checks: [
      'mint parameters fixed before deploy',
      'authority changes prepared as separate instructions',
      'metadata update path remains reviewable',
    ],
    broadcasted: false,
  };
}
