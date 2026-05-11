import { FRONTIER_CAPABILITIES } from './frontier-capabilities.mjs';

const SIGNALS = Object.freeze({
  'torque-mcp-growth': [
    'campaign intent contract',
    'reward eligibility boundary',
    'MCP action review surface',
  ],
  'rpc-infrastructure-credits': [
    'read path routing policy',
    'provider budget envelope',
    'monitoring latency class',
  ],
  'palm-usd-settlement': [
    'settlement currency policy',
    'payment route boundary',
    'treasury approval state',
  ],
  'jupiter-developer-platform': [
    'quote and route surface',
    'swap instruction preparation boundary',
    'credential boundary',
  ],
  'encrypt-encrypted-capital-markets': [
    'encrypted order intent boundary',
    'confidential state review',
    'public proof envelope',
  ],
  'ika-bridgeless-capital-markets': [
    'bridgeless custody boundary',
    'cross-chain authorization review',
    'dWallet policy surface',
  ],
  'umbra-privacy-sdk': [
    'privacy proof boundary',
    'recipient reveal policy',
    'public artifact redaction',
  ],
  'cloak-privacy-payments': [
    'privacy payment boundary',
    'merchant settlement review',
    'public receipt redaction',
  ],
  'sns-identity-layer': [
    'name resolution boundary',
    'profile ownership review',
    'identity-linked asset surface',
  ],
  'jito-infrastructure': [
    'transaction landing policy',
    'bundle preparation boundary',
    'tip budget review',
  ],
  'lifi-cross-chain-routing': [
    'cross-chain route intent',
    'bridge risk envelope',
    'destination settlement review',
  ],
});

export function buildFrontierCapabilityArtifact({ workflow, step }) {
  const ids = workflow.ecosystem?.frontierCapabilities || [];
  if (ids.length === 0) throw new Error(`frontier_capabilities_required:${workflow.id}`);
  return {
    type: 'frontier_capability_plan',
    title: `Frontier capability plan for ${step.key}`,
    path: `artifacts/${step.key}-frontier-capabilities.json`,
    data: {
      stepKey: step.key,
      runtime: 'frontier_sponsor_surface',
      runtimeBoundary: {
        execution: 'external_runtime',
        credentials: 'not_in_public_repository',
        liveSdk: 'not_bundled_in_reference_runtime',
        broadcasting: 'not_enabled_in_reference_runtime',
      },
      capabilities: ids.map(frontierCapabilitySummary),
    },
    public: true,
  };
}

export function frontierCapabilitySummary(id) {
  const capability = FRONTIER_CAPABILITIES.find((item) => item.id === id);
  if (!capability) throw new Error(`unknown_frontier_capability:${id}`);
  return {
    id,
    chain: capability.chain,
    layer: capability.layer,
    label: capability.label,
    sourceUrl: capability.sourceUrl,
    execution: capability.execution,
    credentialBoundary: capability.credentialBoundary,
    broadcasting: capability.broadcasting,
    reviewSignals: SIGNALS[id],
  };
}
