import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Canonical } from './types/canonical';
import { canonicalToXml, parseXmlToCanonical } from '../utils/xml.utils';
import {
  parseJsonToCanonical,
  parseStringToCanonical,
} from '../utils/parser.utils';
import { canonicalToJson, canonicalToString } from '../utils/converter.utils';
import { FormatType } from './dto/converter.dto';

@Injectable()
export class ConverterService {
  private readonly logger = new Logger(ConverterService.name);

  private detectFormat(input: string): FormatType {
    if (input.trim().startsWith('{') || input.trim().startsWith('['))
      return FormatType.json;
    if (input.trim().startsWith('<') && input.trim().endsWith('>'))
      return FormatType.xml;
    return FormatType.string;
  }

  async convert(
    content: string,
    format: FormatType,
    segmentSeparator?: string,
    elementSeparator?: string,
  ): Promise<any> {
    // Identify the given format
    const detectedFormat = this.detectFormat(content);
    this.logger.log(`The given document format is '${detectedFormat}'`);
    let canonical: Canonical;

    // Convert the given format to Canonical
    switch (detectedFormat) {
      case FormatType.string:
        if (!segmentSeparator || !elementSeparator) {
          this.logger.error(
            'segmentSeparator and elementSeparator are required for the string format',
          );
          throw new BadRequestException(
            'segmentSeparator and elementSeparator are required for the string format',
          );
        }
        this.logger.log('Parsing "string" to canonical format');
        canonical = parseStringToCanonical(
          content,
          segmentSeparator,
          elementSeparator,
        );
        break;

      case FormatType.json:
        this.logger.log('Parsing "JSON" to canonical format');
        canonical = parseJsonToCanonical(content);
        break;

      case FormatType.xml:
        this.logger.log('Parsing "XML" to canonical format');
        canonical = await parseXmlToCanonical(content);
        break;

      default:
        this.logger.error('The document format is not supported');
        throw new BadRequestException('The document format is not supported');
    }

    // Convert the Canonical to the expected format
    this.logger.log(`Convertin canonical format to ${format}`);
    switch (format) {
      case FormatType.string: {
        if (!segmentSeparator || !elementSeparator) {
          this.logger.warn(
            'The segment separator or element separator is not given. It will take default separators.',
          );
        }
        const segSeparator = segmentSeparator || '~';
        const eleSeparator = elementSeparator || '*';
        return canonicalToString(canonical, segSeparator, eleSeparator);
      }

      case FormatType.json:
        return canonicalToJson(canonical);

      case FormatType.xml:
        return canonicalToXml(canonical);

      default:
        this.logger.error('The specified format does not supported');
        throw new BadRequestException(
          'The specified format does not supported',
        );
    }
  }
}
