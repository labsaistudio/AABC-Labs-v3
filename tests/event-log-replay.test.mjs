import test from 'node:test';
import assert from 'node:assert/strict';
import { replayEvents } from '../packages/core/src/runner/replay.mjs';

test('event replay reconstructs completed workflow state', () => {
  const state = replayEvents([
    { type: 'workflow_started', runId: 'run-1', workflowId: 'wf-1' },
    { type: 'step', runId: 'run-1', workflowId: 'wf-1', stepKey: 'design', status: 'completed' },
    { type: 'artifact', data: { type: 'program_design' } },
    { type: 'workflow_completed', runId: 'run-1', workflowId: 'wf-1' },
  ]);
  assert.equal(state.status, 'completed');
  assert.equal(state.steps.design, 'completed');
  assert.equal(state.artifacts.length, 1);
});
