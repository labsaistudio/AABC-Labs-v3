# Solana Ecosystem Surface

AABC Labs v3 declares a public Solana capability surface so workflow packs can
show which ecosystem pieces a run depends on without exposing private runtime
implementation.

The reference runtime keeps these integrations as typed capability contracts.
Live SDK imports, provider credentials, transaction broadcasting, and production
routing are outside this repository.

## Capability Registry

The canonical registry lives in
`packages/integrations/src/solana-capabilities.mjs`.

It covers:

- SendAI Solana Agent Kit ecosystem
- Solana Web3.js
- SPL Token tooling
- Phantom wallet adapter
- Solflare wallet adapter
- Reown wallet connectivity
- Blinks and Solana Actions
- Jupiter route and quote skills
- Raydium liquidity skills
- Metaplex asset skills
- Helius indexing and webhook skills
- Squads multisig skills
- x402 payment flows with Solana USDC

## Public Boundary

Each capability is marked as `external_runtime`. The public runner can declare,
validate, and prove that a workflow uses the capability surface, but it does not
ship live provider wiring or transaction broadcast code.

## Workflow Usage

Workflow packs reference capability IDs under `ecosystem.capabilities`. Tests
ensure every pack uses registered IDs and that the full public Solana stack is
covered by the example set.
