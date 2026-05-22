export function buildBaseFundRoadmap() {
  return {
    product: 'AABC Base Agent Fund Pack',
    oneLiner: 'Onchain agent execution, payments, and proof on Base.',
    paths: [
      path('weekly-rewards', 'Ship a working Base demo and publish build evidence.'),
      path('builder-grants', 'Submit the shipped Base workflow with proof records and demo video.'),
      path('op-retro-funding', 'Open the reusable proof and paid-endpoint reference layer.'),
      path('base-batches', 'Use early evidence to apply for the founder program later.'),
    ],
    requiredEvidence: [
      'Base mainnet proof transaction',
      'x402 pay-for-service demo',
      'x402 paid endpoint demo',
      'source package for the generated endpoint',
      'reviewable proof record',
      'short product demo video',
    ],
    publicChannels: [
      'Base Build',
      'Builder Rewards profile',
      'Farcaster build updates',
      'public GitHub repository',
    ],
  };
}

function path(id, objective) {
  return { id, objective, ecosystem: 'base' };
}
