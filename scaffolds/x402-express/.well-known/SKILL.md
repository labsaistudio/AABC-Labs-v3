# AABC Base Agent Report

This paid service exposes a Base-ready agent report endpoint.

## Endpoint

- Method: `GET`
- Path: `/api/base-agent-report`
- Network: `eip155:8453`
- Price: `$0.01`

## Agent Flow

1. Request `/api/base-agent-report`.
2. Read the x402 payment requirement.
3. Pay through the approved Base x402 wallet path.
4. Store the response in the workflow proof package.
