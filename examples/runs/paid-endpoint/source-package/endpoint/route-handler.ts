export function handler(request) {
  if (!request.payment) {
    return {
      status: 402,
      payment: 'required',
      accepts: ['x402-solana-usdc'],
    };
  }
  return { status: 200, body: { access: 'granted' } };
}
