import { SOLANA_CAPABILITIES } from './solana-capabilities.mjs';

const SIGNALS = Object.freeze({
  'sendai-solana-agent-kit': ['agent tool dispatch', 'policy gate envelope'],
  'solana-web3js': ['prepared instruction set', 'cluster read model'],
  'spl-token-tooling': ['mint authority plan', 'token account checks'],
  'phantom-wallet-adapter': ['session wallet request', 'user approval boundary'],
  'solflare-wallet-adapter': ['session wallet request', 'user approval boundary'],
  'reown-wallet-connectivity': ['wallet session contract', 'chain scope binding'],
  'blinks-solana-actions': ['action manifest', 'shareable execution surface'],
  'jupiter-protocol': ['route quote model', 'slippage envelope'],
  'raydium-protocol': ['pool state read', 'liquidity guardrail'],
  'metaplex-protocol': ['metadata manifest', 'asset authority plan'],
  'helius-protocol': ['indexing read', 'webhook event surface'],
  'squads-protocol': ['multisig review step', 'approval threshold'],
  'x402-solana-usdc': ['payment requirement', 'USDC settlement intent'],
});

export function buildSolanaCapabilityArtifact({ workflow, step }) {
  if (workflow.ecosystem.chain !== 'solana') {
    throw new Error(`unsupported_ecosystem_chain:${workflow.ecosystem.chain}`);
  }
  return {
    type: 'solana_capability_plan',
    title: `Solana capability plan for ${step.key}`,
    path: `artifacts/${step.key}-solana-capabilities.json`,
    data: {
      chain: workflow.ecosystem.chain,
      stepKey: step.key,
      action: step.action,
      capabilities: workflow.ecosystem.capabilities.map(capabilitySummary),
    },
    public: true,
  };
}

export function capabilitySummary(id) {
  const capability = SOLANA_CAPABILITIES.find((item) => item.id === id);
  if (!capability) throw new Error(`unknown_solana_capability:${id}`);
  return {
    id,
    layer: capability.layer,
    label: capability.label,
    execution: capability.execution,
    broadcasting: capability.broadcasting,
    reviewSignals: SIGNALS[id],
  };
}
