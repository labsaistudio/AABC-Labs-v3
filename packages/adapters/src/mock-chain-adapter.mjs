import { preparedTx } from '../../proof/src/record-tx.mjs';

export async function mockChainAdapter({ step }) {
  return {
    tx: preparedTx({
      stepKey: step.key,
      operationType: step.operationType,
      signerMode: step.signerMode,
      chain: step.chain || 'solana',
      network: step.network || 'testnet',
    }),
    artifacts: step.expectedArtifacts.map((type) => ({
      type,
      title: `${step.key} ${type}`,
      path: `artifacts/${step.key}-${type}.json`,
      data: { stepKey: step.key, generated: true },
      public: true,
    })),
  };
}
