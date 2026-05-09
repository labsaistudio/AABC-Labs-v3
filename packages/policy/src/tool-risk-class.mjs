export const ToolRiskClass = Object.freeze({
  READ_ONLY: 'read_only',
  GENERATE_ARTIFACT: 'generate_artifact',
  PREPARE_TX: 'prepare_tx',
  EXECUTE_CAPABLE: 'execute_capable',
  IRREVERSIBLE: 'irreversible',
});

export function isToolRiskClass(value) {
  return Object.values(ToolRiskClass).includes(value);
}
