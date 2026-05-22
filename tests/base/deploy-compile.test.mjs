import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compileProofRegistry } from '../../src/deploy/compile-proof-registry.mjs';

test('proof registry compiles for Base deployment', async () => {
  const source = await readFile('contracts/BaseWorkflowProofRegistry.sol', 'utf8');
  const compiled = compileProofRegistry(source);
  assert.ok(compiled.bytecode.startsWith('0x'));
  assert.ok(compiled.bytecode.length > 1000);
  assert.ok(compiled.abi.some((item) => item.name === 'recordProof'));
});
