# Architecture

AABC Labs v3 is organized around proof-first workflow execution.

```text
Workflow Pack
  -> Outcome Contract
  -> Policy Engine
  -> Session Key Contract
  -> Workflow Runner
  -> Event Log
  -> Proof Ledger
  -> Source Package
  -> Static Proof Export
```

The runtime keeps the agent workflow auditable by separating planning,
policy checks, proof capture, and source delivery.

## Packages

- `workflow-core` validates contracts, runs steps, records events, and checks
  completion.
- `policy-engine` evaluates signer modes, risk classes, operation types, chain
  rules, and value thresholds.
- `session-key-mode` describes scoped Solana session-wallet authorization,
  revocation, proof requirements, and the public boundary for signing material.
- `proof-ledger` records transactions and artifacts, redacts public feeds, and
  exports proof pages.
- `adapters` provide safe reference integrations for local demos.
- `integrations` declares public Solana capability surfaces for wallet,
  protocol, payment, and indexing boundaries.

## Workflow Packs

Workflow packs are examples of how to describe a Web3 operation as a typed,
verifiable outcome contract. They are not hard-coded product boundaries.
