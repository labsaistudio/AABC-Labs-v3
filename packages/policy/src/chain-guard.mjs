export function assertUniformChain({ stepKey, chainIds, walletChainId }) {
  const unique = [...new Set(chainIds)];
  if (unique.length === 0) {
    throw new Error(`step:${stepKey}:empty_chain_plan`);
  }
  if (unique.length > 1) {
    throw new Error(`step:${stepKey}:mixed_chain_plan:${unique.join(',')}`);
  }
  if (walletChainId !== undefined && unique[0] !== walletChainId) {
    throw new Error(`step:${stepKey}:wallet_chain_mismatch`);
  }
  return true;
}
