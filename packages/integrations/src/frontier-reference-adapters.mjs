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
