import { redactPublic } from './redactor.mjs';

export function createProofLedger({ runId, workflowId }) {
  const txRecords = [];
  const artifacts = [];
  return {
    recordTx(tx) {
      const row = {
        id: tx.id || `tx-${txRecords.length + 1}`,
        status: tx.status || 'prepared',
        public: tx.public !== false,
        ...tx,
      };
      txRecords.push(row);
      return row;
    },
    recordArtifact(artifact) {
      const row = {
        id: artifact.id || `artifact-${artifacts.length + 1}`,
        public: artifact.public !== false,
        ...artifact,
      };
      artifacts.push(row);
      return row;
    },
    publicFeed() {
      return redactPublic({
        runId,
        workflowId,
        txRecords: txRecords.filter((tx) => tx.public).map(stripPrivatePayload),
        artifacts: artifacts.filter((artifact) => artifact.public).map(stripPrivatePayload),
      });
    },
    snapshot() {
      return { runId, workflowId, txRecords, artifacts };
    },
  };
}

function stripPrivatePayload(row) {
  const { privatePayload, ...publicRow } = row;
  return publicRow;
}
