import test from 'node:test';
import assert from 'node:assert/strict';
import { createProofLedger } from '../packages/proof/src/proof-ledger.mjs';
import { verifyProofFeed } from '../packages/proof/src/verifier.mjs';

test('public proof feed redacts forbidden fields', () => {
  const ledger = createProofLedger({ runId: 'run-1', workflowId: 'wf-1' });
  ledger.recordArtifact({
    type: 'debug',
    title: 'Debug artifact',
    data: { private_key: 'do-not-leak' },
    public: true,
  });
  const feed = ledger.publicFeed();
  assert.equal(feed.artifacts[0].data.private_key, '[redacted]');
  assert.equal(verifyProofFeed(feed).ok, true);
});
