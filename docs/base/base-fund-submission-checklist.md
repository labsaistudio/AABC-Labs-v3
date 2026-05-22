# Base Fund Submission Checklist

This file is the reviewer-facing submission map for the AABC Labs Base layer. It keeps the
Base Fund story focused on shipped evidence instead of private product internals.

## Core Claim

AABC Labs turns an agent request into a Base-native workflow:

1. The agent discovers a paid x402 resource.
2. The agent prepares a paid request plan.
3. The agent creates a paid endpoint package.
4. The run leaves a proof record that can be reviewed later.
5. The evidence is mapped into Base funding paths.

## Evidence Links

| Evidence | Status | Link |
| --- | --- | --- |
| Review repository | Ready | `https://github.com/labsaistudio/AABC-Labs-v3` |
| Base proof registry | Ready | `https://basescan.org/address/0x5b92c87b8a366a7d4052fd4755c50e00bba6a525` |
| Base proof transaction | Ready | `https://basescan.org/tx/0x5a5d5c145982574d98d9cb98bf407bb6e0dab501b626d917ff2eabf7a89b4321` |
| Hosted evidence page | Ready | `https://app.aabc.app/base-fund` |
| x402 paid endpoint | Ready | `https://app.aabc.app/api/base-agent-report` |
| Agent-side x402 payer | Live payment verified | `src/x402/agent-payer.mjs` |
| Demo video | Pending | Replace the placeholder before final submission |

## Official Base Alignment

- Base x402 pay-for-service model
- Base x402 accepting-payments model
- CDP facilitator for Base mainnet settlement
- public x402 facilitator for Base Sepolia testing
- Agentic Wallet skill path for buyer-side payment planning
- Base Account and Paymaster surfaces for onboarding and sponsored calls

## Reviewer Walkthrough

Run:

```bash
npm test
npm run base:demo
npm run base:verify
npm run base:submission
npm run base:readiness
npm run base:pay-report
```

Then inspect:

- `examples/base/base-agent-fund-pack.proof.json`
- `examples/base/base-agent-fund-pack.proof.html`
- `examples/base/base-submission-pack.json`
- `examples/base/base-readiness-report.json`
- `src/x402/resource-plan.mjs`
- `src/x402/agent-payer.mjs`
- `examples/base/base-agent-payment-result.json`
- `contracts/BaseWorkflowProofRegistry.sol`

## Submission Readiness

Ready now:

- Repository evidence
- Base mainnet proof registry
- Base mainnet proof transaction
- Hosted evidence page
- CDP-aligned x402 endpoint implementation
- Agent-side x402 payer implementation
- Live x402 payment result

Still needed:

- Record or attach the final Base demo video.

## Boundary

This review repository excludes production credentials, private prompts,
customer data, and private deployment routing. The review layer is designed to
show the Base execution pattern without exposing commercial internals.
