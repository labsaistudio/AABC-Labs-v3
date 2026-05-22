# Base Account And Paymaster

AABC Labs uses Base Account and Paymaster as the onboarding layer for proof
recording.

## Why It Matters

The product goal is not to make users manage every low-level step. A user should
be able to approve an agent workflow, review the proof, and record it on Base
with clear limits.

## Public Policy

The reference policy lives at:

```text
scaffolds/base-account-paymaster/policy.json
```

It allows only `recordProof(bytes32)` for the proof registry path and sets a
small reviewable spend limit.

## Funding Relevance

This layer supports the Paymaster gas credits route in the Base roadmap. It
gives AABC a concrete reason to request gas support: reducing friction for
first-run proof recording.
