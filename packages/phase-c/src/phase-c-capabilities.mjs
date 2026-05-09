export const PHASE_C_REQUIRED_IDS = Object.freeze([
  'smart-account-session',
  'server-treasury-signer',
  'crypto-skills-sync',
  'solana-session-key',
  'multi-chain-explorer',
  'full-risk-engine',
  'external-lp-locker',
  'cross-chain-revoke-authority',
]);

export const PHASE_C_CAPABILITIES = Object.freeze([
  capability('smart-account-session', ['paid_mainnet_users', 'large_value_usage'], [
    'erc-4337',
    'eip-7702',
    'safe-modules',
  ]),
  capability('server-treasury-signer', ['x402_internal_payment_flow'], [
    'treasury-limits',
    'payment-reconciliation',
  ]),
  capability('crypto-skills-sync', ['third_party_skill_count_over_50'], [
    'catalog-sync',
    'skill-version-pinning',
  ]),
  capability('solana-session-key', ['solana_paid_user_demand'], [
    'session-scope-policy',
    'wallet-approval-boundary',
  ]),
  capability('multi-chain-explorer', ['base_or_arbitrum_surface'], [
    'chain-normalized-proof-links',
    'explorer-adapter-contract',
  ]),
  capability('full-risk-engine', ['repeated_large_value_incidents'], [
    'trace-review',
    'mev-surface',
    'nonce-risk',
  ]),
  capability('external-lp-locker', ['mainnet_large_lp_lock_demand'], [
    'third-party-locker-adapter',
    'locker-proof-normalization',
  ]),
  capability('cross-chain-revoke-authority', ['evm_and_solana_authority_coverage'], [
    'authority-scan',
    'coverage-labels',
  ]),
]);

export function phaseCCapabilityIds(capabilities = PHASE_C_CAPABILITIES) {
  return capabilities.map((item) => item.id);
}

export function assertPhaseCCoverage(capabilities = PHASE_C_CAPABILITIES) {
  const ids = new Set(phaseCCapabilityIds(capabilities));
  const missing = PHASE_C_REQUIRED_IDS.filter((id) => !ids.has(id));
  if (missing.length) throw new Error(`missing_phase_c_capabilities:${missing.join(',')}`);
  return true;
}

function capability(id, requiredSignals, contracts) {
  return Object.freeze({
    id,
    phase: 'c',
    status: 'planned_contract',
    requiredSignals,
    contracts,
    publicBoundary: 'contract_only_no_runtime_custody',
  });
}
