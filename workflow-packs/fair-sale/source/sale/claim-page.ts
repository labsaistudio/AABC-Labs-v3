export const claimPage = {
  vestingDays: 30,
  tgeUnlockPercent: 20,
  walletConnectors: ['phantom-wallet-adapter', 'solflare-wallet-adapter', 'reown-wallet-connectivity'],
};

export function claimWindow(now, config) {
  return {
    open: now >= config.opensAt && now <= config.closesAt,
    opensAt: config.opensAt,
    closesAt: config.closesAt,
  };
}
