export function preparedTx({ stepKey, operationType, signerMode, chain = 'solana', network = 'testnet' }) {
  return {
    stepKey,
    operationType,
    signerMode,
    chain,
    network,
    status: 'prepared',
    broadcasted: false,
    confirmed: false,
    txHash: null,
  };
}
