export const REQUIRED_QVAC_CAPABILITY_IDS = Object.freeze([
  'qvac-local-inference',
  'qvac-openai-compatible-http',
  'qvac-p2p-runtime',
  'qvac-local-rag',
]);

export const QVAC_CAPABILITIES = Object.freeze([
  capability('qvac-local-inference', 'local-ai-runtime', 'QVAC local model inference'),
  capability('qvac-openai-compatible-http', 'api-surface', 'OpenAI-compatible local HTTP API'),
  capability('qvac-p2p-runtime', 'network', 'Peer-to-peer inference coordination'),
  capability('qvac-local-rag', 'retrieval', 'Local retrieval augmented generation'),
]);

export function assertQvacStackCoverage(capabilities = QVAC_CAPABILITIES) {
  const ids = new Set(capabilities.map((item) => item.id));
  const missing = REQUIRED_QVAC_CAPABILITY_IDS.filter((id) => !ids.has(id));
  if (missing.length) throw new Error(`missing_qvac_capabilities:${missing.join(',')}`);

  const invalid = capabilities.filter((item) => (
    item.execution !== 'local_or_p2p_runtime'
    || item.remoteProviderKey !== 'not_required'
    || item.modelWeights !== 'not_in_public_repository'
  ));
  if (invalid.length) throw new Error(`invalid_qvac_capability_boundary:${invalid.map((item) => item.id).join(',')}`);
  return true;
}

export function qvacCapabilityIds(capabilities = QVAC_CAPABILITIES) {
  return capabilities.map((item) => item.id);
}

function capability(id, layer, label) {
  return Object.freeze({
    id,
    layer,
    label,
    execution: 'local_or_p2p_runtime',
    remoteProviderKey: 'not_required',
    modelWeights: 'not_in_public_repository',
    proofRole: 'declared_local_ai_surface',
  });
}
