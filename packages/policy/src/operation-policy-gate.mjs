import { SignerMode, isSignerMode } from './signer-mode.mjs';
import { ToolRiskClass } from './tool-risk-class.mjs';
import { OperationType, VALUE_SENSITIVE_OPS, isOperationType } from './operation-type.mjs';

export const IRREVERSIBLE_MAINNET_OPS = new Set([
  OperationType.LP_LOCK,
  OperationType.REVOKE_AUTHORITY,
  OperationType.PRESALE_FINALIZE,
]);

export const SESSION_MAINNET_ALLOWED_OPS = new Set([
  OperationType.READ_STATE,
  OperationType.GENERATE_SOURCE,
  OperationType.MONITOR_SETUP,
  OperationType.ENDPOINT_BUILD,
  OperationType.PREPARE_TRANSFER,
]);

export const VALUE_LIMITS_USD = Object.freeze({
  [OperationType.PREPARE_TRANSFER]: 200,
});

export function evaluatePolicy(step) {
  const signerMode = step.signerMode || SignerMode.PREPARE_ONLY;
  const operationType = step.operationType;
  const riskClass = step.riskClass;
  const isMainnet = step.network === 'mainnet';
  const valueUsd = step.estimatedValueUsd;

  if (!isSignerMode(signerMode)) {
    return deny('invalid_signer_mode');
  }
  if (!isOperationType(operationType)) {
    return deny('invalid_operation_type');
  }
  if (signerMode === SignerMode.SERVER_TREASURY) {
    return deny('server_treasury_not_enabled');
  }
  if (signerMode !== SignerMode.SESSION_WALLET) {
    return allow();
  }
  if (!isMainnet) {
    return allow();
  }
  if (riskClass === ToolRiskClass.IRREVERSIBLE || IRREVERSIBLE_MAINNET_OPS.has(operationType)) {
    return deny('irreversible_session_mainnet_blocked');
  }
  if (!SESSION_MAINNET_ALLOWED_OPS.has(operationType)) {
    return deny('session_mainnet_not_allowlisted');
  }
  if (VALUE_SENSITIVE_OPS.has(operationType) && valueUsd === undefined) {
    return deny('unknown_value_session_mainnet_blocked');
  }
  const limit = VALUE_LIMITS_USD[operationType];
  if (limit !== undefined && Number(valueUsd || 0) > limit) {
    return deny('value_limit_exceeded');
  }
  return allow();
}

function allow() {
  return { allowed: true, reason: 'allowed' };
}

function deny(reason) {
  return { allowed: false, reason };
}
