import { evaluatePolicy } from '../../policy/src/operation-policy-gate.mjs';
import { SignerMode } from '../../policy/src/signer-mode.mjs';
import { referenceAdapter } from './reference-adapter.mjs';

export async function policyCheckedAdapter({ step, workflow }) {
  const decision = evaluatePolicy(step);
  if (!decision.allowed) {
    return {
      blocked: true,
      reason: decision.reason,
      artifacts: [{
        type: 'policy_gate',
        title: `Policy gate blocked ${step.key}`,
        path: `artifacts/${step.key}-policy-gate.json`,
        data: decision,
        public: true,
      }],
    };
  }
  const result = await referenceAdapter({ step, workflow });
  if (step.signerMode !== SignerMode.SESSION_WALLET) return result;
  return {
    ...result,
    artifacts: [
      policyGateDecisionArtifact({ step, decision }),
      ...result.artifacts,
    ],
  };
}

function policyGateDecisionArtifact({ step, decision }) {
  return {
    type: 'policy_gate_decision',
    title: `Policy gate decision for ${step.key}`,
    path: `artifacts/${step.key}-policy-gate-decision.json`,
    data: {
      stepKey: step.key,
      allowed: decision.allowed,
      reason: decision.reason,
      signerMode: step.signerMode,
      operationType: step.operationType,
      network: step.network,
    },
    public: true,
  };
}
