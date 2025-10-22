import { Canonical } from '../converter/types/canonical';
import { BadRequestException } from '@nestjs/common';

export function parseStringToCanonical(
  content: string,
  segmentSeparator: string,
  elementSeparator: string,
): Canonical {
  const rawSegments = content
    .split(segmentSeparator)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const canonical: Canonical = [];

  for (const segment of rawSegments) {
    const parts = segment.split(elementSeparator).map((elm) => elm.trim());

    if (parts.length === 0) continue;

    const name = parts[0];
    const elements = parts.slice(1);

    canonical.push({ name, elements });
  }

  return canonical;
}

export function parseJsonToCanonical(content: string): Canonical {
  let parsedJson;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    parsedJson = JSON.parse(content);
  } catch (err) {
    throw new BadRequestException(
      `Invalid JSON format provided in the document ${err}`,
    );
  }

  if (typeof parsedJson !== 'object' || parsedJson === null) {
    throw new BadRequestException('JSON must be an object');
  }

  const canonical: Canonical = [];

  for (const [segmentName, arr] of Object.entries(parsedJson)) {
    if (!Array.isArray(arr))
      throw new BadRequestException(
        `JSON segment ${segmentName} must be an array`,
      );

    for (const obj of arr) {
      if (typeof obj !== 'object' || obj === null)
        throw new BadRequestException('Each segment entry must be an object');
      // collect keys like ProductID1, ProductID2 in sorted order
      const keys = Object.keys(obj).sort((a, b) => {
        // try to extract trailing numbers for natural order
        const na = a.match(/(\d+)$/);
        const nb = b.match(/(\d+)$/);
        if (na && nb) return Number(na[1]) - Number(nb[1]);
        return a.localeCompare(b);
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const elements = keys.map((k) => String(obj[k]));
      canonical.push({ name: segmentName, elements });
    }
  }
  return canonical;
}
