export const cloakPrivacyPaymentPolicy = {
  sponsorSurface: 'cloak-privacy-payments',
  workflow: 'paid-endpoint',
  chain: 'solana',
  mode: 'prepared_only_reference_runtime',
  privacyBoundary: {
    payerPrivacy: 'enabled_for_policy_model',
    merchantSettlement: 'review_before_publish',
    productionCredential: 'configured_outside_public_repository',
    liveSettlement: 'disabled_in_reference_runtime',
  },
  receiptControls: [
    'public_receipt_redaction_required',
    'payment_requirement_required',
    'settlement_review_required',
  ],
  proof: {
    requiredArtifacts: [
      'frontier_capability_plan',
      'openapi_spec',
      'source_package_manifest',
    ],
    reviewSignals: [
      'privacy payment boundary',
      'merchant settlement review',
      'public receipt redaction',
    ],
  },
};

export function buildCloakPaymentIntent({ amountUsd, merchantId }) {
  return {
    sponsorSurface: cloakPrivacyPaymentPolicy.sponsorSurface,
    chain: cloakPrivacyPaymentPolicy.chain,
    amountUsd,
    merchantId,
    preparedOnly: true,
    proofRequired: cloakPrivacyPaymentPolicy.proof.requiredArtifacts,
  };
}
