# AABC Labs v3

Proof-first agent workflows for Web3 operations.

AABC Labs v3 turns agent tasks into typed workflow contracts, policy-checked
steps, replayable event logs, source package manifests, and verifiable proof
artifacts.

It is built around a simple promise: an agent should not only say what it did.
It should leave behind a replayable run, a public proof feed, and source files
that a user can review.

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

Curated examples are committed under `examples/runs/` so reviewers can inspect
the generated proof shape without running anything first.

## End-to-End Flow

1. Pick a workflow pack, such as `workflow-packs/token-program/workflow.json`.
2. Validate the outcome contract, policy modes, Solana capability surface, and
   required source package files.
3. Run each step through reference adapters that prepare proof artifacts instead
   of broadcasting transactions.
4. Emit `events.jsonl`, `proof.json`, `proof.html`, and a reviewable
   `source-package/`.
5. Replay the event log to reconstruct the workflow state.

## Core Ideas

- Outcome contracts define the expected workflow, steps, risk classes, signer
  modes, artifacts, and source package files.
- The policy engine blocks irreversible or high-value actions when the signer
  mode is not allowed.
- The proof ledger records prepared transactions, generated artifacts, and
  redacted public feeds.
- Session key mode turns a temporary Solana session wallet into a scoped,
  revocable, proof-bound authorization contract.
- The runner emits an event log that can be replayed.
- The source package manifest ensures a workflow delivers reviewable files,
  not only a final summary.
- Solana integrations are represented as public capability contracts before
  private runtime wiring.
- QVAC is represented as a local-first AI runtime contract for private
  inference, OpenAI-compatible HTTP access, P2P execution, and local RAG.
- Frontier sponsor integrations are represented as public capability contracts
  for Torque MCP growth, Solana RPC infrastructure credits, and Palm USD
  settlement.
- Jupiter Developer Platform is represented as a routing and quote capability
  boundary for prepared launch operations.

## Solana Ecosystem Surface

AABC Labs v3 includes a typed Solana capability registry for SendAI Solana
Agent Kit, Solana Web3.js, SPL Token tooling, Phantom, Solflare, Reown, Blinks,
Solana Actions, Jupiter, Raydium, Metaplex, Helius, Squads, and x402 Solana
USDC payment flows.

It also includes a QVAC capability registry for local AI inference, an
OpenAI-compatible local HTTP API surface, P2P runtime coordination, and local
RAG boundaries. The public runtime declares and proves these boundaries without
bundling model weights or production QVAC wiring.

Frontier sponsor surfaces are modeled with the same public-safe boundary:
Torque MCP can attach to distribution and growth workflows, RPC infrastructure
credits can attach to live market monitoring workflows, and Palm USD can attach
to paid endpoint settlement workflows. The reference runtime records the
capability plan and source files without bundling production credentials or
live sponsor SDK wiring.

The Jupiter developer surface attaches to launch operations as a prepared-only
quote, price, token search, and swap-instruction planning layer. Production
credentials stay outside the public repository.

See `docs/solana-ecosystem.md` for the public boundary.

Each workflow run also emits a `solana_capability_plan` artifact so reviewers can
see which Solana capabilities are in scope for that workflow.

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

## What To Review

- `packages/core` for workflow validation, execution, event logs, replay, and
  source package delivery.
- `packages/policy` for signer modes, operation types, risk classes, and value
  gates.
- `packages/session` for the public session key mode contract used by
  session-wallet workflow steps.
- `packages/proof` for redaction, public proof feeds, transaction records, and
  static proof export.
- `packages/integrations` for the public Solana, QVAC, and Frontier sponsor
  capability contracts.
- `workflow-packs/*/source` for sanitized source packages that represent what a
  completed agent workflow should hand back to a user.
- `examples/runs` for generated proof output.

## Security and Scope

This repository is a clean public implementation of the AABC Labs v3 workflow
architecture. It excludes private deployment credentials and production-specific
infrastructure.
