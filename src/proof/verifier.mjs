export function verifyProof(proof) {
  if (proof?.ecosystem !== 'base') throw new Error('proof_ecosystem_must_be_base');
  if (!proof.product) throw new Error('proof_product_required');
  const completed = proof.steps?.every((step) => step.status === 'completed');
  if (!completed) throw new Error('proof_steps_incomplete');
  const artifactTypes = new Set((proof.artifacts || []).map((item) => item.type));
  for (const required of ['x402_buyer_request', 'x402_seller_endpoint', 'base_proof_record']) {
    if (!artifactTypes.has(required)) throw new Error(`proof_artifact_missing:${required}`);
  }
  return true;
}
