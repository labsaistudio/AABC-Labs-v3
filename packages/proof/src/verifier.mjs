import { findForbiddenPublicFields } from './redactor.mjs';

export function verifyProofFeed(feed) {
  const errors = [];
  if (!feed.runId) errors.push('runId is required');
  if (!feed.workflowId) errors.push('workflowId is required');
  if (!Array.isArray(feed.artifacts)) errors.push('artifacts must be an array');
  if (!Array.isArray(feed.txRecords)) errors.push('txRecords must be an array');
  const forbidden = findForbiddenPublicFields(feed);
  if (forbidden.length) errors.push(`forbidden public fields: ${forbidden.join(',')}`);
  return { ok: errors.length === 0, errors };
}
