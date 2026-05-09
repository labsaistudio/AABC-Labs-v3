# Workflow Contracts

A workflow contract declares:

- `id`
- `title`
- `summary`
- `ecosystem`
- `steps`
- `sourcePackage`

Each step declares:

- `key`
- `intent`
- `action`
- `riskClass`
- `signerMode`
- `operationType`
- `network`
- `expectedArtifacts`

The `ecosystem` block declares `chain` and registered capability IDs. For the
Solana packs, those IDs must exist in the Solana capability registry.

The runner refuses invalid contracts before execution.
