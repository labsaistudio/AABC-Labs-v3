# Base Fund Roadmap

## Goal

AABC Labs is built to pursue Base support through shipped evidence, not a
generic concept pitch. The public target is:

```text
Onchain agent execution, payments, and proof on Base.
```

## Funding Path

1. Weekly Rewards: publish a working Base demo and build updates.
2. Builder Grants: submit the shipped workflow with proof and a short demo.
3. OP Retro Funding: open the reusable proof and x402 endpoint layer.
4. Base Batches: apply later with usage, feedback, and stronger proof.

## Evidence Needed

- Base mainnet proof transaction.
- x402 pay-for-service demo.
- x402 paid endpoint demo.
- Source package for the generated endpoint.
- Reviewable proof record.
- Short product demo video.

## Submission Pack

`npm run base:submission` writes `examples/base/base-submission-pack.json`. That file is
the checklist AABC should keep updated with live links before applying:

- repository
- demo
- x402 endpoint
- proof page
- explorer transaction

Placeholder links are marked as `placeholder`. The current pack has repository,
x402 endpoint, proof page, and explorer evidence ready; the demo link remains
the final item to replace.

Run `npm run base:readiness` to generate `examples/base/base-readiness-report.json`.

## Why This Fits Base

Base wants more useful apps and more builders operating onchain. AABC Labs turns
agent tasks into a Base-native path: request, payment, endpoint, source package,
and proof. It also creates a clear reason for Paymaster and Base Account usage:
remove friction when users approve agent work.

## Paymaster Route

`scaffolds/base-account-paymaster/policy.json` defines the first gas sponsorship
policy. It is deliberately narrow: only proof recording is sponsored, and every
run still requires review.
