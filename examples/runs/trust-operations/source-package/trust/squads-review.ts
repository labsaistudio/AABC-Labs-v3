export const squadsReview = {
  protocol: 'squads-protocol',
  threshold: '2-of-3',
  requiredArtifacts: ['authority_scan', 'lock_plan'],
};

export function buildReviewPacket(plan) {
  return {
    title: 'Trust operation review',
    plan,
    approverAction: 'review-prepared-transaction',
  };
}
