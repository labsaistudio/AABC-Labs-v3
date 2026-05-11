export const umbraPrivacyPolicy = {
  sponsorSurface: 'umbra-privacy-sdk',
  workflow: 'fair-sale',
  chain: 'solana',
  mode: 'prepared_only_reference_runtime',
  privacyBoundary: {
    recipientPrivacy: 'enabled_for_policy_model',
    revealRule: 'user_controlled_after_review',
    productionCredential: 'configured_outside_public_repository',
    broadcast: 'disabled_in_reference_runtime',
  },
  claimControls: [
    'allocation_commitment_required',
    'claim_preview_required',
    'public_artifact_redaction_required',
  ],
  proof: {
    requiredArtifacts: [
      'frontier_capability_plan',
      'sale_config',
      'html_preview',
      'source_package_manifest',
    ],
    reviewSignals: [
      'privacy proof boundary',
      'recipient reveal policy',
      'public artifact redaction',
    ],
  },
};

export function buildPrivateClaimPlan({ allocationCommitment, claimWindowId }) {
  return {
    sponsorSurface: umbraPrivacyPolicy.sponsorSurface,
    workflow: umbraPrivacyPolicy.workflow,
    allocationCommitment,
    claimWindowId,
    preparedOnly: true,
    proofRequired: umbraPrivacyPolicy.proof.requiredArtifacts,
  };
}
