import { PHASE_C_CAPABILITIES } from '../../../packages/phase-c/src/phase-c-capabilities.mjs';
import { buildPhaseCMatrix } from '../../../packages/phase-c/src/phase-c-gates.mjs';
import { TRUST_BOUNDARY_LAYERS } from '../../../packages/trust/src/execution-trust-contract.mjs';
import { SOLANA_CAPABILITIES } from '../../../packages/integrations/src/solana-capabilities.mjs';

export async function architectureCommand() {
  const signalsByCapability = Object.fromEntries(PHASE_C_CAPABILITIES.map((item) => [item.id, []]));
  console.log(JSON.stringify({
    runtime: 'aabc-labs-v3',
    layers: ['core', 'policy', 'proof', 'integrations', 'trust', 'phase-c'],
    trustBoundaryLayers: TRUST_BOUNDARY_LAYERS,
    solanaCapabilities: SOLANA_CAPABILITIES.map((item) => item.id),
    phaseC: buildPhaseCMatrix({ signalsByCapability }),
  }, null, 2));
}
