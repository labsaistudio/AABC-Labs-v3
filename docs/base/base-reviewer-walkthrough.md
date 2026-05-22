# Reviewer Walkthrough

## Quick Check

```bash
npm test
npm run base:demo
npm run base:verify
npm run base:server
```

## What To Look At

1. `src/base/capabilities.mjs` shows the Base-only capability surface.
2. `src/x402/resource-plan.mjs` shows the official x402 resource plan.
3. `src/workflow/base-agent-workflow.mjs` shows the agent route.
4. `contracts/BaseWorkflowProofRegistry.sol` shows the Base proof target.
5. `examples/base/base-agent-fund-pack.proof.json` shows the proof shape.
6. `examples/base/base-agent-fund-pack.proof.html` opens as a static proof page.
7. `scaffolds/x402-express` shows the paid endpoint starter.
8. `scaffolds/agentic-wallet` shows the official skill command path.

When the local demo server is running:

- `http://localhost:4174/proof`
- `http://localhost:4174/submission`
- `http://localhost:4174/readiness`
- `http://localhost:4174/.well-known/SKILL.md`

## What Is Excluded

This repository excludes production credentials, private prompts, user data, and
private deployment wiring. The purpose is to make the Base evidence path easy to
review without exposing commercial internals.
