export const settlementIntent = {
  protocol: 'x402-solana-usdc',
  currency: 'USDC',
  chain: 'solana',
  preparedOnly: true,
};

export function buildPaymentRequirement(amountUsd) {
  return {
    ...settlementIntent,
    amountUsd,
    walletConnectivity: 'reown-wallet-connectivity',
  };
}
