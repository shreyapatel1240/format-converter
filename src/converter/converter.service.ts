import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FormatType } from './dto/converter.dto';
import { FormatStrategyRegistry } from './strategies/format-strategy.registry';

@Injectable()
export class ConverterService {
  private readonly logger = new Logger(ConverterService.name);

  constructor(private readonly strategyRegistry: FormatStrategyRegistry) {}

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

    const fromStrategy = this.strategyRegistry.get(detectedFormat);
    const toStrategy = this.strategyRegistry.get(format);

    try {
      // Convert given format to Canonical
      const canonical = await fromStrategy.parseToCanonical(content, {
        segmentSeparator,
        elementSeparator,
      });

      // Convert Canonical to specified format
      return toStrategy.fromCanonical(canonical, {
        segmentSeparator,
        elementSeparator,
      });
    } catch (err) {
      this.logger.error(`Conversion failed: ${err}`);
      throw new BadRequestException(err);
    }
  }
}
