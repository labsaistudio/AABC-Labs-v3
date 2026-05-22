export const BASE_NETWORKS = Object.freeze({
  mainnet: Object.freeze({
    name: 'base-mainnet',
    chainId: 8453,
    caip2: 'eip155:8453',
    rpcUrl: 'https://mainnet.base.org',
    explorerBaseUrl: 'https://basescan.org',
  }),
  sepolia: Object.freeze({
    name: 'base-sepolia',
    chainId: 84532,
    caip2: 'eip155:84532',
    rpcUrl: 'https://sepolia.base.org',
    explorerBaseUrl: 'https://sepolia.basescan.org',
  }),
});

export function getBaseNetwork(chainId) {
  const match = Object.values(BASE_NETWORKS).find((item) => item.chainId === chainId);
  if (!match) throw new Error(`unsupported_base_chain:${chainId}`);
  return match;
}
