export function replayEvents(events) {
  const state = {
    runId: events[0]?.runId,
    workflowId: events[0]?.workflowId,
    steps: {},
    artifacts: [],
    txRecords: [],
    status: 'created',
  };
  for (const event of events) {
    if (event.type === 'step') {
      state.steps[event.stepKey] = event.status;
      state.status = event.status === 'failed' ? 'failed' : state.status;
    }
    if (event.type === 'artifact') state.artifacts.push(event.data);
    if (event.type === 'tx') state.txRecords.push(event.data);
    if (event.type === 'workflow_completed') state.status = 'completed';
  }
  return state;
}
