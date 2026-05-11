export const lifiCrossChainPolicy = {
  sponsorSurface: 'lifi-cross-chain-routing',
  workflow: 'launch-operations',
  mode: 'prepared_only_reference_runtime',
  routeBoundary: {
    sourceChain: 'user_selected',
    destinationChain: 'policy_checked',
    bridgeExecution: 'prepared_only',
    productionCredential: 'configured_outside_public_repository',
  },
  riskControls: [
    'route_quote_required',
    'destination_settlement_review_required',
    'bridge_risk_envelope_required',
  ],
  proof: {
    requiredArtifacts: [
      'frontier_capability_plan',
      'route_plan',
      'source_package_manifest',
    ],
    reviewSignals: [
      'cross-chain route intent',
      'bridge risk envelope',
      'destination settlement review',
    ],
  },
};

export function buildLifiRouteIntent({ sourceChain, destinationChain, asset }) {
  return {
    sponsorSurface: lifiCrossChainPolicy.sponsorSurface,
    sourceChain,
    destinationChain,
    asset,
    preparedOnly: true,
    proofRequired: lifiCrossChainPolicy.proof.requiredArtifacts,
  };
}
