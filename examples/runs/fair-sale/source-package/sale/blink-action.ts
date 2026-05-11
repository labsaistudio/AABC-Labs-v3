export function buildClaimAction({ recipient, allocation }) {
  return {
    type: 'solana-action',
    label: 'Claim allocation',
    recipient,
    amount: allocation.amount,
    preparedOnly: true,
  };
}

export const blinkMetadata = {
  protocol: 'blinks-solana-actions',
  requiresWalletApproval: true,
};
