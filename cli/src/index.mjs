#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runCommand } from './commands/run.mjs';
import { verifyCommand } from './commands/verify.mjs';
import { exportProofCommand } from './commands/export-proof.mjs';
import { replayCommand } from './commands/replay.mjs';
import { scanCommand } from './commands/scan.mjs';
import { architectureCommand } from './commands/architecture.mjs';

const [command, ...args] = process.argv.slice(2);

try {
  if (command === 'run') await runCommand(args);
  else if (command === 'verify') await verifyCommand(args);
  else if (command === 'export-proof') await exportProofCommand(args);
  else if (command === 'replay') await replayCommand(args);
  else if (command === 'scan') await scanCommand(args);
  else if (command === 'architecture') await architectureCommand(args);
  else {
    const pkg = JSON.parse(await readFile(resolve('package.json'), 'utf8'));
    console.log(`${pkg.name} ${pkg.version}`);
    console.log('Commands: run, verify, export-proof, replay, scan, architecture');
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
