import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePolicy } from '../packages/policy/src/operation-policy-gate.mjs';
import { assertPhaseCCoverage } from '../packages/phase-c/src/phase-c-capabilities.mjs';
import { evaluatePhaseCReadiness } from '../packages/phase-c/src/phase-c-gates.mjs';
import {
  TRUST_BOUNDARY_LAYERS,
  assertTrustBoundary,
  buildCredentialBoundary,
  buildExecutionTraceContract,
  buildProtocolAccessContract,
} from '../packages/trust/src/execution-trust-contract.mjs';

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

test('policy gate blocks phase c signer modes until enabled', () => {
  const decision = evaluatePolicy({
    operationType: 'prepare_deploy',
    riskClass: 'prepare_tx',
    signerMode: 'smart_account_session',
    network: 'mainnet',
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.reason, 'phase_c_signer_not_enabled');
});

test('phase c capabilities are contract-covered and signal gated', () => {
  assert.equal(assertPhaseCCoverage(), true);
  const blocked = evaluatePhaseCReadiness({
    capabilityId: 'solana-session-key',
    signals: [],
  });
  assert.equal(blocked.status, 'blocked_until_signals_exist');
  const ready = evaluatePhaseCReadiness({
    capabilityId: 'solana-session-key',
    signals: ['solana_paid_user_demand'],
  });
  assert.equal(ready.status, 'ready_for_design_review');
});

test('trust contract blocks cross-account credential readiness', () => {
  const credential = buildCredentialBoundary({
    userId: 'user-a',
    ownerUserId: 'user-b',
    capabilityId: 'helius-protocol',
    accessReady: true,
  });
  assert.equal(credential.privateAccessReady, false);
  assert.equal(credential.credentialScope, 'blocked_cross_account');
});

test('trust contract captures execution trace and protocol access', () => {
  const trace = buildExecutionTraceContract({
    workflowId: 'market-monitor',
    steps: [{ key: 'read-market', intent: 'Read market state.' }],
  });
  const protocol = buildProtocolAccessContract({
    capabilityId: 'jupiter-protocol',
    accessMode: 'external_runtime',
    proofRequired: true,
  });
  assert.equal(trace.stages.at(-1).key, 'proof_exported');
  assert.equal(protocol.proofRequired, true);
  assert.equal(assertTrustBoundary({
    layers: TRUST_BOUNDARY_LAYERS,
    credential: { privateAccessReady: true, credentialScope: 'user_scoped' },
  }), true);
});
