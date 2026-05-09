import { FORBIDDEN_PUBLIC_FIELDS } from './forbidden-fields.mjs';

export function redactPublic(value) {
  if (Array.isArray(value)) return value.map(redactPublic);
  if (!value || typeof value !== 'object') return value;
  const next = {};
  for (const [key, item] of Object.entries(value)) {
    if (FORBIDDEN_PUBLIC_FIELDS.includes(key)) {
      next[key] = '[redacted]';
    } else {
      next[key] = redactPublic(item);
    }
  }
  return next;
}

export function findForbiddenPublicFields(value, path = []) {
  const hits = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => hits.push(...findForbiddenPublicFields(item, [...path, String(index)])));
    return hits;
  }
  if (!value || typeof value !== 'object') return hits;
  for (const [key, item] of Object.entries(value)) {
    if (FORBIDDEN_PUBLIC_FIELDS.includes(key) && item !== '[redacted]') {
      hits.push([...path, key].join('.'));
    }
    hits.push(...findForbiddenPublicFields(item, [...path, key]));
  }
  return hits;
}
