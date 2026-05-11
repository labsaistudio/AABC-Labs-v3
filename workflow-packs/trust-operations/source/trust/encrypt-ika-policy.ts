export const encryptIkaPolicy = {
  sponsorSurfaces: [
    'encrypt-encrypted-capital-markets',
    'ika-bridgeless-capital-markets',
  ],
  workflow: 'trust-operations',
  chain: 'solana',
  mode: 'prepared_only_reference_runtime',
  capitalMarketsBoundary: {
    encryptedIntent: 'reviewable_without_plaintext_order_flow',
    bridgelessCustody: 'policy_checked_before_execution',
    productionCredential: 'configured_outside_public_repository',
    broadcast: 'disabled_in_reference_runtime',
  },
  trustControls: [
    'authority_scan_required',
    'multisig_review_required',
    'public_proof_envelope_required',
  ],
  proof: {
    requiredArtifacts: [
      'frontier_capability_plan',
      'authority_scan',
      'lock_plan',
      'source_package_manifest',
    ],
    reviewSignals: [
      'encrypted order intent boundary',
      'bridgeless custody boundary',
      'cross-chain authorization review',
    ],
  },
};

export function buildCapitalMarketsReview(lockPlan) {
  return {
    sponsorSurfaces: encryptIkaPolicy.sponsorSurfaces,
    workflow: encryptIkaPolicy.workflow,
    lockPlan,
    preparedOnly: true,
    proofRequired: encryptIkaPolicy.proof.requiredArtifacts,
  };
}
