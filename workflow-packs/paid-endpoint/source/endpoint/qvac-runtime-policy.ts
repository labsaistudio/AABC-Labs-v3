export const qvacRuntimePolicy = {
  runtime: 'qvac',
  apiSurface: 'openai_compatible_local_http',
  defaultBaseUrl: 'http://localhost:11434/v1',
  capabilities: [
    'qvac-local-inference',
    'qvac-openai-compatible-http',
    'qvac-p2p-runtime',
    'qvac-local-rag',
  ],
  boundary: {
    remoteProviderKey: 'not_required_for_local_runtime',
    modelWeights: 'not_in_public_repository',
    privatePrompts: 'stay_in_local_or_p2p_runtime',
    productionWiring: 'outside_public_reference_runtime',
  },
  proof: {
    requiredArtifacts: [
      'qvac_runtime_plan',
      'openapi_spec',
      'source_package_manifest',
    ],
  },
};

export function buildQvacChatCompletionRequest({ model, messages }) {
  return {
    url: `${qvacRuntimePolicy.defaultBaseUrl}/chat/completions`,
    method: 'POST',
    body: { model, messages, stream: false },
  };
}
