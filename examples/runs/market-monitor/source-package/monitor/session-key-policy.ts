export const sessionKeyPolicy = {
  chain: 'solana',
  signerMode: 'session_wallet',
  workflow: 'market-monitor',
  scope: {
    allowedOperations: ['read_state', 'monitor_setup'],
    maxSpendUsd: 0,
    validForMinutes: 45,
    revocation: 'owner_can_revoke',
  },
  proof: {
    requiredArtifacts: [
      'policy_gate_decision',
      'session_key_mode_contract',
      'monitor_rules',
      'source_package_manifest',
    ],
    signingMaterial: 'not_in_public_contract',
  },
};

export function canRunMonitorStep(operationType: string) {
  return sessionKeyPolicy.scope.allowedOperations.includes(operationType);
}
