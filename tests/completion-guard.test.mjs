import test from 'node:test';
import assert from 'node:assert/strict';
import { assertWorkflowComplete } from '../packages/core/src/validation/completion-guard.mjs';

test('completion guard rejects missing artifacts', () => {
  const workflow = {
    sourcePackage: { files: [{ path: 'a.ts' }] },
    steps: [{
      key: 'step-1',
      expectedArtifacts: ['required_artifact'],
    }],
  };
  assert.throws(() => assertWorkflowComplete({
    workflow,
    feed: { artifacts: [] },
    events: [{ type: 'step', stepKey: 'step-1', status: 'completed' }],
  }));
});
