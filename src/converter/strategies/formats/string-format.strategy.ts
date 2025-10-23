import { BadRequestException, Logger } from '@nestjs/common';
import { FormatType } from '../../dto/converter.dto';
import { IFormatStrategy } from '../format-strategy.interface';
import { Canonical } from 'src/converter/types/canonical';

export class StringFormatStrategy implements IFormatStrategy {
  private readonly logger = new Logger(StringFormatStrategy.name);

  getFormatType(): string {
    return FormatType.string;
  }

  parseToCanonical(
    content: string,
    options: { segmentSeparator: string; elementSeparator: string },
  ): Canonical {
    this.logger.log(`Converting string content to Canonical`);
    const { segmentSeparator, elementSeparator } = options;
    if (!segmentSeparator || !elementSeparator) {
      this.logger.error(
        'segmentSeparator and elementSeparator are required for the string format',
      );
      throw new BadRequestException(
        'segmentSeparator and elementSeparator are required for the string format',
      );
    }

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

  fromCanonical(
    canonical: Canonical,
    options: { segmentSeparator: string; elementSeparator: string },
  ): string {
    this.logger.log(`Converting Canonical to string format`);
    const { segmentSeparator, elementSeparator } = options;
    if (!segmentSeparator || !elementSeparator) {
      this.logger.warn(
        'The segment separator or element separator is not given. It will take default separators.',
      );
    }
    const segSeparator = segmentSeparator || '~';
    const eleSeparator = elementSeparator || '*';

    if (canonical.length === 0) return '';

    const segments = canonical.map((segment) => {
      const parts = [segment.name, ...segment.elements];
      return parts.join(eleSeparator);
    });
    return segments.join(segSeparator) + segSeparator;
  }
}
