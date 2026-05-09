import { mockChainAdapter } from './mock-chain-adapter.mjs';
import { assetManifestAdapter } from './asset-manifest-adapter.mjs';
import { paidEndpointAdapter } from './paid-endpoint-adapter.mjs';
import { webPreviewAdapter } from './web-preview-adapter.mjs';

export async function referenceAdapter({ step, workflow }) {
  if (step.action === 'asset_manifest') return assetManifestAdapter({ step, workflow });
  if (step.action === 'paid_endpoint') return paidEndpointAdapter({ step, workflow });
  if (step.action === 'web_preview') return webPreviewAdapter({ step, workflow });
  return mockChainAdapter({ step, workflow });
}
