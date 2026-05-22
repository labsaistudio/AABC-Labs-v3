# Official Base Stack

## x402 Buyer

The buyer path uses the Base x402 pay-for-service model. AABC treats the agent
as the buyer: it discovers the payment requirement, prepares the paid request,
and records the proof of what was requested.

Public surfaces:

- `@x402/fetch`
- `@x402/evm`
- Agentic Wallet skills
- public x402 facilitator for Base Sepolia
- CDP facilitator for Base mainnet

The buyer scaffold lives at `scaffolds/x402-buyer/client.ts`.
The runnable buyer client lives at `src/x402/agent-payer.mjs` and can be called
with `npm run base:pay-report`. The live result is recorded in
`examples/base/base-agent-payment-result.json`.

## x402 Seller

The seller path uses the Base accepting-payments model. AABC treats the agent as
the builder of a paid endpoint: it creates the route, price rule, discovery
document, and reviewable source package.

Public surfaces:

- `x402-express`
- `@x402/express`
- `@x402/next`
- `/.well-known/SKILL.md`

The reference discovery file lives at
`scaffolds/x402-express/.well-known/SKILL.md`.

## Wallet And Gas

Base Account and Paymaster are part of the public plan because users should not
need to think about every low-level step. The public repository only declares
the contracts and starter files. Production policies and keys stay outside this
repository.

The reference policy lives at
`scaffolds/base-account-paymaster/policy.json`.
