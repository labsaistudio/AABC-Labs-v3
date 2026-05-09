export function buildBatchPlan(recipients) {
  return {
    batches: chunk(recipients, 100),
    tokenProgram: 'spl-token-tooling',
    preparedOnly: true,
  };
}

function chunk(items, size) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size));
}
