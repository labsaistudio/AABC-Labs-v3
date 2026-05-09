export function stepEvent({ runId, workflowId, step, status, data = {} }) {
  return {
    type: 'step',
    runId,
    workflowId,
    stepKey: step.key,
    status,
    riskClass: step.riskClass,
    signerMode: step.signerMode,
    operationType: step.operationType,
    data,
    timestamp: new Date().toISOString(),
  };
}
