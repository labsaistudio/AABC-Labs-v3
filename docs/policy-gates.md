# Policy Gates

The policy engine exists so agent workflows cannot silently cross risk
boundaries.

It evaluates:

- signer mode
- risk class
- operation type
- network
- value estimate

For example, irreversible mainnet operations are blocked under a session
wallet. Prepare-only steps can still generate plans and artifacts without
broadcasting.
