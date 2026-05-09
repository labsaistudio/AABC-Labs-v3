export function evaluatePoolReadiness(pool) {
  return {
    poolId: pool.id,
    hasDepth: pool.depthUsd >= 25000,
    spreadOk: pool.spreadBps <= 150,
    action: 'prepare-only',
  };
}

export const launchGuardrails = {
  minDepthUsd: 25000,
  maxSpreadBps: 150,
  requireProofBeforeRoute: true,
};
