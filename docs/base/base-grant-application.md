# Base Grant Application Draft

## Project

AABC Labs v3 includes a Base onchain agent layer for paid service calls, paid
endpoint creation, and proof recording.

The first product package is AABC Base Agent Fund Pack. It shows one agent flow:

1. discover an x402 paid resource,
2. prepare the paid request,
3. create an x402 paid endpoint,
4. generate a reviewable proof package,
5. prepare a Base proof transaction.

## Why Base

Base is the right first ecosystem for this package because it combines agent
payments, Base Account onboarding, Paymaster sponsorship, low-cost execution,
and a public funding path for shipped builders.

## What Is New

AABC is not a blank chat surface. The system turns an agent request into a
workflow with payment evidence, source delivery, proof artifacts, and reviewer
checks.

## Public Good Angle

The reusable public layer helps other builders understand how to package
agent-side x402 payments, paid endpoint discovery, and proof recording into one
reviewable Base workflow.

## Current Evidence

- Private GitHub repository created for review.
- Base-only test suite.
- x402 buyer scaffold.
- agent-side x402 payer client.
- x402 seller scaffold.
- Base proof registry contract.
- Base mainnet proof registry deployment.
- Base mainnet proof record transaction.
- Hosted proof page.
- Hosted x402 endpoint URL.
- Live x402 endpoint returns a Base payment requirement through CDP.
- Submission readiness report.

## Missing Live Evidence

The readiness report currently marks these items as placeholders:

- live demo URL

Those should be replaced before a final submission.

The Base proof page and x402 endpoint are already listed in the submission pack.
The final demo video is the remaining reviewer artifact.

## Milestones

1. Base mainnet proof transaction and hosted proof page.
2. Hosted x402 paid endpoint with service discovery.
3. Base Account and Paymaster policy test.
4. Public build log and demo video.
5. Builder Rewards submission.
6. Builder Grants submission after live evidence is available.
