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

## Session Key Mode

Session key mode is the public contract for temporary Solana session-wallet
authorization. A workflow step must name the operation scope, value ceiling,
time window, revocation path, and required proof artifacts before it can appear
as session-key work.

The public contract never contains signing material. It records only the
authorization boundary that reviewers can audit: which operation was allowed,
which policy gate applied, which source package was delivered, and which proof
records must exist before the work can be treated as complete.
