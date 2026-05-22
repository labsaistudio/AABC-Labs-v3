export function buildX402ResourcePlan() {
  return {
    product: 'AABC Base Agent Fund Pack',
    networks: {
      testnet: 'eip155:84532',
      mainnet: 'eip155:8453',
    },
    officialPackages: [
      'x402-express',
      '@x402/express',
      '@x402/next',
      '@x402/fetch',
      '@x402/core',
      '@x402/evm',
    ],
    agenticWalletCommands: [
      'npx skills add coinbase/agentic-wallet-skills',
      'npx create-x402-app@latest',
      'npm create onchain-agent@latest',
    ],
    facilitators: {
      publicTestnet: 'https://www.x402.org/facilitator',
      hostedMainnet: 'https://api.cdp.coinbase.com/platform/v2/x402',
    },
    flows: [
      {
        id: 'agent-pays-service',
        role: 'buyer',
        evidence: ['payment requirement', 'X-PAYMENT request plan', 'proof record'],
      },
      {
        id: 'agent-creates-paid-endpoint',
        role: 'seller',
        evidence: ['endpoint source package', 'pricing rule', 'discovery document'],
      },
    ],
  };
}
