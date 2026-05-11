import { QVAC_CAPABILITIES } from './qvac-capabilities.mjs';

const SIGNALS = Object.freeze({
  'qvac-local-inference': ['local model execution', 'private prompt boundary'],
  'qvac-openai-compatible-http': ['chat completions endpoint', 'embeddings endpoint'],
  'qvac-p2p-runtime': ['peer discovery boundary', 'runtime coordination'],
  'qvac-local-rag': ['local corpus binding', 'retrieval proof manifest'],
});

export function buildQvacRuntimeArtifact({ workflow, step }) {
  const ids = workflow.ecosystem?.qvacCapabilities || [];
  if (ids.length === 0) throw new Error(`qvac_capabilities_required:${workflow.id}`);
  return {
    type: 'qvac_runtime_plan',
    title: `QVAC runtime plan for ${step.key}`,
    path: `artifacts/${step.key}-qvac-runtime.json`,
    data: {
      stepKey: step.key,
      runtime: 'qvac',
      runtimeBoundary: {
        apiSurface: 'openai_compatible_local_http',
        execution: 'local_or_p2p_runtime',
        remoteProviderKey: 'not_required_for_local_runtime',
        modelWeights: 'not_in_public_repository',
        liveSdk: 'not_bundled_in_reference_runtime',
      },
      capabilities: ids.map(qvacCapabilitySummary),
    },
    public: true,
  };
}

export function qvacCapabilitySummary(id) {
  const capability = QVAC_CAPABILITIES.find((item) => item.id === id);
  if (!capability) throw new Error(`unknown_qvac_capability:${id}`);
  return {
    id,
    layer: capability.layer,
    label: capability.label,
    execution: capability.execution,
    remoteProviderKey: capability.remoteProviderKey,
    modelWeights: capability.modelWeights,
    reviewSignals: SIGNALS[id],
  };
}
