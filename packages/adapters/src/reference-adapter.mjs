import { mockChainAdapter } from './mock-chain-adapter.mjs';
import { assetManifestAdapter } from './asset-manifest-adapter.mjs';
import { paidEndpointAdapter } from './paid-endpoint-adapter.mjs';
import { webPreviewAdapter } from './web-preview-adapter.mjs';
import { buildSolanaCapabilityArtifact } from '../../integrations/src/solana-reference-adapters.mjs';
import { buildQvacRuntimeArtifact } from '../../integrations/src/qvac-reference-adapters.mjs';
import { buildFrontierCapabilityArtifact } from '../../integrations/src/frontier-reference-adapters.mjs';
import { SignerMode } from '../../policy/src/signer-mode.mjs';
import { buildSessionKeyModeArtifact } from '../../session/src/session-key-mode.mjs';

export async function referenceAdapter({ step, workflow }) {
  const result = await baseAdapter({ step, workflow });
  return {
    ...result,
    artifacts: [
      buildSolanaCapabilityArtifact({ step, workflow }),
      ...qvacArtifacts({ step, workflow }),
      ...frontierArtifacts({ step, workflow }),
      ...sessionKeyArtifacts({ step, workflow }),
      ...result.artifacts,
    ],
  };
}

function qvacArtifacts({ step, workflow }) {
  if (!workflow.ecosystem?.qvacCapabilities?.length) return [];
  if (step.qvacRuntime !== true) return [];
  return [buildQvacRuntimeArtifact({ step, workflow })];
}

function frontierArtifacts({ step, workflow }) {
  if (!workflow.ecosystem?.frontierCapabilities?.length) return [];
  if (step.frontierRuntime !== true) return [];
  return [buildFrontierCapabilityArtifact({ step, workflow })];
}

function sessionKeyArtifacts({ step, workflow }) {
  if (step.signerMode !== SignerMode.SESSION_WALLET) return [];
  return [buildSessionKeyModeArtifact({
    workflowId: workflow.id,
    stepKey: step.key,
    allowedOperations: [step.operationType],
    maxSpendUsd: step.estimatedValueUsd,
    proofArtifacts: step.expectedArtifacts,
  })];
}

async function baseAdapter({ step, workflow }) {
  if (step.action === 'asset_manifest') return assetManifestAdapter({ step, workflow });
  if (step.action === 'paid_endpoint') return paidEndpointAdapter({ step, workflow });
  if (step.action === 'web_preview') return webPreviewAdapter({ step, workflow });
  return mockChainAdapter({ step, workflow });
}
