import { OperationType, isOperationType } from '../../policy/src/operation-type.mjs';
import { SignerMode } from '../../policy/src/signer-mode.mjs';

const PUBLIC_TTL_LIMIT_MINUTES = 60;
const PUBLIC_SPEND_LIMIT_USD = 200;
const IRREVERSIBLE_OPS = new Set([
  OperationType.LP_LOCK,
  OperationType.REVOKE_AUTHORITY,
  OperationType.PRESALE_FINALIZE,
]);

export function buildSessionKeyModeContract({
  workflowId,
  chain = 'solana',
  signerMode = SignerMode.SESSION_WALLET,
  allowedOperations,
  maxSpendUsd = 0,
  validForMinutes = PUBLIC_TTL_LIMIT_MINUTES,
  proofArtifacts = [],
}) {
  if (!workflowId) throw new Error('session_key_workflow_required');
  if (chain !== 'solana') throw new Error('session_key_chain_must_be_solana');
  if (signerMode !== SignerMode.SESSION_WALLET) throw new Error('session_key_signer_mode_required');
  if (!Array.isArray(allowedOperations) || allowedOperations.length === 0) {
    throw new Error('session_key_operations_required');
  }
  if (!allowedOperations.every(isOperationType)) {
    throw new Error('session_key_operation_type_invalid');
  }
  if (allowedOperations.some((op) => IRREVERSIBLE_OPS.has(op))) {
    throw new Error('session_key_irreversible_scope_blocked');
  }
  if (validForMinutes > PUBLIC_TTL_LIMIT_MINUTES) {
    throw new Error('session_key_ttl_exceeds_public_contract');
  }
  if (maxSpendUsd > PUBLIC_SPEND_LIMIT_USD) {
    throw new Error('session_key_value_limit_exceeded');
  }
  return {
    workflowId,
    chain,
    signerMode,
    scope: {
      allowedOperations,
      maxSpendUsd,
      validForMinutes,
      revocation: 'owner_can_revoke',
    },
    safety: {
      signingMaterial: 'not_in_public_contract',
      broadcasting: 'policy_checked_before_execution',
      requiredProof: [
        'policy_gate_decision',
        'session_key_mode_contract',
        'source_package_manifest',
      ],
      proofArtifacts,
    },
  };
}

export function assertSessionKeyModeContract(contract) {
  if (contract?.safety?.signingMaterial !== 'not_in_public_contract') {
    throw new Error('session_key_public_material_boundary_invalid');
  }
  if (!contract.scope?.allowedOperations?.length) {
    throw new Error('session_key_scope_missing');
  }
  if (!contract.safety.requiredProof.includes('policy_gate_decision')) {
    throw new Error('session_key_policy_proof_required');
  }
  return true;
}

export function buildSessionKeyModeArtifact({
  workflowId,
  stepKey,
  allowedOperations,
  maxSpendUsd = 0,
  validForMinutes = PUBLIC_TTL_LIMIT_MINUTES,
  proofArtifacts = [],
}) {
  const contract = buildSessionKeyModeContract({
    workflowId,
    allowedOperations,
    maxSpendUsd,
    validForMinutes,
    proofArtifacts,
  });
  return {
    type: 'session_key_mode_contract',
    title: `Session key mode contract for ${stepKey}`,
    path: `artifacts/${stepKey}-session-key-mode.json`,
    data: { stepKey, ...contract, signingMaterial: contract.safety.signingMaterial },
    public: true,
  };
}
