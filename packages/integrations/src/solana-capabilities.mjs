export const REQUIRED_SOLANA_CAPABILITY_IDS = Object.freeze([
  'sendai-solana-agent-kit',
  'solana-web3js',
  'spl-token-tooling',
  'phantom-wallet-adapter',
  'solflare-wallet-adapter',
  'reown-wallet-connectivity',
  'blinks-solana-actions',
  'jupiter-protocol',
  'raydium-protocol',
  'metaplex-protocol',
  'helius-protocol',
  'squads-protocol',
  'x402-solana-usdc',
]);

export const SOLANA_CAPABILITIES = Object.freeze([
  capability('sendai-solana-agent-kit', 'agent-runtime', 'SendAI Solana Agent Kit ecosystem'),
  capability('solana-web3js', 'chain-client', 'Solana Web3.js'),
  capability('spl-token-tooling', 'token-tooling', 'SPL Token tooling'),
  capability('phantom-wallet-adapter', 'wallet', 'Phantom wallet adapter'),
  capability('solflare-wallet-adapter', 'wallet', 'Solflare wallet adapter'),
  capability('reown-wallet-connectivity', 'wallet', 'Reown wallet connectivity'),
  capability('blinks-solana-actions', 'action-surface', 'Blinks and Solana Actions'),
  capability('jupiter-protocol', 'protocol', 'Jupiter route and quote skills'),
  capability('raydium-protocol', 'protocol', 'Raydium liquidity skills'),
  capability('metaplex-protocol', 'protocol', 'Metaplex asset skills'),
  capability('helius-protocol', 'infra', 'Helius indexing and webhook skills'),
  capability('squads-protocol', 'governance', 'Squads multisig skills'),
  capability('x402-solana-usdc', 'payment', 'x402 payment flows with Solana USDC'),
]);

export function assertSolanaStackCoverage(capabilities = SOLANA_CAPABILITIES) {
  const ids = new Set(capabilities.map((item) => item.id));
  const missing = REQUIRED_SOLANA_CAPABILITY_IDS.filter((id) => !ids.has(id));
  if (missing.length) throw new Error(`missing_solana_capabilities:${missing.join(',')}`);

  const invalid = capabilities.filter((item) => (
    item.chain !== 'solana'
    || item.execution !== 'external_runtime'
    || item.broadcasting !== 'not_enabled_in_reference_runtime'
  ));
  if (invalid.length) throw new Error(`invalid_solana_capability_boundary:${invalid.map((item) => item.id).join(',')}`);
  return true;
}

export function solanaCapabilityIds(capabilities = SOLANA_CAPABILITIES) {
  return capabilities.map((item) => item.id);
}

function capability(id, layer, label) {
  return Object.freeze({
    id,
    chain: 'solana',
    layer,
    label,
    execution: 'external_runtime',
    broadcasting: 'not_enabled_in_reference_runtime',
    proofRole: 'declared_capability_surface',
  });
}
