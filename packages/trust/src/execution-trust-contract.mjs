export const TRUST_BOUNDARY_LAYERS = Object.freeze([
  'execution_visibility',
  'protocol_access',
  'credential_isolation',
  'proof_handoff',
]);

export function buildExecutionTraceContract({ workflowId, steps }) {
  if (!workflowId) throw new Error('workflow_id_required');
  if (!Array.isArray(steps) || steps.length === 0) throw new Error('trace_steps_required');
  return {
    workflowId,
    stages: [
      stage('intent_received', 'user intent captured'),
      stage('context_reviewed', 'protocol and route context reviewed'),
      stage('policy_checked', 'risk class and signer mode evaluated'),
      ...steps.map((step) => stage(`step:${step.key}`, step.intent)),
      stage('proof_exported', 'proof feed and source package exported'),
    ],
  };
}

export function buildCredentialBoundary({ userId, ownerUserId, capabilityId, accessReady }) {
  if (!userId || !ownerUserId || !capabilityId) throw new Error('credential_boundary_shape_invalid');
  const ownerMatched = userId === ownerUserId;
  return {
    capabilityId,
    publicAvailability: 'visible',
    privateAccessReady: ownerMatched && accessReady === true,
    credentialScope: ownerMatched ? 'user_scoped' : 'blocked_cross_account',
  };
}

export function buildProtocolAccessContract({ capabilityId, accessMode, proofRequired }) {
  if (!capabilityId || !accessMode) throw new Error('protocol_access_shape_invalid');
  return {
    capabilityId,
    accessMode,
    proofRequired: proofRequired === true,
    resultBoundary: 'record_artifact_before_user_visible_completion',
  };
}

export function assertTrustBoundary(contract) {
  if (!TRUST_BOUNDARY_LAYERS.every((layer) => contract.layers?.includes(layer))) {
    throw new Error('trust_boundary_layers_incomplete');
  }
  if (contract.credential?.privateAccessReady && contract.credential.credentialScope !== 'user_scoped') {
    throw new Error('credential_scope_mismatch');
  }
  return true;
}

function stage(key, label) {
  return { key, label, observable: true };
}
