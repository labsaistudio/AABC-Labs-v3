import { getAddress } from 'viem';

export const BASE_CHAIN_ID = 8453;
export const BASE_AGENT_REPORT_PAY_TO = '0xE7DeBBC9DE869D28B914a3F19E1fc192f849FefF';
export const BASE_AGENT_REPORT_MAX_AMOUNT_USDC = '0.01';
export const BASE_USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

const BASE_NETWORKS = new Set(['base', 'eip155:8453']);
const HTTP_METHODS = new Set(['GET', 'POST']);

export function requireHttpsEndpoint(endpoint) {
  const value = String(endpoint || '');
  if (!value.startsWith('https://')) throw new Error('https_endpoint_required');
  return value;
}

export function requireHttpMethod(method) {
  if (!HTTP_METHODS.has(method)) throw new Error('x402_method_must_be_GET_or_POST');
  return method;
}

export function parseUsdcAtomicBudget(value) {
  if (typeof value !== 'string') throw new Error('maxAmountUsdc_must_be_decimal_string');
  if (!/^(0|[1-9]\d*)(\.\d{1,6})?$/.test(value)) throw new Error('maxAmountUsdc_invalid');
  const [whole, fraction = ''] = value.split('.');
  const atomic = BigInt(whole) * 1_000_000n + BigInt(fraction.padEnd(6, '0'));
  if (atomic <= 0n) throw new Error('maxAmountUsdc_must_be_positive');
  return atomic;
}

export function selectBasePaymentRequirement(paymentRequired) {
  if (!paymentRequired || paymentRequired.x402Version !== 1) {
    throw new Error('x402_v1_payment_required_expected');
  }
  const accepts = Array.isArray(paymentRequired.accepts) ? paymentRequired.accepts : [];
  const requirement = accepts.find((item) => (
    item?.scheme === 'exact' && BASE_NETWORKS.has(item?.network)
  ));
  if (!requirement) throw new Error('base_exact_payment_requirement_missing');
  return requirement;
}

export function validateBasePaymentRequirement(paymentRequired, policy) {
  const requirement = selectBasePaymentRequirement(paymentRequired);
  const endpoint = requireHttpsEndpoint(policy?.endpoint);
  const expectedPayTo = requireAddress(policy?.expectedPayTo, 'expectedPayTo');
  const expectedAsset = requireAddress(policy?.expectedAsset ?? BASE_USDC_ADDRESS, 'expectedAsset');
  const maxAmountAtomic = parseUsdcAtomicBudget(policy?.maxAmountUsdc);
  const asset = requireAddress(requirement.asset, 'asset');
  const payTo = requireAddress(requirement.payTo, 'payTo');
  if (asset !== expectedAsset || asset !== BASE_USDC_ADDRESS) throw new Error('base_usdc_asset_required');
  if (payTo !== expectedPayTo) throw new Error('x402_payee_mismatch');
  if (String(requirement.resource || '') !== endpoint) throw new Error('x402_resource_mismatch');
  const amount = parseRequiredAmount(requirement);
  if (amount > maxAmountAtomic) throw new Error('x402_amount_exceeds_budget');
  if (!Number.isInteger(requirement.maxTimeoutSeconds) || requirement.maxTimeoutSeconds <= 0) {
    throw new Error('x402_max_timeout_seconds_required');
  }
  if (!requirement.extra?.name || !requirement.extra?.version) {
    throw new Error('x402_eip712_domain_required');
  }
  return { ...requirement, asset, payTo, amount: amount.toString() };
}

export function requiredAtomicAmount(requirement) {
  return parseRequiredAmount(requirement);
}

export function summarizeRequirement(requirement) {
  return {
    scheme: requirement.scheme,
    network: requirement.network,
    amount: String(requirement.maxAmountRequired ?? requirement.amount),
    asset: requirement.asset,
    payTo: requirement.payTo,
  };
}

export function decodePaymentResponse(value) {
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

function parseRequiredAmount(requirement) {
  const amount = requirement?.maxAmountRequired ?? requirement?.amount;
  if (!/^[0-9]+$/.test(String(amount))) throw new Error('payment_amount_required');
  const atomic = BigInt(amount);
  if (atomic <= 0n) throw new Error('payment_amount_must_be_positive');
  return atomic;
}

function requireAddress(value, label) {
  try {
    return getAddress(String(value || ''));
  } catch {
    throw new Error(`${label}_must_be_valid_evm_address`);
  }
}
