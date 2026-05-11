export const palmUsdSettlementPolicy = {
  sponsorSurface: 'palm-usd-settlement',
  workflow: 'paid-endpoint',
  chain: 'solana',
  currency: 'Palm USD',
  mode: 'prepared_only_reference_runtime',
  paymentBoundary: {
    runtime: 'external_runtime',
    treasuryBoundary: 'not_in_public_repository',
    credentialBoundary: 'not_in_public_repository',
    liveSettlement: 'disabled_in_reference_runtime',
  },
  proof: {
    requiredArtifacts: [
      'frontier_capability_plan',
      'openapi_spec',
      'source_package_manifest',
    ],
    reviewSignals: [
      'settlement currency policy',
      'payment route boundary',
      'treasury approval state',
    ],
  },
};

export function buildPalmUsdPaymentIntent(amountUsd: number) {
  return {
    sponsorSurface: palmUsdSettlementPolicy.sponsorSurface,
    chain: palmUsdSettlementPolicy.chain,
    currency: palmUsdSettlementPolicy.currency,
    amountUsd,
    preparedOnly: true,
    proofRequired: palmUsdSettlementPolicy.proof.requiredArtifacts,
  };
}
