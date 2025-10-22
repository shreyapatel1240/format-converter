/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { parseStringPromise } from 'xml2js';
import * as js2xmlparser from 'js2xmlparser';
import { Canonical } from '../converter/types/canonical';

export async function parseXmlToCanonical(xml: string): Promise<Canonical> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const parsed = await parseStringPromise(xml, {
    explicitArray: false,
    explicitRoot: false,
  });

  // parsed can be an object where keys are segment names and values are either objects or arrays.
  // We normalize by iterating over keys and creating segments per entry.

  const root = parsed.root ?? parsed; // support when <root> exists or direct children

  const segments: Canonical = [];

  for (const [key, value] of Object.entries(root)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const elems = Object.keys(item)
          .sort()
          .map((k) => String(item[k]));
        segments.push({ name: key, elements: elems });
      }
    } else if (typeof value === 'object') {
      const elems = Object.keys(value!)
        .sort()
        .map((k) => String(value![k]));
      segments.push({ name: key, elements: elems });
    } else {
      // scalar (rare)
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      segments.push({ name: key, elements: [String(value)] });
    }
  }

  return segments;
}

export function canonicalToXml(segments: Canonical): string {
  if (segments.length === 0) return '';
  // Build a structure where repeated tags are allowed
  const root: any = {};
  for (const seg of segments) {
    const obj: any = {};
    seg.elements.forEach((val, idx) => {
      obj[`${seg.name}${idx + 1}`] = val;
    });
    // If root[seg.name] exists and is array -> push, if exists and object -> convert to array
    if (!root[seg.name]) {
      root[seg.name] = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    root[seg.name].push(obj);
  }

  // js2xmlparser will convert root into <root>...</root>
  return js2xmlparser.parse('root', root);
}
