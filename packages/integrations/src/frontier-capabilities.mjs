export const REQUIRED_FRONTIER_CAPABILITY_IDS = Object.freeze([
  'torque-mcp-growth',
  'rpc-infrastructure-credits',
  'palm-usd-settlement',
  'jupiter-developer-platform',
  'encrypt-encrypted-capital-markets',
  'ika-bridgeless-capital-markets',
  'umbra-privacy-sdk',
]);

export const FRONTIER_CAPABILITIES = Object.freeze([
  capability(
    'torque-mcp-growth',
    'growth',
    'Torque MCP campaign and incentive surface',
    'https://superteam.fun/earn/listing/build-with-torque-mcp-1',
  ),
  capability(
    'rpc-infrastructure-credits',
    'infrastructure',
    'Solana RPC infrastructure credit surface',
    'https://superteam.fun/earn/listing/dollar10000-in-rpc-infrastructure-credits-for-colosseum-frontier-hackathon',
  ),
  capability(
    'palm-usd-settlement',
    'payment',
    'Palm USD settlement surface',
    'https://superteam.fun/earn/listing/palm-usd-x-superteam-uae-solana-builders-1',
  ),
  capability(
    'jupiter-developer-platform',
    'liquidity',
    'Jupiter Developer Platform routing surface',
    'https://superteam.fun/earn/listing/not-your-regular-bounty',
  ),
  capability(
    'encrypt-encrypted-capital-markets',
    'privacy',
    'Encrypt encrypted capital markets surface',
    'https://superteam.fun/earn/listing/encrypt-ika-frontier-april-2026',
  ),
  capability(
    'ika-bridgeless-capital-markets',
    'capital-markets',
    'Ika bridgeless capital markets surface',
    'https://superteam.fun/earn/listing/encrypt-ika-frontier-april-2026',
  ),
  capability(
    'umbra-privacy-sdk',
    'privacy',
    'Umbra privacy SDK surface',
    'https://superteam.fun/earn/listing/umbra-side-track',
  ),
]);

export function assertFrontierStackCoverage(capabilities = FRONTIER_CAPABILITIES) {
  const ids = new Set(capabilities.map((item) => item.id));
  const missing = REQUIRED_FRONTIER_CAPABILITY_IDS.filter((id) => !ids.has(id));
  if (missing.length) throw new Error(`missing_frontier_capabilities:${missing.join(',')}`);

  const invalid = capabilities.filter((item) => (
    item.execution !== 'external_runtime'
    || item.credentialBoundary !== 'not_in_public_repository'
    || item.broadcasting !== 'not_enabled_in_reference_runtime'
  ));
  if (invalid.length) {
    throw new Error(`invalid_frontier_capability_boundary:${invalid.map((item) => item.id).join(',')}`);
  }
  return true;
}

export function frontierCapabilityIds(capabilities = FRONTIER_CAPABILITIES) {
  return capabilities.map((item) => item.id);
}

function capability(id, layer, label, sourceUrl) {
  return Object.freeze({
    id,
    chain: 'solana',
    layer,
    label,
    sourceUrl,
    execution: 'external_runtime',
    credentialBoundary: 'not_in_public_repository',
    broadcasting: 'not_enabled_in_reference_runtime',
    proofRole: 'declared_frontier_sponsor_surface',
  });
}
