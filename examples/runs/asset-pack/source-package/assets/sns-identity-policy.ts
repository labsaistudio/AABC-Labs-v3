export const snsIdentityPolicy = {
  sponsorSurface: 'sns-identity-layer',
  workflow: 'asset-pack',
  chain: 'solana',
  mode: 'prepared_only_reference_runtime',
  identityBoundary: {
    nameResolution: 'reviewable_before_publish',
    profileOwnership: 'wallet_bound',
    productionCredential: 'configured_outside_public_repository',
    writeAccess: 'disabled_in_reference_runtime',
  },
  assetControls: [
    'metadata_manifest_required',
    'identity_link_review_required',
    'public_profile_preview_required',
  ],
  proof: {
    requiredArtifacts: [
      'frontier_capability_plan',
      'asset_manifest',
      'source_package_manifest',
    ],
    reviewSignals: [
      'name resolution boundary',
      'profile ownership review',
      'identity-linked asset surface',
    ],
  },
};

export function buildSnsIdentityBinding({ name, walletAddress, assetId }) {
  return {
    sponsorSurface: snsIdentityPolicy.sponsorSurface,
    name,
    walletAddress,
    assetId,
    preparedOnly: true,
    proofRequired: snsIdentityPolicy.proof.requiredArtifacts,
  };
}
