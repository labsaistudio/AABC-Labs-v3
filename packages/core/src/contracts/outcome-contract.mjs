import { isToolRiskClass } from '../../../policy/src/tool-risk-class.mjs';
import { isSignerMode } from '../../../policy/src/signer-mode.mjs';
import { isOperationType } from '../../../policy/src/operation-type.mjs';

export function validateOutcomeContract(workflow) {
  const errors = [];
  if (!workflow || typeof workflow !== 'object') errors.push('workflow must be an object');
  if (!workflow.id) errors.push('workflow.id is required');
  if (!workflow.title) errors.push('workflow.title is required');
  if (workflow.ecosystem?.chain !== 'solana') {
    errors.push('workflow.ecosystem.chain must be solana');
  }
  if (!Array.isArray(workflow.ecosystem?.capabilities) || workflow.ecosystem.capabilities.length === 0) {
    errors.push('workflow.ecosystem.capabilities must be a non-empty array');
  }
  if (!Array.isArray(workflow.steps) || workflow.steps.length === 0) {
    errors.push('workflow.steps must be a non-empty array');
  }
  for (const step of workflow.steps || []) {
    validateStep(step, errors);
  }
  if (!workflow.sourcePackage?.files?.length) {
    errors.push('workflow.sourcePackage.files must declare reviewable files');
  }
  if (errors.length) {
    const error = new Error(`invalid_outcome_contract:${errors.join(';')}`);
    error.errors = errors;
    throw error;
  }
  return true;
}

function validateStep(step, errors) {
  if (!step.key) errors.push('step.key is required');
  if (!step.intent) errors.push(`step:${step.key || 'unknown'}:intent is required`);
  if (!isToolRiskClass(step.riskClass)) errors.push(`step:${step.key}:invalid riskClass`);
  if (!isSignerMode(step.signerMode)) errors.push(`step:${step.key}:invalid signerMode`);
  if (!isOperationType(step.operationType)) errors.push(`step:${step.key}:invalid operationType`);
  if (!Array.isArray(step.expectedArtifacts)) {
    errors.push(`step:${step.key}:expectedArtifacts must be an array`);
  }
}
