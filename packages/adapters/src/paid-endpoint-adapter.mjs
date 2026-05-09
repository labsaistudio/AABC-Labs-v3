export async function paidEndpointAdapter({ step }) {
  return {
    artifacts: [{
      type: 'openapi_spec',
      title: 'Paid endpoint OpenAPI contract',
      path: `artifacts/${step.key}-openapi.json`,
      data: {
        method: 'POST',
        path: '/x402/wallet-risk',
        payment: 'required',
      },
      public: true,
    }],
  };
}
