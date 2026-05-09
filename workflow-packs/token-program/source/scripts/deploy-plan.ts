export const deployPlan = {
  cluster: 'testnet',
  broadcasted: false,
  confirmed: false,
  instructions: [
    'create mint account',
    'initialize SPL mint',
    'attach metadata manifest',
    'prepare authority handoff',
  ],
};

export function summarizeDeployPlan() {
  return deployPlan.instructions.map((label, index) => ({
    order: index + 1,
    label,
    requiresUserReview: true,
  }));
}
