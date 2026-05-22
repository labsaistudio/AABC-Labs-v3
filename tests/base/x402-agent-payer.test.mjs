import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASE_AGENT_REPORT_ENDPOINT,
  BASE_AGENT_REPORT_PAY_TO,
  BASE_USDC_ADDRESS,
  createBasePaymentHeader,
  fetchPaymentRequired,
  normalizePrivateKey,
  payBaseAgentReport,
  payBaseProtectedResource,
  parseUsdcAtomicBudget,
  requiredAtomicAmount,
  selectBasePaymentRequirement,
  validateBasePaymentRequirement,
} from '../../src/x402/agent-payer.mjs';

const paymentRequired = Object.freeze({
  x402Version: 1,
  error: 'X-PAYMENT header is required',
  accepts: [Object.freeze({
    scheme: 'exact',
    network: 'base',
    maxAmountRequired: '10000',
    resource: BASE_AGENT_REPORT_ENDPOINT,
    description: 'AABC Base Agent Report',
    mimeType: 'application/json',
    payTo: BASE_AGENT_REPORT_PAY_TO,
    maxTimeoutSeconds: 300,
    asset: BASE_USDC_ADDRESS,
    outputSchema: {},
    extra: { name: 'USD Coin', version: '2' },
  })],
});

test('agent payer creates a v1 Base x402 payment header', async () => {
  const signer = fakeSigner();
  const { header, payload } = await createBasePaymentHeader({ signer, paymentRequired });
  const decoded = JSON.parse(Buffer.from(header, 'base64').toString('utf8'));

  assert.equal(payload.x402Version, 1);
  assert.equal(decoded.scheme, 'exact');
  assert.equal(decoded.network, 'base');
  assert.equal(decoded.payload.authorization.from, signer.address);
  assert.equal(decoded.payload.authorization.to, paymentRequired.accepts[0].payTo);
  assert.equal(decoded.payload.authorization.value, '10000');
  assert.match(decoded.payload.signature, /^0x[0-9a-f]{130}$/);
});

test('agent payer fetches 402 requirements and retries with X-PAYMENT', async () => {
  const calls = [];
  const result = await payBaseAgentReport({
    signer: fakeSigner(),
    endpoint: BASE_AGENT_REPORT_ENDPOINT,
    fetchImpl: async (endpoint, init = {}) => {
      calls.push({ endpoint: String(endpoint), payment: init.headers?.['X-PAYMENT'] });
      if (!init.headers?.['X-PAYMENT']) {
        return jsonResponse(paymentRequired, 402);
      }
      return jsonResponse({ product: 'AABC Base Agent Report' }, 200);
    },
  });

  assert.equal(calls.length, 2);
  assert.equal(calls[0].payment, undefined);
  assert.match(calls[1].payment, /^[A-Za-z0-9+/]+=*$/);
  assert.equal(result.status, 200);
  assert.equal(result.ok, true);
  assert.equal(result.requirement.payTo, BASE_AGENT_REPORT_PAY_TO);
  assert.equal(result.requirement.asset, BASE_USDC_ADDRESS);
  assert.match(result.body, /AABC Base Agent Report/);
});

test('agent payer validates payment requirements and key format', async () => {
  const selected = selectBasePaymentRequirement(paymentRequired);
  const validated = validateBasePaymentRequirement(paymentRequired, {
    endpoint: BASE_AGENT_REPORT_ENDPOINT,
    maxAmountUsdc: '0.01',
    expectedPayTo: BASE_AGENT_REPORT_PAY_TO,
  });
  assert.equal(requiredAtomicAmount(selected), 10000n);
  assert.equal(validated.amount, '10000');
  assert.equal(parseUsdcAtomicBudget('0.01'), 10000n);
  assert.equal(normalizePrivateKey('a'.repeat(64)), `0x${'a'.repeat(64)}`);
  assert.throws(() => normalizePrivateKey('bad'), /valid_base_agent_payer_signer_required/);
  assert.throws(() => parseUsdcAtomicBudget(0.01), /maxAmountUsdc_must_be_decimal_string/);
  assert.throws(() => parseUsdcAtomicBudget('0'), /maxAmountUsdc_must_be_positive/);
  await assert.rejects(
    () => fetchPaymentRequired({ endpoint: 'http://example.com' }),
    /https_endpoint_required/,
  );
});

test('agent payer blocks mismatched x402 terms before signing', async () => {
  await assert.rejects(
    () => payBaseProtectedResource({
      signer: fakeSigner(),
      endpoint: BASE_AGENT_REPORT_ENDPOINT,
      method: 'GET',
      maxAmountUsdc: '0.01',
      expectedPayTo: BASE_AGENT_REPORT_PAY_TO,
      paymentRequired: mutateRequirement({ maxAmountRequired: '10001' }),
      fetchImpl: async () => jsonResponse({ ok: true }, 200),
    }),
    /x402_amount_exceeds_budget/,
  );
  assert.throws(
    () => validateBasePaymentRequirement(mutateRequirement({ asset: '0x0000000000000000000000000000000000000000' }), {
      endpoint: BASE_AGENT_REPORT_ENDPOINT,
      maxAmountUsdc: '0.01',
      expectedPayTo: BASE_AGENT_REPORT_PAY_TO,
    }),
    /base_usdc_asset_required/,
  );
  assert.throws(
    () => validateBasePaymentRequirement(paymentRequired, {
      endpoint: BASE_AGENT_REPORT_ENDPOINT,
      maxAmountUsdc: '0.01',
      expectedPayTo: '0x0000000000000000000000000000000000000001',
    }),
    /x402_payee_mismatch/,
  );
  assert.throws(
    () => validateBasePaymentRequirement(paymentRequired, {
      endpoint: 'https://example.com/other-resource',
      maxAmountUsdc: '0.01',
      expectedPayTo: BASE_AGENT_REPORT_PAY_TO,
    }),
    /x402_resource_mismatch/,
  );
});

function fakeSigner() {
  return {
    address: '0x0000000000000000000000000000000000000001',
    signTypedData: async () => `0x${'1'.repeat(130)}`,
  };
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function mutateRequirement(overrides) {
  return {
    ...paymentRequired,
    accepts: [{ ...paymentRequired.accepts[0], ...overrides }],
  };
}
