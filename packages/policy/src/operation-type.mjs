export const OperationType = Object.freeze({
  READ_STATE: 'read_state',
  GENERATE_SOURCE: 'generate_source',
  PREPARE_DEPLOY: 'prepare_deploy',
  PREPARE_TRANSFER: 'prepare_transfer',
  MONITOR_SETUP: 'monitor_setup',
  ENDPOINT_BUILD: 'endpoint_build',
  LP_LOCK: 'lp_lock',
  REVOKE_AUTHORITY: 'revoke_authority',
  PRESALE_FINALIZE: 'presale_finalize',
});

export const VALUE_SENSITIVE_OPS = new Set([
  OperationType.PREPARE_TRANSFER,
  OperationType.LP_LOCK,
  OperationType.PRESALE_FINALIZE,
]);

export function isOperationType(value) {
  return Object.values(OperationType).includes(value);
}
