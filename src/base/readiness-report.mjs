export function buildReadinessReport(pack) {
  const ready = pack.readinessChecks.filter((item) => item.status === 'ready');
  const placeholders = pack.readinessChecks.filter((item) => item.status === 'placeholder');
  return {
    product: pack.product,
    ecosystem: pack.ecosystem,
    readyCount: ready.length,
    placeholderCount: placeholders.length,
    nextRequiredEvidence: placeholders.map((item) => item.id),
    canSubmit: placeholders.length === 0,
  };
}
