export function buildBaseOnboardingPlan() {
  return {
    ecosystem: 'base',
    product: 'AABC Base Agent Fund Pack',
    surfaces: [
      {
        id: 'base-account',
        role: 'wallet_onboarding',
        userOutcome: 'approve agent work without a custom wallet setup',
      },
      {
        id: 'base-paymaster',
        role: 'gas_sponsorship',
        userOutcome: 'record workflow proof without forcing first-run gas friction',
      },
    ],
    sponsorshipPolicy: {
      network: 'base-sepolia',
      allowedCalls: ['recordProof(bytes32)'],
      spendLimitUsd: 25,
      reviewRequired: true,
    },
  };
}
