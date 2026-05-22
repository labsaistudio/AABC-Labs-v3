import { x402Client } from '@x402/fetch';
import { registerExactEvmScheme } from '@x402/evm/exact/client';
import { createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import {
  BASE_AGENT_REPORT_MAX_AMOUNT_USDC,
  BASE_AGENT_REPORT_PAY_TO,
  BASE_USDC_ADDRESS,
  decodePaymentResponse,
  parseUsdcAtomicBudget,
  requireHttpMethod,
  requireHttpsEndpoint,
  requiredAtomicAmount,
  selectBasePaymentRequirement,
  summarizeRequirement,
  validateBasePaymentRequirement,
} from './payment-policy.mjs';

export const BASE_AGENT_REPORT_ENDPOINT = 'https://app.aabc.app/api/base-agent-report';
export {
  BASE_AGENT_REPORT_MAX_AMOUNT_USDC,
  BASE_AGENT_REPORT_PAY_TO,
  BASE_USDC_ADDRESS,
  parseUsdcAtomicBudget,
  requiredAtomicAmount,
  selectBasePaymentRequirement,
  validateBasePaymentRequirement,
};

const balanceAbi = [{
  name: 'balanceOf',
  type: 'function',
  stateMutability: 'view',
  inputs: [{ name: 'account', type: 'address' }],
  outputs: [{ name: '', type: 'uint256' }],
}];

export function normalizePrivateKey(value) {
  const trimmed = String(value || '').trim();
  if (/^0x[a-fA-F0-9]{64}$/.test(trimmed)) return trimmed;
  if (/^[a-fA-F0-9]{64}$/.test(trimmed)) return `0x${trimmed}`;
  throw new Error('valid_base_agent_payer_signer_required');
}

export function buildPrivateKeySigner(privateKey) {
  return privateKeyToAccount(normalizePrivateKey(privateKey));
}

export function createBasePaymentClient(signer) {
  const client = new x402Client((version, accepts) => (
    selectBasePaymentRequirement({ x402Version: version, accepts })
  ));
  registerExactEvmScheme(client, { signer });
  return client;
}

export async function createBasePaymentHeader({ signer, paymentRequired }) {
  selectBasePaymentRequirement(paymentRequired);
  const payload = await createBasePaymentClient(signer).createPaymentPayload(paymentRequired);
  const header = Buffer.from(JSON.stringify(payload)).toString('base64');
  return { header, payload };
}

export async function fetchPaymentRequired({ endpoint, method = 'GET', fetchImpl = globalThis.fetch }) {
  requireHttpsEndpoint(endpoint);
  const response = await fetchImpl(endpoint, { method: requireHttpMethod(method) });
  if (response.status !== 402) throw new Error(`payment_required_response_expected:${response.status}`);
  const body = await response.json();
  selectBasePaymentRequirement(body);
  return body;
}

export async function payBaseProtectedResource({
  signer,
  endpoint,
  method,
  maxAmountUsdc,
  expectedPayTo,
  fetchImpl = globalThis.fetch,
  paymentRequired,
}) {
  requireHttpsEndpoint(endpoint);
  const requestMethod = requireHttpMethod(method);
  const required = paymentRequired ?? await fetchPaymentRequired({ endpoint, method: requestMethod, fetchImpl });
  const requirement = validateBasePaymentRequirement(required, {
    endpoint,
    maxAmountUsdc,
    expectedPayTo,
  });
  const { header, payload } = await createBasePaymentHeader({ signer, paymentRequired: required });
  const response = await fetchImpl(endpoint, {
    method: requestMethod,
    headers: {
      'X-PAYMENT': header,
      'Access-Control-Expose-Headers': 'PAYMENT-RESPONSE,X-PAYMENT-RESPONSE',
    },
  });
  const paymentResponse = response.headers.get('X-PAYMENT-RESPONSE') ?? response.headers.get('PAYMENT-RESPONSE');
  return {
    endpoint,
    method: requestMethod,
    payer: signer.address,
    status: response.status,
    ok: response.ok,
    paymentPayloadVersion: payload.x402Version,
    requirement: summarizeRequirement(requirement),
    paymentResponse,
    paymentResponseDecoded: decodePaymentResponse(paymentResponse),
    body: await response.text(),
  };
}

export async function payBaseAgentReport({
  signer,
  endpoint = BASE_AGENT_REPORT_ENDPOINT,
  fetchImpl = globalThis.fetch,
  paymentRequired,
}) {
  return payBaseProtectedResource({
    signer,
    endpoint,
    method: 'GET',
    maxAmountUsdc: BASE_AGENT_REPORT_MAX_AMOUNT_USDC,
    expectedPayTo: BASE_AGENT_REPORT_PAY_TO,
    fetchImpl,
    paymentRequired,
  });
}

export async function readBaseUsdcBalance({ address, rpcUrl }) {
  if (!rpcUrl) throw new Error('base_mainnet_rpc_url_required');
  const client = createPublicClient({ chain: base, transport: http(rpcUrl) });
  return client.readContract({
    address: BASE_USDC_ADDRESS,
    abi: balanceAbi,
    functionName: 'balanceOf',
    args: [address],
  });
}

export async function assertSufficientBaseUsdc({ address, rpcUrl, requiredAtomic }) {
  const balance = await readBaseUsdcBalance({ address, rpcUrl });
  if (balance < requiredAtomic) {
    throw new Error(`insufficient_base_usdc:${balance.toString()}:${requiredAtomic.toString()}`);
  }
  return balance;
}
