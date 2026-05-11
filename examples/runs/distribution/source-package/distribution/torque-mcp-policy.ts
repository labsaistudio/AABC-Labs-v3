export const torqueMcpPolicy = {
  sponsorSurface: 'torque-mcp-growth',
  workflow: 'distribution',
  chain: 'solana',
  mode: 'prepared_only_reference_runtime',
  campaign: {
    audience: 'recipient_distribution',
    eligibility: [
      'wallet_is_allowed',
      'recipient_cap_is_respected',
      'receipt_id_is_unique',
    ],
    rewardIntent: 'verified_distribution_completion',
  },
  mcpBoundary: {
    runtime: 'external_runtime',
    credentialBoundary: 'not_in_public_repository',
    writeAccess: 'disabled_in_reference_runtime',
  },
  proof: {
    requiredArtifacts: [
      'frontier_capability_plan',
      'recipient_manifest',
      'source_package_manifest',
    ],
    reviewSignals: [
      'campaign intent contract',
      'reward eligibility boundary',
      'MCP action review surface',
    ],
  },
};

export function buildTorqueCampaignAction(recipientCount: number) {
  return {
    sponsorSurface: torqueMcpPolicy.sponsorSurface,
    action: 'prepare_campaign_distribution',
    recipientCount,
    preparedOnly: true,
    proofRequired: torqueMcpPolicy.proof.requiredArtifacts,
  };
}
