export const lockPlan = {
  preparedOnly: true,
  unlockMonths: 12,
  protocol: 'raydium-protocol',
  requiresAuthorityScan: true,
};

export function lockReadiness(authorityScan) {
  return {
    canPrepare: authorityScan.freezeAuthorityReviewed,
    canBroadcast: false,
    reason: 'reference runtime prepares proof only',
  };
}
