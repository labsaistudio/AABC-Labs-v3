import { evaluatePolicy } from '../../policy/src/operation-policy-gate.mjs';
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
  return referenceAdapter({ step, workflow });
}
