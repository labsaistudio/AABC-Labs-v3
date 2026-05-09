import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePolicy } from '../packages/policy/src/operation-policy-gate.mjs';

test('policy gate blocks irreversible mainnet session wallet actions', () => {
  const decision = evaluatePolicy({
    operationType: 'lp_lock',
    riskClass: 'irreversible',
    signerMode: 'session_wallet',
    network: 'mainnet',
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.reason, 'irreversible_session_mainnet_blocked');
});

test('policy gate allows prepare only steps', () => {
  const decision = evaluatePolicy({
    operationType: 'prepare_deploy',
    riskClass: 'prepare_tx',
    signerMode: 'prepare_only',
    network: 'mainnet',
  });
  assert.equal(decision.allowed, true);
});
