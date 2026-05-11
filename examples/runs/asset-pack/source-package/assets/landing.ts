export const landing = {
  generated: true,
  walletAdapters: ['phantom-wallet-adapter', 'solflare-wallet-adapter'],
  actionSurface: 'blinks-solana-actions',
};

export function buildAssetPage(asset) {
  return {
    title: asset.name,
    cta: 'Review proof package',
    requiresWalletConnection: false,
  };
}
