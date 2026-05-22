export function buildBaseAgentWorkflow() {
  return {
    id: 'base-agent-fund-pack',
    product: 'AABC Base Agent Fund Pack',
    ecosystem: 'base',
    network: 'base-mainnet',
    steps: [
      step('discover-paid-service', 'Find a paid resource and capture its x402 requirement.'),
      step('pay-for-service', 'Prepare an agent buyer request for the approved paid resource.'),
      step('create-paid-endpoint', 'Generate a paid endpoint source package for another agent to call.'),
      step('record-proof', 'Record the workflow evidence envelope for Base review.'),
    ],
  };
}

function step(id, intent) {
  return { id, intent, mode: 'reviewable_reference' };
}
