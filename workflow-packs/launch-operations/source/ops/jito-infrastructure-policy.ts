export const jitoInfrastructurePolicy = {
  sponsorSurface: 'jito-infrastructure',
  workflow: 'launch-operations',
  chain: 'solana',
  mode: 'prepared_only_reference_runtime',
  landingBoundary: {
    transactionLanding: 'policy_checked',
    bundlePreparation: 'prepared_only',
    productionCredential: 'configured_outside_public_repository',
    broadcast: 'disabled_in_reference_runtime',
  },
  budgetControls: {
    maxTipUsd: 10,
    requiresUserApproval: true,
    proofBeforeBroadcast: true,
  },
  proof: {
    requiredArtifacts: [
      'frontier_capability_plan',
      'route_plan',
      'source_package_manifest',
    ],
    reviewSignals: [
      'transaction landing policy',
      'bundle preparation boundary',
      'tip budget review',
    ],
  },
};

export function buildJitoLandingPlan({ routeId, tipUsd }) {
  return {
    sponsorSurface: jitoInfrastructurePolicy.sponsorSurface,
    routeId,
    tipUsd,
    preparedOnly: true,
    requiresUserApproval: tipUsd > 0,
    proofRequired: jitoInfrastructurePolicy.proof.requiredArtifacts,
  };
}
