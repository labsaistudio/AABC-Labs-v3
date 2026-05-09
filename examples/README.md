# Examples

This directory contains generated reference runs.

Each run includes:

- `events.jsonl`
- `proof.json`
- `proof.html`
- `source-package/`

The examples are committed so reviewers can inspect the proof and source
delivery shape before running the CLI locally.

To regenerate a run:

```bash
node cli/src/index.mjs run workflow-packs/token-program/workflow.json --out examples/runs/token-program
```
