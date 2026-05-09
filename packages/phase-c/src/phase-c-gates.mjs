import { PHASE_C_CAPABILITIES } from './phase-c-capabilities.mjs';

export function evaluatePhaseCReadiness({ capabilityId, signals }) {
  if (!Array.isArray(signals)) throw new Error('phase_c_signals_required');
  const capability = PHASE_C_CAPABILITIES.find((item) => item.id === capabilityId);
  if (!capability) throw new Error(`unknown_phase_c_capability:${capabilityId}`);
  const provided = new Set(signals);
  const missingSignals = capability.requiredSignals.filter((signal) => !provided.has(signal));
  return {
    capabilityId,
    phase: capability.phase,
    status: missingSignals.length ? 'blocked_until_signals_exist' : 'ready_for_design_review',
    missingSignals,
    contracts: capability.contracts,
    publicBoundary: capability.publicBoundary,
  };
}

export function buildPhaseCMatrix({ signalsByCapability }) {
  if (!signalsByCapability || typeof signalsByCapability !== 'object') {
    throw new Error('phase_c_signal_matrix_required');
  }
  return PHASE_C_CAPABILITIES.map((capability) => evaluatePhaseCReadiness({
    capabilityId: capability.id,
    signals: signalsByCapability[capability.id] || [],
  }));
}
