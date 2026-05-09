# Reviewer Walkthrough

This guide shows the review path for AABC Labs v3.

## 1. Inspect The Architecture

Start with `docs/architecture.md`, then inspect the package boundaries:

- `packages/core` validates and runs workflow contracts.
- `packages/policy` gates signer modes, risk classes, and value-sensitive
  operations.
- `packages/proof` exports redacted public proof feeds.
- `packages/integrations` declares the Solana capability surface.

## 2. Run The Proof Path

```bash
npm install
npm test
npm run demo
npm run verify
npm run export-proof
node cli/src/index.mjs replay .outcome/runs/token-program
```

Expected output:

- `.outcome/runs/token-program/events.jsonl`
- `.outcome/runs/token-program/proof.json`
- `.outcome/runs/token-program/proof.html`
- `.outcome/runs/token-program/source-package/`

## 3. Check The Source Package

Open `.outcome/runs/token-program/source-package/`. It should contain real
reviewable files copied from `workflow-packs/token-program/source/`, not only a
final text summary.

## 4. Check Solana Capability Proof

Open the generated `proof.json` and find `solana_capability_plan`. It should
list public capability contracts for the workflow, including the chain,
capability IDs, execution boundary, and review signals.

## 5. Inspect Committed Examples

The `examples/runs/` directory contains curated generated runs. These examples
are committed so reviewers can inspect proof output before running the CLI.

## 6. Open The Studio

```bash
npm run studio
```

Then open `http://localhost:4173`. The Studio lists all eight workflow packs,
their step counts, source file counts, and Solana capability coverage.

## 7. Verify The Public Boundary

```bash
npm run scan
```

The scan checks for public-boundary risks such as CJK text, upstream project
markers, and credential markers. Intentional redaction metadata files are
handled by exact allowances.
