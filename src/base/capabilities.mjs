export const BASE_CAPABILITIES = Object.freeze([
  capability(
    'base-mainnet',
    'network',
    'Base mainnet execution target',
    'https://docs.base.org/base-chain/quickstart/network-information',
  ),
  capability(
    'base-sepolia',
    'network',
    'Base Sepolia test target',
    'https://docs.base.org/base-chain/quickstart/network-information',
  ),
  capability(
    'x402-seller-endpoint',
    'payment',
    'x402 paid endpoint for agent-accessible services',
    'https://docs.base.org/ai-agents/payments/accepting-payments',
  ),
  capability(
    'agentic-wallet-x402-buyer',
    'payment',
    'Agentic Wallet skill for paying x402 resources',
    'https://docs.base.org/ai-agents/payments/pay-for-services-with-x402',
  ),
  capability(
    'base-account',
    'wallet',
    'Base Account onboarding surface',
    'https://www.base.org/build/base-account',
  ),
  capability(
    'base-paymaster',
    'gas',
    'Coinbase Developer Platform Paymaster gas sponsorship',
    'https://www.coinbase.com/developer-platform/products/paymaster',
  ),
  capability(
    'base-proof-record',
    'proof',
    'Base proof record for workflow evidence',
    'https://basescan.org',
  ),
]);

export function assertBaseOnlyCoverage(capabilities = BASE_CAPABILITIES) {
  const required = new Set([
    'base-mainnet',
    'base-sepolia',
    'x402-seller-endpoint',
    'agentic-wallet-x402-buyer',
    'base-account',
    'base-paymaster',
    'base-proof-record',
  ]);
  const ids = new Set(capabilities.map((item) => item.id));
  const missing = [...required].filter((id) => !ids.has(id));
  if (missing.length) throw new Error(`missing_base_capabilities:${missing.join(',')}`);
  const invalid = capabilities.filter((item) => item.ecosystem !== 'base');
  if (invalid.length) throw new Error(`invalid_ecosystem:${invalid.map((item) => item.id).join(',')}`);
  return true;
}

function capability(id, layer, label, sourceUrl) {
  return Object.freeze({
    id,
    ecosystem: 'base',
    layer,
    label,
    sourceUrl,
    runtimeBoundary: 'public_reference_contract',
    productionCredentialBoundary: 'not_in_public_repository',
  });
}
