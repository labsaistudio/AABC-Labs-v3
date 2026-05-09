# Verification

Run:

```bash
npm run demo
npm run verify
npm run export-proof
npm run scan
```

Verification checks:

- proof feed shape
- forbidden public fields
- required artifacts
- source package presence
- policy gate behavior through tests
- public boundary markers

The committed `examples/runs/` directory provides static proof samples for
review. Regenerating examples should produce the same artifact shape with new
run IDs.
