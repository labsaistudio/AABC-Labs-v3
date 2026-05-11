export const rpcInfrastructurePolicy = {
  sponsorSurface: 'rpc-infrastructure-credits',
  workflow: 'market-monitor',
  chain: 'solana',
  mode: 'read_only_reference_runtime',
  providerBoundary: {
    runtime: 'external_runtime',
    credentialBoundary: 'not_in_public_repository',
    productionRouting: 'configured_outside_public_repository',
  },
  readClasses: [
    'pool_state',
    'price_band',
    'volume_window',
    'holder_delta',
    'large_swap_events',
  ],
  proof: {
    requiredArtifacts: [
      'frontier_capability_plan',
      'market_snapshot',
      'session_key_mode_contract',
      'source_package_manifest',
    ],
    reviewSignals: [
      'read path routing policy',
      'provider budget envelope',
      'monitoring latency class',
    ],
  },
};

export function buildRpcReadPlan(readClass: string) {
  if (!rpcInfrastructurePolicy.readClasses.includes(readClass)) {
    throw new Error(`unsupported_rpc_read_class:${readClass}`);
  }
  return {
    sponsorSurface: rpcInfrastructurePolicy.sponsorSurface,
    readClass,
    chain: rpcInfrastructurePolicy.chain,
    preparedOnly: true,
    proofRequired: rpcInfrastructurePolicy.proof.requiredArtifacts,
  };
}
