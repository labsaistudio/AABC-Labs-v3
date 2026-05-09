import { join, resolve } from 'node:path';
import { readEvents } from '../../../packages/core/src/runner/event-log.mjs';
import { replayEvents } from '../../../packages/core/src/runner/replay.mjs';

export async function replayCommand(args) {
  const runDir = resolve(args[0] || '.outcome/runs/latest');
  const events = await readEvents(join(runDir, 'events.jsonl'));
  console.log(JSON.stringify(replayEvents(events), null, 2));
}
