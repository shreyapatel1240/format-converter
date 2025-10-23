import { BadRequestException, Logger } from '@nestjs/common';
import { IFormatStrategy } from '../format-strategy.interface';
import { FormatType } from '../../dto/converter.dto';
import { Canonical } from '../../types/canonical';

export class JsonFormatStrategy implements IFormatStrategy {
  private readonly logger = new Logger(JsonFormatStrategy.name);

  getFormatType(): string {
    return FormatType.json;
  }

  parseToCanonical(content: string): Canonical {
    this.logger.log(`Converting JSON content to Canonical`);
    let parsedJson;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      parsedJson = JSON.parse(content);
    } catch (err) {
      this.logger.error(`Invalid JSON format provided in the document ${err}`);
      throw new Error(`Invalid JSON format provided in the document ${err}`);
    }

    if (typeof parsedJson !== 'object' || parsedJson === null) {
      this.logger.error(`JSON must be an object`);
      throw new BadRequestException('JSON must be an object');
    }

    const canonical: Canonical = [];

    for (const [segmentName, arr] of Object.entries(parsedJson)) {
      if (!Array.isArray(arr)) {
        this.logger.error(`JSON segment ${segmentName} must be an array`);
        throw new BadRequestException(
          `JSON segment ${segmentName} must be an array`,
        );
      }

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

  fromCanonical(canonical: Canonical): string {
    this.logger.log(`Converting Canonical to JSON format`);
    if (canonical.length === 0) return '';

    const json: Record<string, any[]> = {};
    for (const segment of canonical) {
      const object: Record<string, string> = {};
      segment.elements.forEach((val, idx) => {
        object[`${segment.name}${idx + 1}`] = val;
      });
      if (!json[segment.name]) json[segment.name] = [];
      json[segment.name].push(object);
    }
    return JSON.stringify(json, null, 2);
  }
}
