# AABC Labs v3

Proof-first agent workflows for Web3 operations.

AABC Labs v3 turns agent tasks into typed workflow contracts, policy-checked
steps, replayable event logs, source package manifests, and verifiable proof
artifacts.

## Why This Exists

Agent-led Web3 workflows need more than a chat transcript. They need a record
of what was requested, which steps were allowed, which actions were blocked,
which artifacts were generated, and which source files a user can inspect.

AABC Labs v3 provides that public architecture as a small local runtime.

## What You Can Run

```bash
npm install
npm test
npm run demo
npm run verify
npm run export-proof
npm run studio
```

The demo writes a local run under `.outcome/runs/token-program` with:

- `events.jsonl`
- `proof.json`
- `proof.html`
- `source-package/`

## Core Ideas

- Outcome contracts define the expected workflow, steps, risk classes, signer
  modes, artifacts, and source package files.
- The policy engine blocks irreversible or high-value actions when the signer
  mode is not allowed.
- The proof ledger records prepared transactions, generated artifacts, and
  redacted public feeds.
- The runner emits an event log that can be replayed.
- The source package manifest ensures a workflow delivers reviewable files,
  not only a final summary.
- Solana integrations are represented as public capability contracts before
  private runtime wiring.

## Solana Ecosystem Surface

AABC Labs v3 includes a typed Solana capability registry for SendAI Solana
Agent Kit, Solana Web3.js, SPL Token tooling, Phantom, Solflare, Reown, Blinks,
Solana Actions, Jupiter, Raydium, Metaplex, Helius, Squads, and x402 Solana
USDC payment flows.

See `docs/solana-ecosystem.md` for the public boundary.

## Workflow Packs

This repository includes sanitized workflow packs for common Web3 operations:

- Token program
- Launch operations
- Fair sale
- Trust operations
- Distribution
- Market monitor
- Asset pack
- Paid endpoint

They are examples of the architecture, not the project boundary.

## Security and Scope

This repository is a clean public implementation of the AABC Labs v3 workflow
architecture. It excludes private deployment credentials and production-specific
infrastructure.
