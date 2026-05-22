import { wrapFetchWithPayment, x402Client } from '@x402/fetch';
import { registerExactEvmScheme } from '@x402/evm/exact/client';

const BASE_USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

type EvmSigner = {
  address: `0x${string}`;
  signTypedData: (request: unknown) => Promise<`0x${string}`>;
};

type PaymentRequirement = {
  scheme?: string;
  network?: string;
  resource?: string;
  maxAmountRequired?: string;
  asset?: string;
  payTo?: string;
};

type PaymentPolicy = {
  endpoint: string;
  expectedPayTo: string;
  maxAmountAtomic: string;
};

export function selectSafeBaseRequirement(
  accepts: PaymentRequirement[],
  policy: PaymentPolicy,
) {
  const selected = accepts.find((item) => (
    item.scheme === 'exact' && item.network === 'eip155:8453'
  ));
  if (!selected) throw new Error('base_exact_payment_requirement_missing');
  if (selected.resource !== policy.endpoint) throw new Error('x402_resource_mismatch');
  if (selected.asset !== BASE_USDC_ADDRESS) throw new Error('base_usdc_asset_required');
  if (selected.payTo?.toLowerCase() !== policy.expectedPayTo.toLowerCase()) {
    throw new Error('x402_payee_mismatch');
  }
  if (!/^[0-9]+$/.test(String(selected.maxAmountRequired))) {
    throw new Error('x402_amount_required');
  }
  if (BigInt(selected.maxAmountRequired) > BigInt(policy.maxAmountAtomic)) {
    throw new Error('x402_amount_exceeds_budget');
  }
  return selected;
}

export function buildBasePaidFetch(signer: EvmSigner, policy: PaymentPolicy) {
  const client = new x402Client();
  registerExactEvmScheme(client, {
    signer,
    networks: ['eip155:8453'],
  });
  return wrapFetchWithPayment(fetch, client, {
    paymentRequirementsSelector: (accepts) => selectSafeBaseRequirement(accepts, policy),
  });
}

export async function callPaidAgentReport({
  signer,
  endpoint,
  expectedPayTo,
  maxAmountAtomic,
}: {
  signer: EvmSigner;
  endpoint: string;
  expectedPayTo: string;
  maxAmountAtomic: string;
}) {
  if (!endpoint.startsWith('https://')) throw new Error('https_endpoint_required');
  const paidFetch = buildBasePaidFetch(signer, {
    endpoint,
    expectedPayTo,
    maxAmountAtomic,
  });
  const response = await paidFetch(endpoint, { method: 'GET' });
  return {
    status: response.status,
    body: await response.text(),
    paymentResponse: response.headers.get('X-PAYMENT-RESPONSE'),
  };
}
