# Base Proof Registry

`contracts/BaseWorkflowProofRegistry.sol` is the minimal public contract for
recording a workflow proof hash on Base.

## Purpose

The contract gives the submission package a concrete explorer target. AABC can
publish a proof package, record its hash on Base Sepolia or Base mainnet, and
then place the explorer transaction in `examples/base/base-submission-pack.json`.

## Public Method

```solidity
function recordProof(bytes32 proofHash) external
```

The method rejects empty proof hashes and duplicate records.

## Transaction Plan

`src/proof/base-proof-transaction.mjs` prepares the transaction object:

- Base mainnet: chain id `8453`
- Base Sepolia: chain id `84532`
- method: `recordProof(bytes32)`
- explorer: BaseScan or Base Sepolia BaseScan

Run:

```bash
npm run base:proof-tx
```

The command writes `examples/base/base-proof-transaction.json`.

Broadcasting is intentionally outside this public reference layer until a
funded deployment wallet is selected.

When a funded Base deployment wallet is selected, run:

```bash
npm run deploy:proof-registry
```

Required environment variables:

- `DEPLOYER_SIGNER_HEX`
- `BASE_MAINNET_RPC_URL`

## Base Mainnet Deployment

- Registry: `https://basescan.org/address/0x5b92c87b8a366a7d4052fd4755c50e00bba6a525`
- Deployment transaction: `https://basescan.org/tx/0x31a943f5447ca56ae33130f542aa40dcd74a96c3bbc263834319ab5a5e8a895d`
- Proof record transaction: `https://basescan.org/tx/0x5a5d5c145982574d98d9cb98bf407bb6e0dab501b626d917ff2eabf7a89b4321`
