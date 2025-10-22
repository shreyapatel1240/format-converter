import { Canonical } from '../converter/types/canonical';

export function canonicalToString(
  canonical: Canonical,
  segmentSeparator: string,
  elementSeparator: string,
): string {
  if (canonical.length === 0) return '';

  const segments = canonical.map((segment) => {
    const parts = [segment.name, ...segment.elements];
    return parts.join(elementSeparator);
  });
  return segments.join(segmentSeparator) + segmentSeparator;
}

export function canonicalToJson(canonical: Canonical): any {
  const out: Record<string, any[]> = {};
  for (const segment of canonical) {
    const obj: Record<string, string> = {};
    segment.elements.forEach((val, idx) => {
      obj[`${segment.name}${idx + 1}`] = val;
    });
    if (!out[segment.name]) out[segment.name] = [];
    out[segment.name].push(obj);
  }
  return out;
}
