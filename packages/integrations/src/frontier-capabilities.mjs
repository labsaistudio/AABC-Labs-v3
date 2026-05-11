export const REQUIRED_FRONTIER_CAPABILITY_IDS = Object.freeze([
  'torque-mcp-growth',
  'rpc-infrastructure-credits',
  'palm-usd-settlement',
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
