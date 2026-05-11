export function buildRecipients(rows) {
  return rows.map((row, index) => ({
    index,
    wallet: row.wallet,
    tier: row.tier,
    allocationUnits: Number(row.allocationUnits),
  }));
}

export const recipientRules = {
  requireUniqueWallets: true,
  requireNonZeroAllocation: true,
};
