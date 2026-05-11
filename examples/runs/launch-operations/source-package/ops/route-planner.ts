export const routePlan = {
  quoteProtocol: 'jupiter-protocol',
  liquidityProtocol: 'raydium-protocol',
  broadcasted: false,
  maxSlippageBps: 120,
  routeHealth: 'review-required',
};

export function buildRouteDecision(snapshot) {
  return {
    selectedRoute: snapshot.bestRoute,
    maxSlippageBps: routePlan.maxSlippageBps,
    requiresManualApproval: true,
  };
}
