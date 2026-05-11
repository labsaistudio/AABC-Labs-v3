export const jupiterDeveloperPlatformPolicy = {
  sponsorSurface: 'jupiter-developer-platform',
  workflow: 'launch-operations',
  chain: 'solana',
  mode: 'prepared_only_reference_runtime',
  credentialBoundary: {
    runtime: 'external_runtime',
    productionCredential: 'configured_outside_public_repository',
    publicRepository: 'no_credential_material',
  },
  apiSurfaces: [
    'quote',
    'price',
    'token_search',
    'swap_instruction_build',
  ],
  executionBoundary: {
    quoteReads: 'allowed',
    swapConstruction: 'prepared_only',
    broadcast: 'disabled_in_reference_runtime',
  },
  proof: {
    requiredArtifacts: [
      'frontier_capability_plan',
      'route_plan',
      'source_package_manifest',
    ],
    reviewSignals: [
      'quote and route surface',
      'swap instruction preparation boundary',
      'credential boundary',
    ],
  },
};

export function buildJupiterRouteIntent(input) {
  assertJupiterRouteInput(input);
  return {
    sponsorSurface: jupiterDeveloperPlatformPolicy.sponsorSurface,
    chain: jupiterDeveloperPlatformPolicy.chain,
    inputMint: input.inputMint,
    outputMint: input.outputMint,
    amountAtomicUnits: input.amountAtomicUnits,
    maxSlippageBps: input.maxSlippageBps,
    preparedOnly: true,
    proofRequired: jupiterDeveloperPlatformPolicy.proof.requiredArtifacts,
  };
}

function assertJupiterRouteInput(input) {
  if (!input?.inputMint) throw new Error('input_mint_required');
  if (!input?.outputMint) throw new Error('output_mint_required');
  if (!Number.isInteger(input.amountAtomicUnits) || input.amountAtomicUnits <= 0) {
    throw new Error('positive_atomic_amount_required');
  }
  if (!Number.isInteger(input.maxSlippageBps) || input.maxSlippageBps > 300) {
    throw new Error('max_slippage_bps_invalid');
  }
  return true;
}
