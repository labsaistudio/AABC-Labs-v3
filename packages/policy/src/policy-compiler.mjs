import { evaluatePolicy } from './operation-policy-gate.mjs';

export function compilePolicy(workflow) {
  return {
    workflowId: workflow.id,
    evaluate(step) {
      return evaluatePolicy(step);
    },
  };
}
