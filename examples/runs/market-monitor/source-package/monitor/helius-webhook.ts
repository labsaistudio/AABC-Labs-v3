export function buildWebhookSubscription(projectId) {
  return {
    projectId,
    provider: 'helius-protocol',
    eventTypes: ['token-transfer', 'pool-update'],
    writesToProofLedger: true,
  };
}
