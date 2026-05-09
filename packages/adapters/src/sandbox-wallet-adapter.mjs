export async function sandboxWalletAdapter({ step }) {
  return {
    artifacts: [{
      type: 'wallet_checkpoint',
      title: 'Sandbox signer checkpoint',
      path: `artifacts/${step.key}-wallet-checkpoint.json`,
      data: {
        signerMode: step.signerMode,
        broadcasted: false,
        confirmed: false,
      },
      public: true,
    }],
  };
}
